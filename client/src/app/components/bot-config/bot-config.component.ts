import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BotName, GameDifficulty } from '@app/classes/game-info';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-bot-config',
    templateUrl: './bot-config.component.html',
    styleUrls: ['../../styles.scss', '../../pages/admin-page/admin-page.component.scss', './bot-config.component.scss'],
})
export class BotConfigComponent implements AfterViewInit {
    @Input() set data(data: BotName[]) {
        this.tableData.data = data;
    }
    @Output() get = new EventEmitter<number>();
    @Output() add = new EventEmitter<{ name: string; difficulty: number }>();
    @ViewChild(MatTable) table: MatTable<BotName>;

    readonly tableColumns: string[] = ['name', 'default', 'id'];
    tableData = new MatTableDataSource<BotName>();
    difficulty: number = GameDifficulty.Easy;

    ngAfterViewInit(): void {
        this.getNames();
    }

    getNames(): void {
        this.get.emit(this.difficulty);
    }

    addName(name: string) {
        this.add.emit({ name, difficulty: this.difficulty });
    }
}
