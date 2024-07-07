import { TestBed } from '@angular/core/testing';

import { IndividualDashboardService } from './individual-dashboard.service';

describe('IndividualDashboardService', () => {
  let service: IndividualDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
