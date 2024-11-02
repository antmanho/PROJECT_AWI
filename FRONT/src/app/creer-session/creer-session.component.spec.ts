import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerSessionComponent } from './creer-session.component';

describe('CreerSessionComponent', () => {
  let component: CreerSessionComponent;
  let fixture: ComponentFixture<CreerSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
