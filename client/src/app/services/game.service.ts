import { Injectable } from '@angular/core';
import { GameBoard } from '@app/classes/game-board';
import { DEFAULT_BONUSES, DEFAULT_BOT_NAMES, DEFAULT_HAND_SIZE } from '@app/classes/game-config';
import { PlayerHand } from '@app/classes/player-hand';
import { Reserve } from '@app/classes/reserve';
import { Subject } from 'rxjs';
import { GameInfo } from '@app/classes/game-info';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    isInit: boolean;
    isStarted: boolean;

    player: string;
    opponent: string;

    playerHand = new Subject<PlayerHand>();
    opponentHand = new Subject<PlayerHand>();

    playerScore = new Subject<number>();
    opponentScore = new Subject<number>();

    reserve: Reserve;

    gameBoard = new Subject<GameBoard>();
    randomized: boolean;

    turnState = new Subject<boolean>();

    /**
     * @description Function that initializes the variables
     * @param configs game settings
     */
    init(configs: GameInfo): void {
        const validBotNames = DEFAULT_BOT_NAMES.filter((name) => name !== configs.username);

        this.player = configs.username;
        this.opponent = validBotNames[Math.floor(Math.random() * validBotNames.length)];
        this.randomized = !!configs.randomized;

        this.isInit = true;
        this.isStarted = false;
    }

    /**
     * @description Function that declares the start of the game (assignation of turns, filling up the player's hand, etc)
     */
    start(): void {
        this.reserve = new Reserve();

        this.gameBoard.next(new GameBoard(this.bonuses));

        this.playerScore.next(0);
        this.opponentScore.next(0);

        const playerHand: PlayerHand = new PlayerHand();
        const opponentHand: PlayerHand = new PlayerHand();
        const handTemp = this.reserve.draw(DEFAULT_HAND_SIZE);
        const opHandTemp = this.reserve.draw(DEFAULT_HAND_SIZE);

        if (handTemp !== undefined && opHandTemp !== undefined) {
            playerHand.addAll(handTemp);
            opponentHand.addAll(opHandTemp);
            this.playerHand.next(playerHand);
            this.opponentHand.next(opponentHand);
        }

        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState.next(turnState);
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
