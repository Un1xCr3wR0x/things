import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { CountedEmployeesNitaqat } from '../../models/establishments/counted-employees-nitaqat';

import { CountedEmployeesNitaqatService } from './counted-employees-nitaqat.service';

describe('CountedEmployeesNitaqatService', () => {
  let service: CountedEmployeesNitaqatService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CountedEmployeesNitaqatService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(CountedEmployeesNitaqatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('counted-employees nitaqat service', () => [
    it('should total number of nitaqat employees', () => {
      const registrationNo = 34564566;
      let employeesNitaqat: CountedEmployeesNitaqat = new CountedEmployeesNitaqat();
      employeesNitaqat.total = registrationNo;

      const response = {
        elements: [employeesNitaqat]
      };
      const url = `${service.interceptUrl}/customer360/bv_counted_employees_in_nitaqat/views/bv_counted_employees_in_nitaqat?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
      service.getCountedEmployeesNitaqat(registrationNo).subscribe(res => {
        expect(res.total).toBe(employeesNitaqat.total);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
