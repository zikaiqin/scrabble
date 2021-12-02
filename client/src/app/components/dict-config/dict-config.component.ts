import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DEFAULT_DICTIONARY_ID } from '@app/classes/config';
import { Dictionary } from '@app/classes/game-info';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

export type DialogAction = 'add' | 'edit' | 'delete';

@Component({
    selector: 'app-dict-config',
    templateUrl: './dict-config.component.html',
    styleUrls: ['../../styles.scss', '../../pages/admin-page/admin-page.component.scss', './dict-config.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class DictConfigComponent implements AfterViewInit {
    @Input() set data(data: Dictionary[]) {
        this.tableData.data = data;
        this.selection.clear();
    }
    @Output() get = new EventEmitter<null>();
    @Output() add = new EventEmitter<Partial<Dictionary>>();
    @Output() delete = new EventEmitter<string[]>();
    @Output() edit = new EventEmitter<Partial<Dictionary>>();
    @Output() download = new EventEmitter<string>();
    @ViewChild(MatTable) table: MatTable<Dictionary>;

    readonly tableColumns: string[] = ['select', 'name', 'description', 'actions', 'id'];
    tableData = new MatTableDataSource<Dictionary>();
    selection = new SelectionModel<Dictionary>(true, []);

    constructor(public dialog: MatDialog) {}

    ngAfterViewInit(): void {
        this.fetchDicts();
    }

    isDefault(dict: Dictionary) {
        return dict.id === DEFAULT_DICTIONARY_ID;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.tableData.data.filter((dict) => !this.isDefault(dict)).length;
        return numSelected === numRows;
    }

    isToggleEnabled() {
        return this.tableData.data ? this.tableData.data.some((dict) => !this.isDefault(dict)) : false;
    }

    toggleAll() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.tableData.data.filter((dict) => !this.isDefault(dict)));
    }

    fetchDicts(): void {
        this.get.emit();
    }

    addDict(name: string, description: string) {
        this.add.emit({ name, description });
    }

    deleteDict(ids: string[]) {
        this.delete.emit(ids);
    }

    editDict(id: string, name: string, description: string) {
        this.edit.emit({ id, name, description });
    }

    downloadDict(id: string) {
        this.download.emit(id);
    }

    openDialog(action: DialogAction, target?: Partial<Dictionary>, params?: Partial<Dictionary>[]) {
        void [action, target, params];
    }
}
