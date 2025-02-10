import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationSessionComponent } from './modification-session.component';

describe('ModificationSessionComponent', () => {
  let component: ModificationSessionComponent;
  let fixture: ComponentFixture<ModificationSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
