import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GameMode, GameType, GameInfo, GameDifficulty } from '@app/classes/game-info';
import { DEFAULT_TURN_LENGTH } from '@app/classes/config';

@Component({
    selector: 'app-new-game-menu',
    templateUrl: './new-game-menu.component.html',
    styleUrls: ['../../styles.scss', './new-game-menu.component.scss'],
})
export class NewGameMenuComponent implements OnInit {
    @Input() gameMode: number;
    @Input() gameType: number;
    @Output() readonly buttonClick = new EventEmitter<string>();
    @Output() readonly newGame = new EventEmitter<GameInfo>();

    readonly gameTypes = GameType;
    readonly difficulties = GameDifficulty;
    readonly form: FormGroup;
    turnLength: number = DEFAULT_TURN_LENGTH;
    randomized: boolean = false;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(MIN_NAME_LENGTH), Validators.maxLength(MAX_NAME_LENGTH)]],
            difficulty: '',
        });
    }

    ngOnInit() {
        if (this.gameType === GameType.Single) {
            this.form.controls.difficulty.setValidators(Validators.required);
        }
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
        if (this.username.hasError('required')) {
            return 'Veuillez entrer un nom';
        }
        if (this.username.hasError('minlength')) {
            return `Le nom doit contenir au moins ${MIN_NAME_LENGTH} caractères`;
        }
        if (this.username.hasError('maxlength')) {
            return `Le nom ne peut dépasser ${MAX_NAME_LENGTH} caractères`;
        }
        return '';
    }

    getTurnLabel(): string {
        return `${this.turnLength} secondes`;
    }

    setTurnLength(turnLength: number | null): void {
        this.turnLength = turnLength ? turnLength : DEFAULT_TURN_LENGTH;
    }

    createGame(): void {
        this.newGame.emit({
            username: this.username.value,
            turnLength: this.turnLength,
            randomized: this.randomized,
            gameMode: this.gameMode,
            gameType: this.gameType,
            difficulty: this.difficulty.value,
        });
    }

    get username() {
        return this.form.controls.username;
    }

    get difficulty() {
        return this.form.controls.difficulty;
    }
}

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 16;
