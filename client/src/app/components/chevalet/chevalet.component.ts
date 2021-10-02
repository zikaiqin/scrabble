import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-chevalet',
    templateUrl: './chevalet.component.html',
    styleUrls: ['./chevalet.component.scss'],
})
export class ChevaletComponent {
    constructor(private gameService: GameService) {}

    displayLetter1(): string {
        return this.gameService.playerHand.letters[0];
    }

    displayLetter2(): string {
        return this.gameService.playerHand.letters[1];
    }

    displayLetter3(): string {
        return this.gameService.playerHand.letters[2];
    }

    displayLetter4(): string {
        return this.gameService.playerHand.letters[3];
    }

    displayLetter5(): string {
        return this.gameService.playerHand.letters[4];
    }

    displayLetter6(): string {
        return this.gameService.playerHand.letters[5];
    }

    displayLetter7(): string {
        return this.gameService.playerHand.letters[6];
    }
}
