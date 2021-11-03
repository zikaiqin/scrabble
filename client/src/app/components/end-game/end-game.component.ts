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
    gameEnded: boolean;
    gameGaveUp: boolean;
    winner: string;

    constructor(private webSocketService: WebsocketService) {
        this.webSocketService.gameEnded.asObservable().subscribe((gameEnded) => {
            this.gameEnded = gameEnded;
        });
        this.webSocketService.gameGaveUp.asObservable().subscribe((gameGaveUp) => {
            this.gameGaveUp = gameGaveUp;
        });
        this.webSocketService.winner.asObservable().subscribe((winner) => {
            this.winner = winner;
        });
        this.isVisibleWinner = false;
        this.isVisibleButton = true;
    }

    getWinner(): string {
        if (this.gameEnded) {
            this.isVisibleWinner = true;
            return this.winner;
        } else if (this.gameGaveUp) {
            return 'Toi';
        }
        return '';
    }

    redirectTo() {
        window.location.reload();
    }

    checkIfGameEnded(): boolean {
        return this.gameEnded;
    }
}
