import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntNumberOfTotallyPaidMonths } from '../../models/establishments/get-cnt-number-of-totally-paid-months';

import { GetCntNumberOfTotallyPaidMonthsService } from './get-cnt-number-of-totally-paid-months.service';

describe('GetCntNumberOfTotallyPaidMonthsService', () => {
  let service: GetCntNumberOfTotallyPaidMonthsService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntNumberOfTotallyPaidMonthsService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntNumberOfTotallyPaidMonthsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt totally paid months service', () => [
    it('should get cnt number of totally paid months', () => {
      const establishmentId = 34564566;
      let cntNumberOfTotallyPaidMonths: GetCntNumberOfTotallyPaidMonths = new GetCntNumberOfTotallyPaidMonths();
      cntNumberOfTotallyPaidMonths.nopaidmonths = 5;

      const response = {
        elements: [cntNumberOfTotallyPaidMonths]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_number_of_totally_paid_months/views/bv_cnt_number_of_totally_paid_months?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntNumberOfTotallyPaidMonths(establishmentId).subscribe(res => {
        expect(res.nopaidmonths).toBe(cntNumberOfTotallyPaidMonths.nopaidmonths);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
