import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseResetDialogComponent } from '@app/components/database-reset-dialog/database-reset-dialog.component';
import { HttpService } from '@app/services/http.service';
import { BotName } from '@app/classes/game-info';

type Page = 'dict' | 'bot';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['../../styles.scss', './admin-page.component.scss'],
})
export class AdminPageComponent {
    page: Page = 'bot';
    botData: BotName[];

    constructor(public dialog: MatDialog, private httpService: HttpService, private router: Router) {}

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

    getBots(difficulty: number): void {
        this.httpService.getBots(difficulty).subscribe((res) => {
            this.botData = res as BotName[];
        });
    }

    addBot(name: string, difficulty: number) {
        this.httpService.addBot(name, difficulty).subscribe({
            complete: () => this.getBots(difficulty),
        });
    }
}
