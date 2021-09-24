import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassTurnComponent } from './pass-turn.component';

describe('PassTurnComponent', () => {
    let component: PassTurnComponent;
    let fixture: ComponentFixture<PassTurnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PassTurnComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PassTurnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
