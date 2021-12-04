import { AfterViewInit, Component } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements AfterViewInit {
    isInit = false;

    constructor(private websocketService: WebsocketService) {
        this.websocketService.init.subscribe(() => {
            this.isInit = true;
        });
    }

    ngAfterViewInit(): void {
        if (!this.isInit) {
            /* this.router.navigateByUrl('/home');*/
        }
    }
}
