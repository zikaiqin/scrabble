import { Timer } from '@app/classes/timer';
import { Game } from '@app/classes/game';
import { Board } from '@app/classes/board';
import { Player } from '@app/classes/player';
import { MessageType } from '@app/classes/message';
import { GameInfo, GameType } from '@app/classes/game-info';
import { DEFAULT_BONUSES, DEFAULT_BOT_NAMES, DEFAULT_SOCKET_TIMEOUT, DEFAULT_TURN_LENGTH, DEFAULT_TURN_TIMEOUT } from '@app/classes/game-config';
import { BotService } from '@app/services/bot.service';
import { EndGameService } from '@app/services/end-game.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { SocketService } from '@app/services/socket.service';
import { ValidationService } from '@app/services/validation.service';
import { Service } from 'typedi';

@Service()
export class GameService {
    readonly games = new Map<string, Game>();
    readonly timers = new Map<string, Timer>();

    constructor(
        private socketService: SocketService,
        private botService: BotService,
        private endGameService: EndGameService,
        private exchangeService: ExchangeService,
        private placingService: PlacingService,
        private validationService: ValidationService,
    ) {}

    attachSocketListeners() {
        this.socketService.socketEvents
            .on('createGame', (roomID: string, configs: GameInfo, players) => {
                if (configs.gameType === GameType.Multi) {
                    this.createGameMP(roomID, configs, players);
                }
                if (configs.gameType === GameType.Single) {
                    this.createGameSP(roomID, configs, players);
                }
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

                const isValidWord = this.validationService.findWord(this.validationService.fetchWords());
                setTimeout(() => {
                    if (isValidWord) {
                        player.score += this.validationService.calcPoints();
                        this.placingService.replenishHand(game.reserve, player);
                        this.socketService.updateReserve(roomId, game.reserve.letters);
                        this.updateScores(game);
                        this.endGameService.resetTurnSkipCount(roomId);
                    } else {
                        this.placingService.returnLetters(toPlace, game.board, player);
                        this.socketService.sendMessage(socketID, MessageType.System, 'Votre placement forme des mots invalides');
                    }
                    this.socketService.updateBoard(roomId, game.board.letters);
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
                    const entries = this.games.get(roomID)?.players.entries();
                    const timer = this.timers.get(roomID);
                    if (entries === undefined || timer === undefined) {
                        return;
                    }
                    timer.lock();
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
                    this.games.delete(roomID);
                    this.timers.get(roomID)?.clearTimer();
                    this.timers.delete(roomID);
                    this.botService.clear(roomID);
                }
            });
    }

    attachBotListeners() {
        this.botService.botEvents.on('skipTurn', (roomID) => {
            this.socketService.sendMessage(roomID, MessageType.User, '!passer');
            this.endGameService.incrementTurnSkipCount(roomID);
            this.changeTurn(roomID);
        });
    }

    createGameMP(roomID: string, configs: GameInfo, players: { socketID: string; username: string }[]) {
        const bonuses = this.getBonuses(!!configs.randomized);
        const hands: Player[] = [];

        const game = new Game(
            new Board(bonuses),
            new Map(
                players.map((entry) => {
                    const player = new Player(entry.username);
                    hands.push(player);
                    return [entry.socketID, player];
                }),
            ),
        );
        const timer = new Timer(roomID, configs.turnLength ? configs.turnLength : DEFAULT_TURN_LENGTH);

        this.games.set(roomID, game);
        this.timers.set(roomID, timer);

        this.socketService.setConfigs(
            players[0].socketID,
            players[0].username,
            players[1].username,
            bonuses,
            game.reserve.letters,
            hands[0].hand,
            false,
        );
        this.socketService.setConfigs(
            players[1].socketID,
            players[1].username,
            players[0].username,
            bonuses,
            game.reserve.letters,
            hands[1].hand,
            false,
        );
        this.endGameService.turnSkipMap.set(roomID, 0);

        timer.timerEvents
            .on('updateTime', (time: number) => {
                this.socketService.updateTime(roomID, time);
            })
            .on('updateTurn', (turnState: boolean) => {
                if (this.gameEnded(roomID, timer, game, hands[0], hands[1])) {
                    return;
                }
                this.updateTurn(players[0].socketID, turnState, timer);
                this.updateTurn(players[1].socketID, !turnState, timer);
            })
            .on('timeElapsed', () => {
                this.endGameService.incrementTurnSkipCount(roomID);
            });
        timer.changeTurn();
    }

    createGameSP(roomID: string, configs: GameInfo, playerInfo: { socketID: string; username: string }) {
        const bonuses = this.getBonuses(!!configs.randomized);
        const validBotNames = DEFAULT_BOT_NAMES.filter((name) => name !== playerInfo.username);

        const bot = new Player(validBotNames[Math.floor(Math.random() * validBotNames.length)]);
        const player = new Player(playerInfo.username);

        const game = new Game(
            new Board(bonuses),
            new Map([
                [playerInfo.socketID, player],
                [roomID, bot],
            ]),
        );

        const timer = new Timer(roomID, configs.turnLength ? configs.turnLength : DEFAULT_TURN_LENGTH);

        this.games.set(roomID, game);
        this.timers.set(roomID, timer);

        this.socketService.setConfigs(playerInfo.socketID, player.name, bot.name, bonuses, game.reserve.letters, player.hand, false);
        this.botService.observe(roomID, game);
        this.endGameService.turnSkipMap.set(roomID, 0);

        timer.timerEvents
            .on('updateTime', (time: number) => {
                this.socketService.updateTime(roomID, time);
            })
            .on('updateTurn', (turnState: boolean) => {
                if (this.gameEnded(roomID, timer, game, player, bot)) {
                    return;
                }
                if (!turnState) {
                    setTimeout(() => {
                        timer.startTimer();
                        this.botService.activate(roomID);
                    }, DEFAULT_TURN_TIMEOUT);
                }
                this.updateTurn(playerInfo.socketID, turnState, timer);
            })
            .on('timeElapsed', () => {
                this.endGameService.incrementTurnSkipCount(roomID);
            });
        timer.changeTurn();
    }

    getBonuses(randomized: boolean): Map<string, string> {
        if (!randomized) {
            return DEFAULT_BONUSES;
        }
        const keys = Array.from(DEFAULT_BONUSES.keys()).sort(() => HALF - Math.random());
        const values = Array.from(DEFAULT_BONUSES.values());
        return new Map(keys.map((key, index) => [key, values[index]]));
    }

    gameEnded(roomID: string, timer: Timer, game: Game, player1: Player, player2: Player): boolean {
        const gameEnd: boolean = this.endGameService.checkIfGameEnd(game.reserve, player1, player2, roomID);
        if (!gameEnd) {
            return false;
        }
        this.endGameService.setPoints(player1, player2);
        this.socketService.gameEnded(roomID, this.endGameService.getWinner(player1, player2));
        for (const message of this.endGameService.showLettersLeft(player1, player2)) {
            this.socketService.sendMessage(roomID, MessageType.System, message);
        }
        timer.clearTimer();
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
        if (turnState) {
            setTimeout(() => {
                timer.startTimer();
                this.socketService.updateTurn(socketID, turnState);
            }, DEFAULT_TURN_TIMEOUT);
        } else {
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
}

const HALF = 0.5;
