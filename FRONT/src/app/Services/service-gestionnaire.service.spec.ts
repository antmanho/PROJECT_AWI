import { TestBed } from '@angular/core/testing';

import { ServiceGestionnaireService } from './service-gestionnaire.service';

describe('ServiceGestionnaireService', () => {
  let service: ServiceGestionnaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGestionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
