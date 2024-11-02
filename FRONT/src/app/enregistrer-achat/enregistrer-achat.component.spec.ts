import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrerAchatComponent } from './enregistrer-achat.component';

describe('EnregistrerAchatComponent', () => {
  let component: EnregistrerAchatComponent;
  let fixture: ComponentFixture<EnregistrerAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnregistrerAchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnregistrerAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
