import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '@app/classes/player';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    player0: Player;
    player1: Player;

    // TODO: give me a type
    hand0: unknown;
    hand1: unknown;

    // TODO: give me a type
    letterReserve: unknown;

    // TODO: give me a type
    boardState: unknown;

    turnState = new Subject<boolean>();

    init(player0: Player, player1: Player): void {
        this.player0 = player0;
        this.player1 = player1;

        const turnState = Boolean(Math.floor(Math.random() * 2));
        this.turnState.next(turnState);
    }
}
