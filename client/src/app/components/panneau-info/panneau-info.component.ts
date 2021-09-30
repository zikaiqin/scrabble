import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { TurnService } from '@app/services/turn.service';
import { Subscription } from 'rxjs';
import { EndGameService } from '@app/services/end-game.service';
import { DEFAULT_HAND_SIZE } from '@app/classes/game-config';

enum PlayerType {
    Human,
    Bot,
}

const TIMER = 10000; // temporary value just here for demo
const TIMER_INTERVAL = 1000;

@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
    readonly playerType = PlayerType;

    subscription: Subscription;
    turn: boolean;

    isVisibleWinner: boolean;
    isVisiblePlayer: boolean;
    isVisibleOpponent: boolean;
    isVisibleGiveUp: boolean;
    isMyTurn: boolean;

    // eslint-disable-next-line no-undef
    timer: NodeJS.Timeout; // Variable for timer

    constructor(private gameService: GameService, private turnService: TurnService, private endGameService: EndGameService) {
        this.subscription = this.turnService.getState().subscribe((turn) => {
            this.turn = turn;
        });
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.isMyTurn = turn),
        });
        this.isVisiblePlayer = true;
        this.isVisibleOpponent = true;
        this.isVisibleWinner = false;
        this.isVisibleGiveUp = false;
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
        this.isVisibleGiveUp = true;
        this.gameService.start();
        this.startTimer();
    }

    startTimer(): void {
        let time = TIMER;
        this.timer = setInterval(() => {
            const element = document.getElementById('timer');
            if (element !== null) {
                element.innerHTML = (time / TIMER_INTERVAL).toString();
                time -= TIMER_INTERVAL;
                if (time < 0 || !this.turn) {
                    this.turnService.changeTurn(false);
                    element.innerHTML = 'Tour fini';
                    this.clearTimer();
                    if (!this.endGameService.checkIfGameEnd()) {
                        this.endGameService.turnSkipCount();
                        this.endGameService.endGame();
                    }
                }
            }
        }, TIMER_INTERVAL);
    }

    clearTimer(): void {
        clearInterval(this.timer);
    }
}
