import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueVendeurComponent } from './catalogue_vendeur.component';

describe('CatalogueComponent', () => {
  let component: CatalogueVendeurComponent;
  let fixture: ComponentFixture<CatalogueVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
