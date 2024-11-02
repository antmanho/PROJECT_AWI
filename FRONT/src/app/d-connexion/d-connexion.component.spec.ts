import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DConnexionComponent } from './d-connexion.component';

describe('DConnexionComponent', () => {
  let component: DConnexionComponent;
  let fixture: ComponentFixture<DConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DConnexionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
