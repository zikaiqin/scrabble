import { Component } from '@angular/core';
import { GameService, DEFAULT_HAND_SIZE } from '@app/services/game.service';

@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
    isVisiblePlayer: boolean = true;
    isVisibleOpponent: boolean = true;
    isMyTurn: boolean;

    private player = new Map();

    constructor(private gameService: GameService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.isMyTurn = turn),
        });
    }

    // FIXME: fields in map are static
    //  will not update to match dynamic fields
    //  (score, hand size, reserve size)
    //  refactor to use getter functions
    setPlayerInfo() {
        this.player
            .set('PlayerName', this.gameService.player)
            .set('PlayerScore', this.gameService.playerScore)
            .set('OpponentName', this.gameService.opponent)
            .set('OpponentScore', this.gameService.opponentScore)
            .set('PlayerHandNum', this.gameService.playerHand.size)
            .set('OpponentHandNum', this.gameService.opponentHand.size)
            .set('ReserveAmount', this.gameService.reserve.size);
        return this.player;
    }

    showPlayerInfo(info: string) {
        if (info === 'PlayerHandNum' && this.gameService.playerHand.size > DEFAULT_HAND_SIZE) {
            this.isVisiblePlayer = false;
            return ' ';
        }
        if (info === 'OpponentHandNum' && this.gameService.opponentHand.size > DEFAULT_HAND_SIZE) {
            this.isVisibleOpponent = false;
            return ' ';
        }
        return this.setPlayerInfo().get(info);
    }

    turnState() {
        return this.isMyTurn ? 'Votre tour' : "Tour de l'adversaire";
    }
}
