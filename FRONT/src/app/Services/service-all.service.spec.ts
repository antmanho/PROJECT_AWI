import { TestBed } from '@angular/core/testing';

import { ServiceAllService } from './service-all.service';

describe('ServiceAllService', () => {
  let service: ServiceAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
