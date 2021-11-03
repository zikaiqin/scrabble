import { Component } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-end-game',
    templateUrl: './end-game.component.html',
    styleUrls: ['./end-game.component.scss'],
})
export class EndGameComponent {
    isVisibleWinner: boolean;
    isVisibleGiveUp: boolean;
    isVisibleButton: boolean;
    playerScore = 0;
    opponentScore = 0;

    constructor(private websocketService: WebsocketService) {
        this.websocketService.scores.subscribe((score) => {
            this.playerScore = score.ownScore;
            this.opponentScore = score.opponentScore;
        });
        this.isVisibleWinner = false;
        this.isVisibleGiveUp = false;
        this.isVisibleButton = true;
    }

    getWinner(): string {
        return '';
    }

    redirectTo() {
        window.location.reload();
    }

    checkIfGameEnded(): boolean {
        return false;
    }
}
