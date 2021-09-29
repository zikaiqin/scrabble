import { Component, Input } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
import { TurnService } from '@app/services/turn.service';
import { Subscription } from 'rxjs';

const TIMER = 10000; // temporary value just here for demo
const TIMER_INTERVAL = 1000;

@Component({
    selector: 'app-pass-turn',
    templateUrl: './pass-turn.component.html',
    styleUrls: ['./pass-turn.component.scss'],
})
export class PassTurnComponent {
    @Input() activePlayer: boolean;
    subscription: Subscription;
    turn: boolean;
    timer: NodeJS.Timeout; // Variable for timer

    constructor(private turnService: TurnService, private endGameService: EndGameService) {
        this.subscription = this.turnService.getState().subscribe((turn) => {
            this.activePlayer = turn;
            this.turn = turn;
            if(turn){
                this.startTimer();
            }
        });
    }

    passTurn(): void {
        this.endGameService.turnSkipCount();
        this.endGameService.endGame();
        this.turnService.changeTurn(!this.activePlayer);
    }

    startTimer(): void {
        let time = TIMER;
        console.log(time);
        this.timer = setInterval(() => {
            const element = document.getElementById('timer');
            if (element !== null) {
                element.innerHTML = (time / TIMER_INTERVAL).toString();
                time -= TIMER_INTERVAL;
                if (time < 0 || !this.turn) {
                    this.turnService.changeTurn(false);
                    element.innerHTML = 'Turn ended';
                    this.clearTimer();
                    this.endGameService.turnSkipCount();
                    this.endGameService.endGame();
                }
            }
        }, TIMER_INTERVAL);
    }

    clearTimer(): void {
        clearInterval(this.timer);
        console.log('Clear called succesfully');
    }
}
