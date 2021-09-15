import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChevaletComponent } from './chevalet.component';

describe('ChevaletComponent', () => {
  let component: ChevaletComponent;
  let fixture: ComponentFixture<ChevaletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChevaletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChevaletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
