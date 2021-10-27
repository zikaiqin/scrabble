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
            this.gameService.init(configs.username);
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

// FIXME: test values
/* const TEST_DATA: GameInfo[] = [
    {
        username: 'Достоевский',
        turnLength: 60,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: '14',
    },
    {
        username: 'الملحمة الكبرى',
        turnLength: 90,
        randomized: false,
        gameMode: GameMode.Log2990,
        roomID: '3',
    },
    {
        username: '(╬⓪益⓪)',
        turnLength: 30,
        randomized: true,
        gameMode: GameMode.Classical,
        roomID: '49',
    },
    {
        username: 'sayonaraaaaaaa👋👋👋',
        turnLength: 180,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: '8',
    },
    {
        username: '4815162342',
        turnLength: 270,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: '44',
    },
    {
        username: 'sayonaraaaaaaa👋👋👋',
        turnLength: 210,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: '11',
    },
    {
        username: 'sayonaraaaaaaa👋👋👋',
        turnLength: 240,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: '28',
    },
    {
        username: '金木くん',
        turnLength: 120,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: '31',
    },
    {
        username: 'Hafþór Björnsson',
        turnLength: 30,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: '17',
    },
    {
        username: '😴',
        turnLength: 300,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: '23',
    },
];*/
