import { Component, Input } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pass-turn',
    templateUrl: './pass-turn.component.html',
    styleUrls: ['./pass-turn.component.scss'],
})
export class PassTurnComponent {
    @Input() activePlayer: boolean;
    subscription: Subscription;

    constructor(private gameService: GameService) {
        this.subscription = this.gameService.getState().subscribe((turn) => {
            this.activePlayer = turn;
        });
    }

    passTurn() {
        this.gameService.changeTurn(!this.activePlayer);
    }
}
