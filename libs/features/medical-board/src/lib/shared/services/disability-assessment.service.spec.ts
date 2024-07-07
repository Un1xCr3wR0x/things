import { TestBed } from '@angular/core/testing';

import { DisabilityAssessmentService } from './disability-assessment.service';

describe('DisabilityAssessmentService', () => {
  let service: DisabilityAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisabilityAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
