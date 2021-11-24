import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseResetDialogComponent } from '@app/components/database-reset-dialog/database-reset-dialog.component';
import { Router } from '@angular/router';

type Page = 'dict' | 'bot';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['../../styles.scss', './admin-page.component.scss'],
})
export class AdminPageComponent {
    page: Page = 'dict';

    constructor(public dialog: MatDialog, private router: Router) {}

    openResetDialog(): void {
        const dialogRef = this.dialog.open(DatabaseResetDialogComponent);
        dialogRef.afterClosed().subscribe((reset) => {
            if (reset) {
                this.openResetDialog();
            }
        });
    }

    showHomePage(): void {
        this.router.navigateByUrl('/home');
    }
}
