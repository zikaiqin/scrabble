import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { Subscription } from 'rxjs';

const JV_DELAY = 5000;

@Component({
    selector: 'app-joueur-virtuelle',
    templateUrl: './joueur-virtuelle.component.html',
    styleUrls: ['./joueur-virtuelle.component.scss'],
})
export class JoueurVirtuelleComponent {
    subscription: Subscription;

    constructor(private gameService: GameService) {
        this.subscription = this.gameService.turnState.asObservable().subscribe((turn) => {
            setTimeout(() => {
                if (!turn) this.gameService.turnState.next(!turn);
            }, JV_DELAY);
        });
    }
}
