import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoueurVirtuelleComponent } from './joueur-virtuelle.component';

describe('JoueurVirtuelleComponent', () => {
  let component: JoueurVirtuelleComponent;
  let fixture: ComponentFixture<JoueurVirtuelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoueurVirtuelleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoueurVirtuelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
