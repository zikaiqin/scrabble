import { Component } from '@angular/core';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    chevalet: PlayerHand = new PlayerHand();

    constructor(private gameService: GameService) {
        this.gameService.playerHand.asObservable().subscribe((playerHand) => {
            this.chevalet = playerHand;
        });
    }
}
