import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerHand } from '@app/classes/player-hand';
import { BoardCoords } from '@app/classes/board-coords';

const botNames: string[] = ['M0NKE', '死神', 'ฅ^•ﻌ•^ฅ'];

@Injectable({
    providedIn: 'root',
})
export class GameService {
    isInit: boolean;

    player: string;
    opponent: string;

    playerHand: PlayerHand;
    opponentHand: PlayerHand;

    // TODO: give me a type
    letterReserve: unknown;

    boardState: Map<BoardCoords, string>;

    turnState = new Subject<boolean>();

    init(username: string): void {
        this.player = username;
        const validBotNames = botNames.filter((name) => name !== username);
        this.opponent = validBotNames[Math.floor(Math.random() * validBotNames.length)];

        this.playerHand = new PlayerHand();
        this.opponentHand = new PlayerHand();
        this.boardState = new Map<BoardCoords, string>();
        // TODO: Init reserve

        this.isInit = true;
    }

    start(): void {
        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState.next(turnState);

        // TODO: Fill hands from reserve
    }
}
