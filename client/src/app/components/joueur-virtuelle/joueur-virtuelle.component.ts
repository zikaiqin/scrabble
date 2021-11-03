import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '@app/services/websocket.service';

const JV_DELAY = 5000;

@Component({
    selector: 'app-joueur-virtuelle',
    templateUrl: './joueur-virtuelle.component.html',
    styleUrls: ['./joueur-virtuelle.component.scss'],
})
export class JoueurVirtuelleComponent {
    subscription: Subscription;

    constructor(private gameService: WebsocketService) {
        this.subscription = this.gameService.turn.subscribe((turn) => {
            setTimeout(() => {
                if (!turn) void turn;
            }, JV_DELAY);
        });
    }
}
