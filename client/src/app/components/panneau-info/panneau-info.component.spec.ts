import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauInfoComponent } from './panneau-info.component';

describe('PanneauInfoComponent', () => {
  let component: PanneauInfoComponent;
  let fixture: ComponentFixture<PanneauInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanneauInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanneauInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


