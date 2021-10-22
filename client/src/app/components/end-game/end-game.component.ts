import { Component } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
import { GameService } from '@app/services/game.service';

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

    constructor(private endGameService: EndGameService, private gameService: GameService) {
        this.gameService.playerScore.asObservable().subscribe((playerScore) => {
            this.playerScore = playerScore;
        });
        this.gameService.opponentScore.asObservable().subscribe((opponentScore) => {
            this.opponentScore = opponentScore;
        });
        this.isVisibleWinner = false;
        this.isVisibleGiveUp = false;
        this.isVisibleButton = true;
    }

    getWinner(): string {
        if (this.endGameService.checkIfGameEnd()) {
            this.isVisibleWinner = true;
            if (this.playerScore > this.opponentScore) {
                return this.gameService.player;
            } else if (this.playerScore < this.opponentScore) {
                return this.gameService.opponent;
            } else if (this.playerScore === this.opponentScore) return this.gameService.player + ' et ' + this.gameService.opponent;
        }
        return '';
    }

    redirectTo() {
        window.location.reload();
    }

    checkIfGameEnded(): boolean {
        return this.endGameService.checkIfGameEnd();
    }
}
