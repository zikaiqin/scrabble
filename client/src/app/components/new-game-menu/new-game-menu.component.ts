import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameMode, GameType } from '@app/pages/home-page/home-page.component';

@Component({
    selector: 'app-new-game-menu',
    templateUrl: './new-game-menu.component.html',
    styleUrls: ['../../pages/home-page/home-page.component.scss', './new-game-menu.component.scss'],
})
export class NewGameMenuComponent {
    @Input() gameMode: number;
    @Input() gameType: number;
    @Output() readonly goBack = new EventEmitter<string>();

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
    constructor() {}

    getTitle(): string {
        return this.gameMode === GameMode.Classical ? 'Mode Classique' : 'Mode LOG2990';
    }

    getSubTitle(): string {
        return this.gameType === GameType.Single ? 'Partie Solo' : 'Partie Multijoueur';
    }

    timeFormat(value: number) {
        const MINUTE = 60;
        if (value >= MINUTE) {
            const min = Math.floor(value / MINUTE);
            const sec = value - min * MINUTE;
            return min + `:${sec === 0 ? '00' : sec}`;
        }
        return value + 's';
    }
}
