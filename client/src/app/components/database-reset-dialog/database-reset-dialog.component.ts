import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-database-reset-dialog',
    templateUrl: './database-reset-dialog.component.html',
    styleUrls: ['../../styles.scss', './database-reset-dialog.component.scss'],
})
export class DatabaseResetDialogComponent {
    constructor(public dialogRef: MatDialogRef<DatabaseResetDialogComponent>) {}
}
