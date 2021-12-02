import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseResetDialogComponent } from '@app/components/database-reset-dialog/database-reset-dialog.component';
import { HttpService } from '@app/services/http.service';
import { BotName, Dictionary, GameDifficulty } from '@app/classes/game-info';

type Page = 'dict' | 'bot';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['../../styles.scss', './admin-page.component.scss'],
})
export class AdminPageComponent {
    page: Page = 'dict';
    dictData: Dictionary[];
    botData: BotName[];
    botDifficulty = GameDifficulty.Easy;

    constructor(public dialog: MatDialog, private httpService: HttpService, private router: Router) {}

    openResetDialog(): void {
        const dialogRef = this.dialog.open(DatabaseResetDialogComponent);
        dialogRef.afterClosed().subscribe((reset) => {
            if (reset) {
                this.httpService.resetDB().subscribe({
                    complete: () => this.getBots(),
                });
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

    addBot(name: string): void {
        this.httpService.addBot(name, this.botDifficulty).subscribe({
            complete: () => this.getBots(),
        });
    }

    deleteBots(ids: string[]): void {
        this.httpService.deleteBots(ids, this.botDifficulty).subscribe({
            complete: () => this.getBots(),
        });
    }

    editBot(bot: Partial<BotName>): void {
        this.httpService.editBot(bot.id as string, bot.name as string, this.botDifficulty).subscribe({
            complete: () => this.getBots(),
        });
    }

    getDicts(): void {
        this.httpService.getDicts().subscribe((res) => {
            this.dictData = res as Dictionary[];
        });
    }

    addDict(): void {
        void 0;
    }

    downloadDict(id: string) {
        this.httpService.downloadDict(id).subscribe((res) => {
            const name = (res as Dictionary).name;
            const file = new Blob([JSON.stringify(res, null, JSON_INDENT)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = name;
            a.click();
            a.remove();
        });
    }

    parseFile() {
        void 0;
    }

    selectFile() {
        void 0;
    }
}

const JSON_INDENT = 4;
