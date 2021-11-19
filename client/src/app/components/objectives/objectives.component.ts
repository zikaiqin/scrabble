import { Component } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent {
    isVisible: boolean;
    content: [string, string, string][];
    publicObj: [number, boolean][];
    privateObj: [number, boolean];

    constructor(private webSocketService: WebsocketService) {
        this.webSocketService.init.subscribe((initPayLoad) => {
            if (initPayLoad.gameMode === 2) this.webSocketService.fetchObjectives();
        });
        this.webSocketService.objective.subscribe((objectives) => {
            if (objectives.privateObj[0] !== 0) {
                this.isVisible = true;
                this.publicObj = objectives.publicObj;
                this.privateObj = objectives.privateObj;
            }
        });
        this.content = [
            ['Panel #1', 'Panel #1 description', 'Panel #1 content'],
            ['Panel #2', 'Panel #2 description', 'Panel #2 content'],
            ['Panel #3', 'Panel #3 description', 'Panel #3 content'],
        ];
    }
}
