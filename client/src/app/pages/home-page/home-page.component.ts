import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from '@app/services/game.service';
import { GameInfo, GameMode, GameType } from '@app/classes/game-info';
import { WaitingRoomComponent } from '@app/components/waiting-room/waiting-room.component';

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

    // FIXME: temporary implementation
    gameListSubject: Subject<GameInfo[]> = new Subject();
    gameList: GameInfo[];
    gameConfigs: GameInfo;

    constructor(private router: Router, private gameService: GameService, private snackBar: MatSnackBar) {
        this.gameListSubject.asObservable().subscribe((gameList) => {
            this.gameList = gameList;
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
            this.fetchGames();
            this.showBrowser = true;

            // FIXME: test data
            /* eslint-disable @typescript-eslint/no-magic-numbers */
            setTimeout(() => this.gameListSubject.next(TEST_DATA), 1000);
            setTimeout(() => this.gameListSubject.next([]), 3000);
            setTimeout(() => this.gameListSubject.next(TEST_DATA.slice(2)), 4000);
            setTimeout(() => this.gameListSubject.next(TEST_DATA.slice(3, 7)), 6000);
            /* eslint-enable @typescript-eslint/no-magic-numbers */
        }
        if (button === 'Back') {
            if (this.showBrowser) {
                this.showBrowser = false;
                this.disconnect(); // ?
                return;
            }
            if (this.showWaitingRoom) {
                this.showWaitingRoom = false;
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
        if (configs.gameType === GameType.Single) {
            this.gameService.init(configs.username);
            this.router.navigateByUrl('/game');
        } else {
            this.gameConfigs = configs;
            this.showWaitingRoom = true;
        }
    }

    // TODO: join a game
    joinGame(configs: GameInfo): void {
        if (!this.gameList.some((game) => game.roomID === configs.roomID)) {
            this.noSuchGame();
        }
        void configs;
    }

    // TODO: leave the waiting room
    leaveGame() {
        void 0;
    }

    // TODO: fetch available games
    fetchGames(): void {
        void 0;
    }

    // TODO: disconnect socket
    disconnect(): void {
        void 0;
    }

    noSuchGame(): void {
        this.snackBar.open("La partie que vous avez essayé de joindre n'est plus disponible", 'Fermer');
    }
}

// FIXME: test values
const TEST_DATA: GameInfo[] = [
    {
        username: 'Достоевский',
        turnLength: 60,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: 14,
    },
    {
        username: 'الملحمة الكبرى',
        turnLength: 90,
        randomized: false,
        gameMode: GameMode.Log2990,
        roomID: 3,
    },
    {
        username: '(╬⓪益⓪)',
        turnLength: 30,
        randomized: true,
        gameMode: GameMode.Classical,
        roomID: 49,
    },
    {
        username: 'sayonaraaaaaaa👋👋👋',
        turnLength: 180,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: 8,
    },
    {
        username: '4815162342',
        turnLength: 270,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: 44,
    },
    {
        username: 'sayonaraaaaaaa👋👋👋',
        turnLength: 210,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: 11,
    },
    {
        username: 'sayonaraaaaaaa👋👋👋',
        turnLength: 240,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: 28,
    },
    {
        username: '金木くん',
        turnLength: 120,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: 31,
    },
    {
        username: 'Hafþór Björnsson',
        turnLength: 30,
        randomized: true,
        gameMode: GameMode.Log2990,
        roomID: 17,
    },
    {
        username: '😴',
        turnLength: 300,
        randomized: false,
        gameMode: GameMode.Classical,
        roomID: 23,
    },
];
