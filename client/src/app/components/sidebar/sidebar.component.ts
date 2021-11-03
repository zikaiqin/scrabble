import { Component } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    playerHand: string[] = [];

    constructor(private websocketService: WebsocketService) {
        this.websocketService.init.subscribe((initPayload) => {
            this.playerHand = initPayload.hand;
        });
        this.websocketService.hands.subscribe((hands) => {
            this.playerHand = hands.ownHand;
        });
    }
}
