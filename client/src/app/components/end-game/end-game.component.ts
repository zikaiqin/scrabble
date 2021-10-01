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

    constructor(private endGameService: EndGameService, private gameService: GameService) {
        this.isVisibleWinner = false;
        this.isVisibleGiveUp = false;
        this.isVisibleButton = true;
    }

    getWinner(): string {
        if (this.endGameService.checkIfGameEnd()) {
            this.isVisibleWinner = true;
            if (this.gameService.playerScore > this.gameService.opponentScore) {
                return this.gameService.player;
            } else if (this.gameService.playerScore < this.gameService.opponentScore) {
                return this.gameService.opponent;
            } else if (this.gameService.playerScore === this.gameService.opponentScore)
                return this.gameService.player + ' et ' + this.gameService.opponent;
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
