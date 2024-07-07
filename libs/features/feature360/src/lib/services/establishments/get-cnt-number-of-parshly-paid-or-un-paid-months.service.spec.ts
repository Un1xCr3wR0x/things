import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntNumberOfParshlyPaidOrUnPaidMonths } from '../../models/establishments/get-cnt-number-of-parshly-paid-or-un-paid-months';

import { GetCntNumberOfParshlyPaidOrUnPaidMonthsService } from './get-cnt-number-of-parshly-paid-or-un-paid-months.service';

describe('GetCntNumberOfParshlyPaidOrUnPaidMonthsService', () => {
  let service: GetCntNumberOfParshlyPaidOrUnPaidMonthsService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntNumberOfParshlyPaidOrUnPaidMonthsService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntNumberOfParshlyPaidOrUnPaidMonthsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt parshly paid or unpaid service', () => [
    it('should get cnt number of unpaid months', () => {
      const establishmentId = 34564566;
      let cntNumberOfParshlyPaidOrUnPaidMonths: GetCntNumberOfParshlyPaidOrUnPaidMonths =
        new GetCntNumberOfParshlyPaidOrUnPaidMonths();
      cntNumberOfParshlyPaidOrUnPaidMonths.nounpaidmonths = 5;

      const response = {
        elements: [cntNumberOfParshlyPaidOrUnPaidMonths]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_number_of_parshly_paid_or_unpaid_months/views/bv_cnt_number_of_parshly_paid_or_unpaid_months?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntNumberOfParshlyPaidOrUnPaidMonths(establishmentId).subscribe(res => {
        expect(res.nounpaidmonths).toBe(cntNumberOfParshlyPaidOrUnPaidMonths.nounpaidmonths);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
