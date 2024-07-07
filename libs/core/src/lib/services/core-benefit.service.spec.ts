import { TestBed } from '@angular/core/testing';

import { CoreBenefitService } from './core-benefit.service';

describe('CoreBenefitService', () => {
  let service: CoreBenefitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreBenefitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
