import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictConfigComponent } from './dict-config.component';

describe('DictConfigComponent', () => {
    let component: DictConfigComponent;
    let fixture: ComponentFixture<DictConfigComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DictConfigComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
