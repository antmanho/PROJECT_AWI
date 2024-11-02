import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerVendeurListeComponent } from './payer-vendeur-liste.component';

describe('PayerVendeurListeComponent', () => {
  let component: PayerVendeurListeComponent;
  let fixture: ComponentFixture<PayerVendeurListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayerVendeurListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayerVendeurListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
