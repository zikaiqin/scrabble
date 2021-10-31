import { GameBoard } from '@app/classes/game-board';
import { DEFAULT_BONUSES, DEFAULT_BOT_NAMES, DEFAULT_HAND_SIZE } from '@app/classes/game-config';
import { GameInfo } from '@app/classes/game-info';
import { PlayerHand } from '@app/classes/player-hand';
import { Reserve } from '@app/classes/reserve';
import { Service } from 'typedi';

@Service()
export class GameService {
    isInit: boolean;
    isStarted: boolean;

    player1: string;
    player2: string;

    player1Hand: PlayerHand;
    player2Hand: PlayerHand;

    player1Score: number;
    player2Score: number;

    reserve: Reserve;

    gameBoard: GameBoard;
    randomized: boolean;

    turnState: boolean;

    /**
     * @description Function that initializes the variables
     * @param configs game settings
     */
    init(configs: GameInfo): void {
        const validBotNames = DEFAULT_BOT_NAMES.filter((name) => name !== configs.username);

        this.player1 = configs.username;
        this.player2 = validBotNames[Math.floor(Math.random() * validBotNames.length)]; // TODO get the actual name of the second user
        this.randomized = !!configs.randomized;

        this.player1Hand = new PlayerHand();
        this.player2Hand = new PlayerHand();

        this.isInit = true;
        this.isStarted = false;
    }

    /**
     * @description Function that declares the start of the game (assignation of turns, filling up the player's hand, etc)
     */
    start(): void {
        this.reserve = new Reserve();

        this.gameBoard = new GameBoard(this.bonuses);

        this.player1Score = 0;
        this.player2Score = 0;

        const playerHand = this.reserve.draw(DEFAULT_HAND_SIZE);
        const opponentHand = this.reserve.draw(DEFAULT_HAND_SIZE);

        if (playerHand !== undefined && opponentHand !== undefined) {
            this.player1Hand.addAll(playerHand);
            this.player2Hand.addAll(opponentHand);
        }

        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState = turnState;
    }

    get bonuses(): Map<string, string> {
        if (!this.randomized) {
            return DEFAULT_BONUSES;
        }
        const keys = Array.from(DEFAULT_BONUSES.keys()).sort(() => HALF - Math.random());
        const values = Array.from(DEFAULT_BONUSES.values());
        return new Map(keys.map((key, index) => [key, values[index]]));
    }
}

const HALF = 0.5;
