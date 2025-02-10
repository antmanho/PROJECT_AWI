import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verificationVGuard } from './verification-v.guard';

describe('verificationVGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => verificationVGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
