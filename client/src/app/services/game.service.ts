import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const botNames: string[] = ['M0NKE', '死神', 'ฅ^•ﻌ•^ฅ'];

@Injectable({
    providedIn: 'root',
})
export class GameService {
    isInit: boolean;

    player: string;
    opponent: string;

    // TODO: give me a type
    playerHand: unknown;
    opponentHand: unknown;

    hand0Num: string;
    hand1Num: string;

    score0: string;
    score1: string;

    // TODO: give me a type
    letterReserve: unknown;
    reserveAmount: string;

    // TODO: give me a type
    boardState: unknown;

    turnState = new Subject<boolean>();

    init(username: string): void {
        this.player = username;

        const validBotNames = botNames.filter((name) => name !== username);
        this.opponent = validBotNames[Math.floor(Math.random() * validBotNames.length)];

        this.isInit = true;
    }

    start(): void {
        // eslint-disable-next-line no-console
        console.log(this.player, this.opponent);

        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState.next(turnState);
    }
}
