import { Component } from '@angular/core';
import { GameInfo, GameMode, GameType } from '@app/classes/game-info';
import { WebsocketService } from '@app/services/websocket.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['../../styles.scss', 'home-page.component.scss'],
})
export class HomePageComponent {
    gameMode = GameMode.None;
    gameType = GameType.None;
    showBrowser = false;
    showWaitingRoom = false;
    showScoreboard = false;
    gameConfigs: GameInfo;
    scoreMode: string;

    constructor(private router: Router, private webSocketService: WebsocketService) {
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
        if (button === 'Scoreboard') {
            this.webSocketService.connect();
            this.webSocketService.refreshHighscore();
            this.showScoreboard = true;
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
            if (this.showScoreboard) {
                this.showScoreboard = false;
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
        if (this.showScoreboard) {
            return 'Scoreboard';
        }
        if (this.showBrowser) {
            return 'Browser';
        }
        if (!this.gameMode || !this.gameType) {
            return 'Main';
        }
        return this.showWaitingRoom ? 'WaitingRoom' : 'NewGame';
    }

    showSettings(): void {
        this.router.navigateByUrl('/admin');
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
