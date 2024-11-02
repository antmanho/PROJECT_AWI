import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraitListeComponent } from './retrait-liste.component';

describe('RetraitListeComponent', () => {
  let component: RetraitListeComponent;
  let fixture: ComponentFixture<RetraitListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetraitListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetraitListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
