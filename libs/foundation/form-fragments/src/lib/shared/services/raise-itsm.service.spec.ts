import { TestBed } from '@angular/core/testing';

import { RaiseItsmService } from './raise-itsm.service';

describe('RaiseItsmService', () => {
  let service: RaiseItsmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaiseItsmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
