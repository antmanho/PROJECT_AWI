import { TestBed } from '@angular/core/testing';

import { ServiceVendeurService } from './service-vendeur.service';

describe('ServiceVendeurService', () => {
  let service: ServiceVendeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceVendeurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
