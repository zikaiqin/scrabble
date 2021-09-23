import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameMenuComponent } from './new-game-menu.component';

describe('NewGameMenuComponent', () => {
    let component: NewGameMenuComponent;
    let fixture: ComponentFixture<NewGameMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewGameMenuComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewGameMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
