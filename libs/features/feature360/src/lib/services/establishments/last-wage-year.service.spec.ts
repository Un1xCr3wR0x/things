import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { LastWageYear } from '../../models/establishments/last-wage-year';

import { LastWageYearService } from './last-wage-year.service';

describe('LastWageYearService', () => {
  let service: LastWageYearService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LastWageYearService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(LastWageYearService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt last wage year service', () => [
    it('should get last wage year', () => {
      const establishmentId = 34564566;
      let lastWageYear: LastWageYear = new LastWageYear();
      lastWageYear.wageyear = 2021;

      const response = {
        elements: [lastWageYear]
      };
      const url = `${service.interceptUrl}/customer360/bv_last_wage_year/views/bv_last_wage_year?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getLastWageYear(establishmentId).subscribe(res => {
        expect(res.wageyear).toBe(lastWageYear.wageyear);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
