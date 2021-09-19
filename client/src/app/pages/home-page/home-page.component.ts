import { Component, OnInit } from '@angular/core';

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

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
    constructor() {}

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
