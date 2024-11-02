import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseEnVenteComponent } from './mise-en-vente.component';

describe('MiseEnVenteComponent', () => {
  let component: MiseEnVenteComponent;
  let fixture: ComponentFixture<MiseEnVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiseEnVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiseEnVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
