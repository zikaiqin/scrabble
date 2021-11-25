/* eslint-disable max-lines */
// TODO remove this after refactoring game.service
import { Timer } from '@app/classes/timer';
import { Game } from '@app/classes/game';
import { Board } from '@app/classes/board';
import { Player } from '@app/classes/player';
import { MessageType } from '@app/classes/message';
import { GameInfo, GameMode, GameType, PlayerInfo } from '@app/classes/game-info';
import { BOT_MARKER, DEFAULT_BONUSES, DEFAULT_BOT_NAMES, DEFAULT_SOCKET_TIMEOUT, DEFAULT_TURN_TIMEOUT } from '@app/classes/config';
import { BotService } from '@app/services/bot.service';
import { EndGameService } from '@app/services/end-game.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { SocketService } from '@app/services/socket.service';
import { ValidationService } from '@app/services/validation.service';
import { HighscoreService } from '@app/services/highscore.service';
import { Score } from '@app/classes/highscore';
import { Service } from 'typedi';
import { ObjectivesService } from '@app/services/objectives';

@Service()
export class GameService {
    // Key -- ID of the room <br>
    // Value -- Game being played in room
    readonly games = new Map<string, Game>();

    // Key -- ID of the room <br>
    // Value -- Timer of the room
    readonly timers = new Map<string, Timer>();

    constructor(
        private socketService: SocketService,
        private botService: BotService,
        private endGameService: EndGameService,
        private exchangeService: ExchangeService,
        private placingService: PlacingService,
        private validationService: ValidationService,
        private objectvesService: ObjectivesService,
        private highscoreService: HighscoreService,
    ) {}

    attachSocketListeners() {
        this.socketService.socketEvents
            .on('createGame', (roomID: string, configs: GameInfo, players: PlayerInfo[]) => {
                this.createGame(roomID, configs, players);
            })
            .on('exchange', (socketID: string, roomId: string, letters: string) => {
                const game = this.games.get(roomId);
                if (game === undefined) {
                    return;
                }
                const player = game.players.get(socketID);
                if (player === undefined) {
                    return;
                }
                this.exchangeService.exchangeLetters(letters, player, game.reserve);
                this.socketService.updateReserve(roomId, game.reserve.letters);
                this.updateHands(game);
                this.endGameService.resetTurnSkipCount(roomId);
                this.changeTurn(roomId);
            })
            .on('place', (socketID: string, roomId: string, startCoords: string, letters: [string, string][]) => {
                const toPlace = new Map<string, string>(letters);
                const game = this.games.get(roomId);
                if (game === undefined) {
                    return;
                }
                const player = game.players.get(socketID);
                if (player === undefined) {
                    return;
                }
                this.placingService.placeLetters(toPlace, game.board, player);
                this.validationService.init(startCoords, toPlace, game.board);
                this.socketService.updateBoard(socketID, game.board.letters);
                this.socketService.updateHands(socketID, player.hand, Array.from(game.players.values()).filter((p) => p !== player)[0].hand);

                // TODO: Move to validation.service as game.service is getting too long
                const isValidWord = this.validationService.findWord(this.validationService.fetchWords());
                setTimeout(() => {
                    if (isValidWord) {
                        player.score += this.validationService.calcPoints();
                        for (const objective of game.publicObj) {
                            const objNumber = objective[0];
                            if (this.objectvesService.checkObjective(objNumber, toPlace, game)) {
                                if (game.completePublic(objNumber)) player.score += this.objectvesService.getPoints(objNumber);
                            }
                        }
                        if (this.objectvesService.checkObjective(player.privateObj[0], toPlace, game)) {
                            if (player.completePrivate()) player.score += this.objectvesService.getPoints(player.privateObj[0]);
                        }
                        this.placingService.replenishHand(game.reserve, player);
                        this.socketService.updateReserve(roomId, game.reserve.letters);
                        this.updateScores(game);
                        this.endGameService.resetTurnSkipCount(roomId);
                    } else {
                        game.validTurnCounter = 0;
                        this.placingService.returnLetters(toPlace, game.board, player);
                        this.socketService.sendMessage(socketID, MessageType.System, 'Votre placement forme des mots invalides');
                    }
                    this.socketService.updateBoard(roomId, game.board.letters);
                    this.socketService.updateObjectives(socketID, game.publicObj, player.privateObj);
                    this.updateHands(game);
                }, DEFAULT_TURN_TIMEOUT);

                this.changeTurn(roomId);
            })
            .on('skipTurn', (roomID: string) => {
                this.endGameService.incrementTurnSkipCount(roomID);
                this.changeTurn(roomID);
            })
            .on('disconnect', (socketID: string, roomID: string) => {
                if (Array.from(this.socketService.activeRooms.values()).includes(roomID)) {
                    const game = this.games.get(roomID);
                    const timer = this.timers.get(roomID);
                    if (game === undefined || timer === undefined) {
                        return;
                    }
                    timer.lock();
                    const entries = game.players.entries();
                    Array.from(entries).forEach(([id, player]) => {
                        if (id === socketID) {
                            this.socketService.sendMessage(roomID, MessageType.System, `${player.name} a quitté le jeu!`);
                        } else {
                            setTimeout(() => {
                                this.socketService.updateTurn(roomID, false);
                                this.socketService.gameEnded(roomID, player.name);
                                timer.clearTimer();
                            }, DEFAULT_SOCKET_TIMEOUT);
                        }
                    });
                } else {
                    this.deleteRoom(roomID);
                }
            })
            .on('updateObjectives', (socketId: string, roomId: string) => {
                const game = this.games.get(roomId);
                if (game === undefined) {
                    return;
                }
                const player = game.players.get(socketId);
                if (player === undefined) {
                    return;
                }
                this.socketService.updateObjectives(socketId, game.publicObj, player.privateObj);
            });
    }

