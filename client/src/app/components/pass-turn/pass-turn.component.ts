import { Component } from '@angular/core';
import { TurnService } from '@app/services/turn.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pass-turn',
    templateUrl: './pass-turn.component.html',
    styleUrls: ['./pass-turn.component.scss'],
})
export class PassTurnComponent {
    activePlayer: boolean;
    subscription: Subscription;

    constructor(private turnService: TurnService) {
        this.subscription = this.turnService.getState().subscribe((turn) => {
            this.activePlayer = turn;
        });
    }

    passTurn(): void {
        this.turnService.changeTurn(!this.activePlayer);
    }
}
