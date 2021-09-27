import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerHand } from '@app/classes/player-hand';
import { GameBoard } from '@app/classes/game-board';
import { Reserve } from '@app/classes/reserve';

const BOT_NAMES: string[] = ['M0NKE', '死神', 'ฅ^•ﻌ•^ฅ'];
const STARTING_HAND_SIZE = 7;
export const DEFAULT_SCORE = 0;

@Injectable({
    providedIn: 'root',
})
export class GameService {
    isInit: boolean;

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

        this.reserve = new Reserve();

        // TODO: Assign type to bonuses and inject default bonus map
        this.gameBoard = new GameBoard(new Map<string, unknown>());

        this.isInit = true;
    }

    start(): void {
        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState.next(turnState);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.playerHand.addAll(this.reserve.draw(STARTING_HAND_SIZE)!);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.opponentHand.addAll(this.reserve.draw(STARTING_HAND_SIZE)!);
    }
}
