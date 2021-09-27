import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@app/services/game.service';

export const DEFAULT_HAND_CAP = 7;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
    isVisiblePlayer: boolean = true;
    isVisibleOpponent: boolean = true;
    color: boolean;
    private player = new Map();
    constructor(private gameService: GameService) {}
    setPlayerInfo() {
        this.player
            .set('PlayerName', this.gameService.player)
            .set('PlayerScore', this.gameService.playerScore)
            .set('OpponentName', this.gameService.opponent)
            .set('OpponentScore', this.gameService.opponentScore)
            .set('PlayerHandNum', this.gameService.playerHand.size)
            .set('OpponentHandNum', this.gameService.opponentHand.size)
            .set('ReserveAmount', this.gameService.reserveAmount);
        return this.player;
    }
    showPlayerInfo(info: string) {
        if (info === 'PlayerHandNum' && this.gameService.playerHand.size > DEFAULT_HAND_CAP) {
            this.isVisiblePlayer = false;
            return ' ';
        }
        if (info === 'OpponentHandNum' && this.gameService.opponentHand.size > DEFAULT_HAND_CAP) {
            this.isVisibleOpponent = false;
            return ' ';
        }
        return this.setPlayerInfo().get(info);
    }

    turnState() {
        if (this.gameService.turnState) {
            this.color = true;
            return 'Votre tour';
        }
        this.color = false;
        return "Tour de l'adversaire";
    }
}
