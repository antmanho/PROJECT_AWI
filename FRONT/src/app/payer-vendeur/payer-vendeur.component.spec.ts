import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerVendeurComponent } from './payer-vendeur.component';

describe('PayerVendeurComponent', () => {
  let component: PayerVendeurComponent;
  let fixture: ComponentFixture<PayerVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayerVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayerVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
