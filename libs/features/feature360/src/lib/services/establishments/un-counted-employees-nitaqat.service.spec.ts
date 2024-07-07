import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { UnCountedEmployeesNitaqat } from '../../models/establishments/un-counted-employees-nitaqat';

import { UnCountedEmployeesNitaqatService } from './un-counted-employees-nitaqat.service';

describe('UnCountedEmployeesNitaqatService', () => {
  let service: UnCountedEmployeesNitaqatService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnCountedEmployeesNitaqatService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(UnCountedEmployeesNitaqatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uncounted employees nitaqat services', () => [
    it('should total number of uncounted nitaqat employees', () => {
      const registrationNo = 34564566;
      const gosiregnumber = 123456;
      let unCountedEmployeesNitaqat: UnCountedEmployeesNitaqat = new UnCountedEmployeesNitaqat();
      unCountedEmployeesNitaqat.total = 10;

      const response = {
        elements: [unCountedEmployeesNitaqat]
      };
      const url = `${service.interceptUrl}/customer360/bv_un_counted_employees_in_nitaqat/views/bv_un_counted_employees_in_nitaqat?$filter=p_registrationnumber+in+%27${registrationNo}%27+AND+p_gosiregnumber+in+%27${gosiregnumber}%27`;
      service.getUnCountedEmployeesNitaqat(registrationNo, gosiregnumber).subscribe(res => {
        expect(res.total).toBe(unCountedEmployeesNitaqat.total);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
