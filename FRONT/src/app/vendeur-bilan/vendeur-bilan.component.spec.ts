import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendeurBilanComponent } from './vendeur-bilan.component';

describe('VendeurBilanComponent', () => {
  let component: VendeurBilanComponent;
  let fixture: ComponentFixture<VendeurBilanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendeurBilanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendeurBilanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
