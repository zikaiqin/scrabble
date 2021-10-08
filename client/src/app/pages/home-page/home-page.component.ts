import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';

export enum GameMode {
    None,
    Classical,
    Log2990,
}
export enum GameType {
    None,
    Single,
    Multi,
}

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    gameMode: number;
    gameType: number;

    // FIXME: for test purposes only, to be removed
    // @ts-ignore
    constructor(private webSocketService: WebsocketService) {}

    ngOnInit(): void {
        this.gameMode = GameMode.None;
        this.gameType = GameType.None;
    }

    navigateTo(menu: string): void {
        if (menu === 'Back') {
            if (this.gameType) {
                this.gameType = GameType.None;
            } else {
                this.gameMode = GameMode.None;
            }
        }
        // if (menu === 'Classical' || menu === 'Log2990') {
        if (menu === 'Classical') {
            this.gameMode = GameMode[menu];
        }
        // if (menu === 'Single' || menu === 'Multi') {
        if (menu === 'Single') {
            this.gameType = GameType[menu];
        }
    }
}
