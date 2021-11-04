import { Component } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-end-game',
    templateUrl: './end-game.component.html',
    styleUrls: ['./end-game.component.scss'],
})
export class EndGameComponent {
    winner: string;

    constructor(private webSocketService: WebsocketService) {
        this.webSocketService.endGame.subscribe((winner) => {
            this.winner = winner;
        });
    }

    getWinner(): string {
        return this.winner === undefined ? '' : this.winner;
    }

    redirectTo() {
        window.location.reload();
    }
}
