import { TestBed } from '@angular/core/testing';

import { MedicalAssessmentService } from './medical-assessment.service';

describe('MedicalAssessmentService', () => {
  let service: MedicalAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
