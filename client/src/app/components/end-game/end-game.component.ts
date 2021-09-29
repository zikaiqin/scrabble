import { Component } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
// import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-end-game',
    templateUrl: './end-game.component.html',
    styleUrls: ['./end-game.component.scss'],
})
export class EndGameComponent {
    isVisibleWinner: boolean = false;

    constructor(private endGameService: EndGameService /* , private gameService: GameService*/) {}

    surrender(): void {
        this.endGameService.gameHasEnded = true;
        this.endGameService.endGame();
    }
    /* getWinner(): string {
        if (this.endGameService.gameHasEnded) {
            this.isVisibleWinner = true;
            if (this.gameService.playerScore > this.gameService.opponentScore) {
                return this.gameService.player;
            } else if (this.gameService.playerScore < this.gameService.opponentScore) {
                return this.gameService.opponent;
            } else if (this.gameService.playerScore === this.gameService.opponentScore)
                return this.gameService.player + ' et ' + this.gameService.opponent;
        }
        return '';
    } */
}
