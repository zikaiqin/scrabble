import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GameMode, GameType } from '@app/pages/home-page/home-page.component';

const MINUTE = 60;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 16;
const DEFAULT_TURN_LENGTH = MINUTE;

@Component({
    selector: 'app-new-game-menu',
    templateUrl: './new-game-menu.component.html',
    styleUrls: ['../../pages/home-page/home-page.component.scss', './new-game-menu.component.scss'],
})
export class NewGameMenuComponent {
    @Input() gameMode: number;
    @Input() gameType: number;
    @Output() readonly goBack = new EventEmitter<string>();

    turnLength: number;
    readonly userName = new FormControl('', [Validators.required, Validators.minLength(MIN_NAME_LENGTH), Validators.maxLength(MAX_NAME_LENGTH)]);

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
    constructor() {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.turnLength = DEFAULT_TURN_LENGTH;
    }

    getTitle(): string {
        return this.gameMode === GameMode.Classical ? 'Mode Classique' : 'Mode LOG2990';
    }

    getSubTitle(): string {
        return this.gameType === GameType.Single ? 'Partie Solo' : 'Partie Multijoueur';
    }

    getNameHint(): string {
        return `Entrer un nom entre ${MIN_NAME_LENGTH} et ${MAX_NAME_LENGTH} caractères`;
    }

    getNameError(): string {
        if (this.userName.hasError('required')) {
            return 'Veuillez entrer un nom';
        }
        if (this.userName.hasError('minlength')) {
            return `Le nom doit contenir au moins ${MIN_NAME_LENGTH} caractères`;
        }
        if (this.userName.hasError('maxlength')) {
            return `Le nom ne peut dépasser ${MAX_NAME_LENGTH} caractères`;
        }
        return '';
    }

    getTurnLabel(): string {
        return `Temps de tour : ${this.turnLength} secondes`;
    }

    setTurnLength(turnLength?: number | null) {
        this.turnLength = turnLength ? turnLength : DEFAULT_TURN_LENGTH;
    }

    timeFormat(value: number) {
        if (value >= MINUTE) {
            const min = Math.floor(value / MINUTE);
            const sec = value - min * MINUTE;
            return min + `:${sec === 0 ? '00' : sec}`;
        }
        return value + 's';
    }
}
