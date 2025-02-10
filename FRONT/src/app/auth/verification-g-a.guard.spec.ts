import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verificationGAGuard } from './verification-g-a.guard';

describe('verificationGAGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => verificationGAGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
