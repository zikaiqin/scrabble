import { Component } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
import { GameService } from '@app/services/game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-end-game',
    templateUrl: './end-game.component.html',
    styleUrls: ['./end-game.component.scss'],
})
export class EndGameComponent {
    isVisibleWinner: boolean;
    isVisibleGiveUp: boolean;
    isVisibleButton: boolean;

    constructor(private endGameService: EndGameService, private gameService: GameService, private readonly router: Router) {
        this.isVisibleWinner = false;
        this.isVisibleGiveUp = false;
        this.isVisibleButton = true;
    }

    surrender(): void {
        if (!this.endGameService.checkIfGameEnd()) {
            this.isVisibleButton = false;
            this.endGameService.gameHasEnded = true;
            this.endGameService.endGame();
        }
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

    redirectTo(uri: string) {
        this.router.navigateByUrl(uri);
    }

    checkIfGameEnded(): boolean {
        return this.endGameService.checkIfGameEnd();
    }
}
