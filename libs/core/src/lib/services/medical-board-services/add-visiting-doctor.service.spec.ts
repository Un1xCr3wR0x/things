import { TestBed } from '@angular/core/testing';

import { AddVisitingDoctorService } from './add-visiting-doctor.service';

describe('AddVisitingDoctorService', () => {
  let service: AddVisitingDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddVisitingDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
