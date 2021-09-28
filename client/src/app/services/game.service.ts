import { Injectable } from '@angular/core';
import { GameBoard } from '@app/classes/game-board';
import { PlayerHand } from '@app/classes/player-hand';
import { Reserve } from '@app/classes/reserve';
import { Subject } from 'rxjs';

const BOT_NAMES: string[] = ['M0NKE', '死神', 'ฅ^•ﻌ•^ฅ'];
export const DEFAULT_HAND_SIZE = 7;
export const DEFAULT_SCORE = 0;

@Injectable({
    providedIn: 'root',
})
export class GameService {
    isInit: boolean;
    isStarted: boolean;

    player: string;
    opponent: string;

    playerHand: PlayerHand;
    opponentHand: PlayerHand;

    playerScore: number = DEFAULT_SCORE;
    opponentScore: number = DEFAULT_SCORE;

    reserve: Reserve;

    gameBoard: GameBoard;

    turnState = new Subject<boolean>();

    init(username: string): void {
        const validBotNames = BOT_NAMES.filter((name) => name !== username);

        this.player = username;
        this.opponent = validBotNames[Math.floor(Math.random() * validBotNames.length)];

        this.playerHand = new PlayerHand();
        this.opponentHand = new PlayerHand();

        this.isInit = true;
        this.isStarted = false;
    }

    start(): void {
        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState.next(turnState);

        this.reserve = new Reserve();

        // TODO: Assign type to bonuses and inject default bonus map
        this.gameBoard = new GameBoard(new Map<string, unknown>());

        const playerHand = this.reserve.draw(DEFAULT_HAND_SIZE);
        const opponentHand = this.reserve.draw(DEFAULT_HAND_SIZE);

        if (playerHand !== undefined && opponentHand !== undefined) {
            this.playerHand.addAll(playerHand);
            this.opponentHand.addAll(opponentHand);
        }
    }
}
