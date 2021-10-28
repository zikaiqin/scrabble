import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from '@app/services/game.service';
import { GameInfo, GameMode, GameType } from '@app/classes/game-info';
import { WaitingRoomComponent } from '@app/components/waiting-room/waiting-room.component';
import { WebsocketService } from '@app/services/websocket.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
    @ViewChild(WaitingRoomComponent) waitingRoom: WaitingRoomComponent;

    gameMode = GameMode.None;
    gameType = GameType.None;
    showBrowser = false;
    showWaitingRoom = false;
    gameConfigs: GameInfo;

    constructor(private router: Router, private gameService: GameService, private snackBar: MatSnackBar, private webSocketService: WebsocketService) {
        this.webSocketService.socketError.asObservable().subscribe((error) => {
            if (error === 'roomNotFound') {
                this.showAlert("La partie que vous avez essayé de joindre n'est plus disponible");
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
            this.webSocketService.fetchRooms();
            this.showBrowser = true;
        }
        if (button === 'Back') {
            if (this.showBrowser) {
                this.showBrowser = false;
                return;
            }
            if (this.showWaitingRoom) {
                this.showWaitingRoom = false;
                this.leaveRoom();
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

    // TODO: move all game logic serverside
    createGame(configs: GameInfo): void {
        if (configs.gameType === GameType.Single) {
            this.gameService.init(configs);
            this.router.navigateByUrl('/game');
        } else {
            this.webSocketService.createRoom(configs);
            this.gameConfigs = configs;
            this.showWaitingRoom = true;
        }
    }

    joinRoom(configs: GameInfo): void {
        if (configs.roomID !== undefined) {
            this.webSocketService.joinRoom(configs.roomID);
        } else {
            this.showAlert("Une erreur s'est produite lors de la connexion à une partie");
        }
    }

    leaveRoom(): void {
        this.webSocketService.leaveRoom();
    }

    showAlert(message: string): void {
        this.snackBar.open(message, 'Fermer');
    }

    get roomList() {
        return this.webSocketService.roomList.asObservable();
    }
}
