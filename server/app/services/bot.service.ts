import EventEmitter from 'events';
import { Service } from 'typedi';
import { DEFAULT_SOCKET_TIMEOUT } from '@app/classes/config';
import { Game } from '@app/classes/game';

@Service()
export class BotService {
    readonly botEvents = new EventEmitter();

    // Key -- ID of the bot <br>
    // Value -- ID of the room the bot plays in
    readonly games = new Map<string, string>();

    activate(botID: string, game: Game) {
        setTimeout(() => {
            this.botEvents.emit('skipTurn', this.games.get(botID));
        }, DEFAULT_SOCKET_TIMEOUT);
        void game;
    }
}
