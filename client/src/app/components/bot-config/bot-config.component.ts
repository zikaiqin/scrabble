import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BotName } from '@app/classes/game-info';
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
    @Input() difficulty: number;
    @Output() difficultyChange = new EventEmitter<number>();
    @Output() get = new EventEmitter<null>();
    @Output() add = new EventEmitter<string>();
    @ViewChild(MatTable) table: MatTable<BotName>;

    readonly tableColumns: string[] = ['name', 'default', 'id'];
    tableData = new MatTableDataSource<BotName>();

    ngAfterViewInit(): void {
        this.getNames();
    }

    getNames(): void {
        this.get.emit();
    }

    addName(name: string) {
        this.add.emit(name);
    }
}
