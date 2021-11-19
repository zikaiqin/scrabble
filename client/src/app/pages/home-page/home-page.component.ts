import { Component } from '@angular/core';
import { GameInfo, GameMode, GameType } from '@app/classes/game-info';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['../../styles.scss'],
})
export class HomePageComponent {
    gameMode = GameMode.None;
    gameType = GameType.None;
    showBrowser = false;
    showWaitingRoom = false;
    gameConfigs: GameInfo;

    constructor(private webSocketService: WebsocketService) {
        this.webSocketService.status.subscribe((event) => {
            if (event === 'connectionLost') {
                if (this.showWaitingRoom) {
                    this.showWaitingRoom = false;
                }
            }
        });
    }

    handleClick(button: string): void {
        if (button === 'Classical' || button === 'Log2990') {
            this.gameMode = GameMode[button];
        }
        if (button === 'Single' || button === 'Multi') {
            this.gameType = GameType[button];
        }
        if (button === 'Browse') {
            this.webSocketService.connect();
            this.showBrowser = true;
        }
        if (button === 'Back') {
            if (this.showBrowser) {
                this.showBrowser = false;
                this.webSocketService.disconnect();
                return;
            }

            if (this.showWaitingRoom) {
                this.showWaitingRoom = false;
                this.webSocketService.disconnect();
                return;
            }
            if (this.gameType) {
                this.gameType = GameType.None;
            } else {
                this.gameMode = GameMode.None;
            }
        }
    }

    showPage(): string {
        if (this.showBrowser) {
            return 'Browser';
        }
        if (!this.gameMode || !this.gameType) {
            return 'Main';
        }
        return this.showWaitingRoom ? 'WaitingRoom' : 'NewGame';
    }

    createGame(configs: GameInfo): void {
        this.webSocketService.connect();
        this.webSocketService.createGame(configs);
        this.gameConfigs = configs;
        if (configs.gameType === GameType.Multi) {
            this.showWaitingRoom = true;
        }
    }

    joinGame(configs: GameInfo): void {
        if (configs.roomID !== undefined) {
            this.webSocketService.joinGame(configs);
        }
    }

    convertGame(difficulty: number): void {
        this.webSocketService.convertGame(difficulty);
    }

    disconnect(): void {
        this.webSocketService.disconnect();
    }

    get roomList() {
        return this.webSocketService.rooms;
    }
}
