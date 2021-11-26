import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotConfigDialogComponent } from './bot-config-dialog.component';

describe('BotConfigDialogComponent', () => {
    let component: BotConfigDialogComponent;
    let fixture: ComponentFixture<BotConfigDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BotConfigDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BotConfigDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
