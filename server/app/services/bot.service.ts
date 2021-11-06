import EventEmitter from 'events';
import { Game } from '@app/classes/game';
import { Service } from 'typedi';
import { DEFAULT_SOCKET_TIMEOUT } from '@app/classes/game-config';

@Service()
export class BotService {
    readonly botEvents = new EventEmitter();

    private games = new Map<string, Game>();

    observe(roomID: string, game: Game) {
        this.games.set(roomID, game);
    }

    activate(roomID: string) {
        setTimeout(() => {
            this.botEvents.emit('skipTurn', roomID);
        }, DEFAULT_SOCKET_TIMEOUT);
    }

    clear(roomID: string) {
        this.games.delete(roomID);
    }
}
