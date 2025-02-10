import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasLeRoleComponent } from './pas-le-role.component';

describe('PasLeRoleComponent', () => {
  let component: PasLeRoleComponent;
  let fixture: ComponentFixture<PasLeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasLeRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasLeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