    attachBotListeners() {
        this.botService.botEvents
            .on('skipTurn', (roomID) => {
                this.socketService.sendMessage(roomID, MessageType.User, '!passer');
                this.endGameService.incrementTurnSkipCount(roomID);
                this.changeTurn(roomID);
            })
            .on('place', (roomID) => {
                /* DO SOMETHING */ void roomID;
            })
            .on('exchange', (roomID) => {
                /* DO SOMETHING */ void roomID;
            });
    }

    createGame(roomID: string, configs: GameInfo, players: PlayerInfo[]) {
        const game = this.setupGame(roomID, configs, players);
        const timer = this.setupTimer(roomID, configs, game);

        this.games.set(roomID, game);
        this.timers.set(roomID, timer);
        this.endGameService.turnSkipMap.set(roomID, 0);

        this.sendConfigs(configs, game);
        timer.changeTurn();
    }

    setupGame(roomID: string, configs: GameInfo, playerInfos: PlayerInfo[]): Game {
        // Generate entries for player map
        const players: [string, Player][] = playerInfos.map((entry) => {
            const player = new Player(entry.username);
            return [entry.socketID, player];
        });
        if (configs.gameType === GameType.Single) {
            // If single player, add a bot to the map entries
            const bot = new Player(this.getBotName(playerInfos[0].username, configs.difficulty as number));
            const botID = `${BOT_MARKER}${playerInfos[0].socketID}`;
            players.push([botID, bot]);
            this.botService.games.set(botID, roomID);
        }
        const bonuses = this.getBonuses(!!configs.randomized);

        const publicObj: [number, boolean][] = [];
        if (configs.gameMode === GameMode.Log2990) {
            // If the gameMode is LOG2990 (with objectives)
            const tempObj = this.objectvesService.getPublicObjectives();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < tempObj.length; i++) {
                publicObj.push([tempObj[i], false]);
            }
            Array.from(players.values()).forEach((player) => {
                player[1].privateObj = [this.objectvesService.getPrivateObjectives(), false];
            });
            this.objectvesService.resetObjArray();
        }
        return new Game(new Board(bonuses), new Map(players), publicObj);
    }

    setupTimer(roomID: string, configs: GameInfo, game: Game): Timer {
        const timer = new Timer(configs.turnLength as number);
        const players = Array.from(game.players.entries()).map(([socketID, player]) => {
            return { socketID, player };
        });
        timer
            .on(Timer.events.updateTime, (time: number) => {
                this.socketService.updateTime(roomID, time);
            })
            .on(Timer.events.updateTurn, (turnState: boolean) => {
                if (this.gameEnded(roomID, game, players[0].player, players[1].player)) {
                    this.deleteRoom(roomID);
                    const player1Score = new Score(players[0].player.name, players[0].player.score);
                    const player2Score = new Score(players[1].player.name, players[1].player.score);
                    this.highscoreService.updateHighscore(player1Score, configs.gameMode as number);
                    this.highscoreService.updateHighscore(player2Score, configs.gameMode as number);
                    this.highscoreService.getHighscore(configs.gameMode as number).then((highScore) => {
                        this.socketService.updateHighscores(highScore, configs.gameMode as number);
                    });
                    return;
                }
                this.updateTurn(players[0].socketID, turnState, timer);
                this.updateTurn(players[1].socketID, !turnState, timer);
            })
            .on(Timer.events.timeElapsed, (turnState: boolean) => {
                this.endGameService.incrementTurnSkipCount(roomID);
                this.socketService.sendMessage(players[0].socketID, turnState ? MessageType.Own : MessageType.User, '!passer');
                if (configs.gameType === GameType.Multi) {
                    this.socketService.sendMessage(players[1].socketID, turnState ? MessageType.User : MessageType.Own, '!passer');
                }
                timer.changeTurn();
            });

        return timer;
    }

    sendConfigs(configs: GameInfo, game: Game): void {
        const players = Array.from(game.players.entries()).map(([socketID, player]) => {
            return { socketID, username: player.name, hand: player.hand };
        });
        this.socketService.setConfigs(
            players[0].socketID,
            players[0].username,
            players[1].username,
            game.board.bonuses,
            game.reserve.letters,
            players[0].hand,
            configs.gameMode as number,
            false,
        );
        if (configs.gameType === GameType.Single) {
            return;
        }
        this.socketService.setConfigs(
            players[1].socketID,
            players[1].username,
            players[0].username,
            game.board.bonuses,
            game.reserve.letters,
            players[1].hand,
            configs.gameMode as number,
            false,
        );
    }

    getBonuses(randomized: boolean): Map<string, string> {
        if (!randomized) {
            return DEFAULT_BONUSES;
        }
        // Randomly sort the coords
        const coords = Array.from(DEFAULT_BONUSES.keys()).sort(() => HALF - Math.random());
        const multiplier = Array.from(DEFAULT_BONUSES.values());
        return new Map(coords.map((key, index) => [key, multiplier[index]]));
    }

    getBotName(playerName: string, difficulty: number): string {
        void difficulty;
        const validBotNames = DEFAULT_BOT_NAMES.easy.filter((name) => name !== playerName);
        return validBotNames[Math.floor(Math.random() * validBotNames.length)];
    }

    // TODO: Move to end-game.service as game.service is getting too long
    gameEnded(roomID: string, game: Game, player1: Player, player2: Player): boolean {
        const gameEnd: boolean = this.endGameService.checkIfGameEnd(game.reserve, player1, player2, roomID);
        if (!gameEnd) {
            return false;
        }
        this.endGameService.setPoints(player1, player2);
        this.socketService.gameEnded(roomID, this.endGameService.getWinner(player1, player2));
        for (const message of this.endGameService.showLettersLeft(player1, player2)) {
            this.socketService.sendMessage(roomID, MessageType.System, message);
        }
        this.socketService.updateTurn(roomID, false);
        this.updateScores(game);
        return true;
    }

    changeTurn(roomID: string): void {
        const timer = this.timers.get(roomID);
        if (timer === undefined) {
            return;
        }
        if (timer.isLocked) {
            this.socketService.updateTurn(roomID, false);
        } else {
            timer.changeTurn();
        }
    }

    /**
     * @description Sends turn updates to sockets. Ends one's turn immediately, but waits 3 seconds to start other's turn.
     * @param socketID
     * @param turnState
     * @param timer
     */
    updateTurn(socketID: string, turnState: boolean, timer: Timer) {
        // Check if the "socket" ID belongs to a bot
        const roomID = this.botService.games.get(socketID);
        if (turnState) {
            // If player on socketID is about to start their turn
            setTimeout(() => {
                timer.startTimer();
                if (roomID) {
                    // If bot, activate the service
                    this.botService.activate(socketID, this.games.get(roomID) as Game);
                } else {
                    // Else send turn update to player
                    this.socketService.updateTurn(socketID, turnState);
                }
            }, DEFAULT_TURN_TIMEOUT);
        } else if (!roomID) {
            // If player, activate the service
            this.socketService.updateTurn(socketID, turnState);
        }
    }

    updateHands(game: Game) {
        const entries = Array.from(game.players.entries());
        this.socketService.updateHands(entries[0][0], entries[0][1].hand, entries[1][1].hand);
        this.socketService.updateHands(entries[1][0], entries[1][1].hand, entries[0][1].hand);
    }

    updateScores(game: Game) {
        const entries = Array.from(game.players.entries());
        this.socketService.updateScores(entries[0][0], entries[0][1].score, entries[1][1].score);
        this.socketService.updateScores(entries[1][0], entries[1][1].score, entries[0][1].score);
    }

    deleteRoom(roomID: string): void {
        const players = this.games.get(roomID)?.players;
        if (players === undefined) {
            return;
        }
        // If either of the players are bots, delete them from the map
        Array.from(players.keys()).forEach((id) => this.botService.games.delete(id));
        this.games.delete(roomID);
        this.timers.get(roomID)?.clearTimer();
        this.timers.delete(roomID);
    }
}

const HALF = 0.5;
