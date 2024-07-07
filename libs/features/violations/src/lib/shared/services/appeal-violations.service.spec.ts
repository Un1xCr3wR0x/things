import { TestBed } from '@angular/core/testing';

import { AppealViolationsService } from './appeal-violations.service';

describe('AppealViolationsService', () => {
  let service: AppealViolationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppealViolationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
