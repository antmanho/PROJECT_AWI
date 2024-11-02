import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilanGrapheComponent } from './bilan-graphe.component';

describe('BilanGrapheComponent', () => {
  let component: BilanGrapheComponent;
  let fixture: ComponentFixture<BilanGrapheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilanGrapheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilanGrapheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
