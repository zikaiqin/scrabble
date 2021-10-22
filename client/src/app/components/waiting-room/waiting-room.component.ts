import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WaitingRoomDialogComponent } from '@app/components/waiting-room-dialog/waiting-room-dialog.component';
import { GameInfo, GameType } from '@app/classes/game-info';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['../../pages/home-page/home-page.component.scss', './waiting-room.component.scss'],
})
export class WaitingRoomComponent {
    @Output() buttonClick = new EventEmitter<string>();
    @Output() leaveRoom = new EventEmitter();
    @Output() newGame = new EventEmitter<GameInfo>();
    @Input() configs: GameInfo;

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        const dialogRef = this.dialog.open(WaitingRoomDialogComponent);
        dialogRef.afterClosed().subscribe((difficulty) => {
            if (difficulty === undefined) {
                return;
            }
            this.configs.difficulty = difficulty;
            this.configs.gameType = GameType.Single;
            this.leaveRoom.emit();
            this.newGame.emit(this.configs);
        });
    }
}
