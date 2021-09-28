import { Component, Input, AfterViewInit } from '@angular/core';
import { TurnService } from '@app/services/turn.service';
import { Subscription } from 'rxjs';

const TIMER = 60000; // temporary value just here for demo
const TIMER_INTERVAL = 1000;

@Component({
    selector: 'app-pass-turn',
    templateUrl: './pass-turn.component.html',
    styleUrls: ['./pass-turn.component.scss'],
})

export class PassTurnComponent, implements AfterViewInit {
    @Input() activePlayer: boolean;
    subscription: Subscription;
    turn: boolean;

    constructor(private turnService: TurnService) {
        this.subscription = this.turnService.getState().subscribe((turn) => {
            this.activePlayer = turn;
        });
    }

    ngAfterViewInit(): void {
        let time = TIMER;
        const timer = setInterval(() => {
            const element = document.getElementById('timer');
            if (element !== null) {
                element.innerHTML = (time / TIMER_INTERVAL).toString();
                time -= TIMER_INTERVAL;
                if (time < 0 || !this.turn) {
                    this.passTurn();
                    element.innerHTML = 'Turn ended';
                    clearInterval(timer);
                }
            }
        }, TIMER_INTERVAL);
    }
    passTurn(): void {
        this.turnService.changeTurn(!this.activePlayer);
    }
}
function ngAfterViewInit() {
    throw new Error('Function not implemented.');
}

