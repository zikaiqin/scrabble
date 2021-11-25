import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { GameDifficulty } from '@app/classes/game-info';

@Component({
    selector: 'app-bot-config-select',
    template: `
        <mat-form-field appearance="outline">
            <mat-select [value]="difficulty" (valueChange)="difficultyChange.emit($event)">
                <mat-option [value]="gameDifficulty.Easy">Profil Novice</mat-option>
                <mat-option [value]="gameDifficulty.Hard">Profil Expert</mat-option>
            </mat-select>
        </mat-form-field>
    `,
    styles: [
        `
            .mat-form-field.mat-form-field {
                margin-bottom: 0;
            }

            .mat-form-field-flex {
                margin-top: 0 !important;
            }

            .mat-form-field-infix {
                border-top: none;
                padding: 0.6em 0 !important;
            }

            .mat-form-field-outline {
                top: 0 !important;
            }

            .mat-form-field-wrapper {
                margin: 0 !important;
                padding: 0;
            }

            .mat-select-arrow-wrapper {
                transform: none !important;
            }
        `,
    ],
    styleUrls: ['../../styles.scss', '../../pages/admin-page/admin-page.component.scss', './bot-config.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BotConfigSelectComponent {
    @Input() difficulty: number;
    @Output() difficultyChange = new EventEmitter<number>();

    readonly gameDifficulty = GameDifficulty;
}
