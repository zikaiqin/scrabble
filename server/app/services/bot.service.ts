import EventEmitter from 'events';
import { Service } from 'typedi';
import { DEFAULT_BOT_NAMES, DEFAULT_SOCKET_TIMEOUT } from '@app/classes/config';
import { Game } from '@app/classes/game';
import { GameDifficulty } from '@app/classes/game-info';
import { DatabaseService } from '@app/services/database.service';

@Service()
export class BotService {
    readonly botEvents = new EventEmitter();

    // Key -- ID of the bot <br>
    // Value -- ID of the room the bot plays in
    readonly games = new Map<string, string>();

    constructor(private dbService: DatabaseService) {}

    activate(botID: string, game: Game) {
        setTimeout(() => {
            this.botEvents.emit('skipTurn', this.games.get(botID));
        }, DEFAULT_SOCKET_TIMEOUT);
        void game;
    }

    async getBotName(playerName: string, difficulty: number): Promise<string> {
        let names = difficulty === GameDifficulty.Easy ? DEFAULT_BOT_NAMES.easy : DEFAULT_BOT_NAMES.hard;
        try {
            names = names.concat(...(await this.dbService.getBots(difficulty)).map((bot) => bot.name));
        } catch (e) {
            void e;
        }
        const validBotNames = names.filter((name) => name !== playerName);
        return validBotNames[Math.floor(Math.random() * validBotNames.length)];
    }
}
