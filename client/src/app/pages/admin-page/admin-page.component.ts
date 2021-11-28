import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseResetDialogComponent } from '@app/components/database-reset-dialog/database-reset-dialog.component';
import { HttpService } from '@app/services/http.service';
import { BotName, GameDifficulty } from '@app/classes/game-info';

type Page = 'dict' | 'bot';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['../../styles.scss', './admin-page.component.scss'],
})
export class AdminPageComponent {
    page: Page = 'bot';
    botData: BotName[];
    botDifficulty = GameDifficulty.Easy;

    constructor(public dialog: MatDialog, private httpService: HttpService, private router: Router) {}

    openResetDialog(): void {
        const dialogRef = this.dialog.open(DatabaseResetDialogComponent);
        dialogRef.afterClosed().subscribe((reset) => {
            if (reset) {
                this.httpService.resetDB();
            }
        });
    }

    showHomePage(): void {
        this.router.navigateByUrl('/home');
    }

    getBots(): void {
        this.httpService.getBots(this.botDifficulty).subscribe((res) => {
            this.botData = res as BotName[];
        });
    }

    addBot(name: string) {
        this.httpService.addBot(name, this.botDifficulty).subscribe({
            complete: () => this.getBots(),
        });
    }

    deleteBots(ids: string[]) {
        this.httpService.deleteBots(ids, this.botDifficulty).subscribe({
            complete: () => this.getBots(),
        });
    }

    editBot(bot: Partial<BotName>) {
        this.httpService.editBot(bot.id as string, bot.name as string, this.botDifficulty).subscribe({
            complete: () => this.getBots(),
        });
    }
}
