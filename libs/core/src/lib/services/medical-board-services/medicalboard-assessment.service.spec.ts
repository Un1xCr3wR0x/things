import { TestBed } from '@angular/core/testing';

import { MedicalboardAssessmentService } from './medicalboard-assessment.service';

describe('MedicalboardAssessmentService', () => {
  let service: MedicalboardAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalboardAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
