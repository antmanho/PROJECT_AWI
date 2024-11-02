import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DInscriptionComponent } from './d-inscription.component';

describe('DInscriptionComponent', () => {
  let component: DInscriptionComponent;
  let fixture: ComponentFixture<DInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DInscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
