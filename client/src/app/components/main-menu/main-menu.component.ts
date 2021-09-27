import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuButton } from '@app/classes/menu-button';
import { GameMode } from '@app/pages/home-page/home-page.component';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['../../pages/home-page/home-page.component.scss'],
})
export class MainMenuComponent {
    @Input() gameMode: number;
    @Input() gameType: number;
    @Output() readonly navigationEvent = new EventEmitter<string>();

    readonly mainMenu: MenuButton[] = [
        { name: 'Classical', text: 'Scrabble Classique' },
        { name: 'Log2990', text: 'Scrabble LOG2990' },
        { name: 'Scoreboard', text: 'Meilleurs Scores' },
    ];
    readonly secondMenu: MenuButton[] = [
        { name: 'Single', text: 'Jouer Solo' },
        { name: 'Multi', text: 'Jouer Ensemble' },
        { name: 'BrowseGames', text: 'Joindre une partie' },
        { name: 'Back' },
    ];

    getTitle(): string {
        if (!this.gameMode) {
            return 'Scrabble';
        } else {
            return this.gameMode === GameMode.Classical ? 'Mode Classique' : 'Mode LOG2990';
        }
    }

    getButtons(): MenuButton[] {
        if (!this.gameMode) {
            return this.mainMenu;
        } else {
            return this.secondMenu;
        }
    }

    buttonClick(name: string) {
        this.navigationEvent.emit(name);
    }
}
