import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseResetDialogComponent } from './database-reset-dialog.component';

describe('DatabaseResetDialogComponent', () => {
    let component: DatabaseResetDialogComponent;
    let fixture: ComponentFixture<DatabaseResetDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatabaseResetDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DatabaseResetDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
