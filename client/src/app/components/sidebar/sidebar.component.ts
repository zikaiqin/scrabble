import { AfterViewInit, Component } from '@angular/core';
import { TurnService } from '@app/services/turn.service';
import { Subscription } from 'rxjs';

const TIMER = 60000; // temporary value just here for demo
const TIMER_INTERVAL = 1000;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit {
    subscription: Subscription;
    turn: boolean;
    constructor(private turnService: TurnService) {
        this.subscription = this.turnService.getState().subscribe((turn) => {
            this.turn = turn;
        });
    }

    ngAfterViewInit(): void {
        let time = TIMER;
        const timer = setInterval(() => {
            const element = document.getElementById('timer');
            if (element !== null) {
                element.innerHTML = (time / TIMER_INTERVAL).toString();
                time -= TIMER_INTERVAL;
                if (time < 0 || this.turn === false) {
                    this.turnService.changeTurn(false);
                    element.innerHTML = 'Turn ended';
                    clearInterval(timer);
                }
            }
        }, TIMER_INTERVAL);
    }
}
