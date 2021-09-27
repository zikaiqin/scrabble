import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerHand } from '@app/classes/player-hand';
import { GameBoard } from '@app/classes/game-board';
import { Reserve } from '@app/classes/reserve';

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

    reserve: Reserve;

    gameBoard: GameBoard;

    turnState = new Subject<boolean>();

    init(username: string): void {
        const validBotNames = botNames.filter((name) => name !== username);

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

        // TODO: Fill hands from reserve
    }
}
