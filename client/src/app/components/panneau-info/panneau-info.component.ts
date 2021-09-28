import { Component } from '@angular/core';
import { DEFAULT_HAND_SIZE, GameService } from '@app/services/game.service';

enum PlayerType {
    Human,
    Bot,
}

@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
    readonly playerType = PlayerType;

    isVisiblePlayer: boolean;
    isVisibleOpponent: boolean;
    isMyTurn: boolean;

    constructor(private gameService: GameService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.isMyTurn = turn),
        });
        this.isVisiblePlayer = true;
        this.isVisibleOpponent = true;
    }

    getTurnMessage(): string {
        return this.isMyTurn === undefined ? 'Initiez la partie' : this.isMyTurn ? 'Votre tour' : "Tour de l'adversaire";
    }

    getTurnColor(): string {
        return this.isMyTurn === undefined ? 'LightGray' : this.isMyTurn ? 'Green' : 'Red';
    }

    getReserveSize(): number {
        return this.gameService.reserve === undefined ? 0 : this.gameService.reserve.size;
    }

    getHandSize(player: number): number | null {
        if (player === PlayerType.Human) {
            if (this.gameService.playerHand.size > DEFAULT_HAND_SIZE) {
                this.isVisiblePlayer = false;
                return null;
            }
            return this.gameService.playerHand.size;
        } else {
            if (this.gameService.opponentHand.size > DEFAULT_HAND_SIZE) {
                this.isVisibleOpponent = false;
                return null;
            }
            return this.gameService.opponentHand.size;
        }
    }

    getScore(player: number): number {
        return player === PlayerType.Human ? this.gameService.playerScore : this.gameService.opponentScore;
    }

    getName(player: number): string {
        return player === PlayerType.Human ? this.gameService.player : this.gameService.opponent;
    }

    startGame(): void {
        this.gameService.start();
    }
}
