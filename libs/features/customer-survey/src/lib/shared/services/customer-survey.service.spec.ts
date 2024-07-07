import { TestBed } from '@angular/core/testing';

import { CustomerSurveyService } from './customer-survey.service';

describe('CustomerSurveyService', () => {
  let service: CustomerSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
