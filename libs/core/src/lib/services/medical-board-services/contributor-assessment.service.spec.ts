import { TestBed } from '@angular/core/testing';

import { ContributorAssessmentService } from './contributor-assessment.service';

describe('ContributorAssessmentService', () => {
  let service: ContributorAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContributorAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
