import { Service } from 'typedi';
import { GameInfo } from '@app/classes/game-info';
import { Game } from '@app/classes/game';
import { Board } from '@app/classes/board';
import { Player } from '@app/classes/player';
import { Reserve } from '@app/classes/reserve';
import { Timer } from '@app/classes/timer';
import { SocketService } from '@app/services/socket.service';
import { ValidationService } from '@app/services/validation.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { DEFAULT_BONUSES, DEFAULT_TURN_LENGTH } from '@app/classes/game-config';

@Service()
export class GameService {
    games = new Map<string, Game>();
    timers = new Map<string, Timer>();

    constructor(
        private socketService: SocketService,
        private exchangeService: ExchangeService,
        private placingService: PlacingService,
        private validationService: ValidationService,
    ) {}

    attachListeners() {
        this.socketService.socketEvents
            .on('createGame', (roomID, configs, players) => {
                this.createGame(roomID, configs, players);
            })
            .on('exchange', () => {
                // TODO: letter exchange logic
                this.exchangeService.exchangeLetters('', new Player(''), new Reserve());
            })
            .on('place', () => {
                // TODO: letter placing logic
                this.placingService.replenishHand(new Reserve(), new Player(''));

                // TODO: validation logic
                void this.validationService.index;

                // TODO: update points
            })
            .on('skipTurn', (roomID: string) => {
                this.changeTurn(roomID);
            })
            .on('disconnect', (socketID: string, roomID: string) => {
                if (Array.from(this.socketService.activeRooms.values()).includes(roomID)) {
                    // TODO: declare forfeit by player on socketID
                } else {
                    // TODO?: event listener lifecycle unclear -- detach event listeners associated to the timer if necessary
                    this.games.delete(roomID);
                    this.timers.get(roomID)?.clearTimer();
                    this.timers.delete(roomID);
                }
            });
    }

    createGame(roomID: string, configs: GameInfo, players: { socketID: string; username: string }[]) {
        const bonuses = this.getBonuses(!!configs.randomized);

        const game = new Game(new Board(bonuses), new Map(players.map((entry) => [entry.socketID, new Player(entry.username)])));
        const timer = new Timer(roomID, configs.turnLength ? configs.turnLength : DEFAULT_TURN_LENGTH);

        this.games.set(roomID, game);
        this.timers.set(roomID, timer);

        timer.timerEvents
            .on('updateTime', (time: number) => {
                this.socketService.updateTime(roomID, time);
            })
            .on('updateTurn', (turnState: boolean) => {
                this.updateTurn(players[0].socketID, turnState, timer);
                this.updateTurn(players[1].socketID, !turnState, timer);
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

    changeTurn(roomID: string): void {
        const timer = this.timers.get(roomID);
        if (timer !== undefined) {
            timer.changeTurn();
        }
    }

    /**
     * @description Send turn updates to sockets. Ends one's turn immediately, but waits 3 seconds to start other's turn.
     * @param socketID
     * @param turnState
     * @param timer
     */
    updateTurn(socketID: string, turnState: boolean, timer: Timer) {
        if (turnState) {
            setTimeout(() => {
                timer.startTimer();
                this.socketService.updateTurn(socketID, turnState);
            }, CHANGE_TURN_DELAY);
        } else {
            this.socketService.updateTurn(socketID, turnState);
        }
    }
}

const CHANGE_TURN_DELAY = 3000;
const HALF = 0.5;
