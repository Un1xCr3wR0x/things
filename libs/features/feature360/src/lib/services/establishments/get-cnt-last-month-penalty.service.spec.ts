import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntLastMonthPenalty } from '../../models/establishments/get-cnt-last-month-penalty';

import { GetCntLastMonthPenaltyService } from './get-cnt-last-month-penalty.service';

describe('GetCntLastMonthPenaltyService', () => {
  let service: GetCntLastMonthPenaltyService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntLastMonthPenaltyService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntLastMonthPenaltyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt last month penalty service', () => [
    it('should get cnt last month penalty', () => {
      const establishmentId = 34564566;
      const fromDate = new Date();
      let cntLastMonthPenalty: GetCntLastMonthPenalty = new GetCntLastMonthPenalty();
      cntLastMonthPenalty.penalty = 1234;

      const response = {
        elements: [cntLastMonthPenalty]
      };
      const url = `${
        service.interceptUrl
      }/customer360/bv_cnt_get_last_month_penalty/views/bv_cnt_get_last_month_penalty?$filter=p_fromdate+in+%27${service.getDate(
        fromDate
      )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getLastMonthPenalty(fromDate, establishmentId).subscribe(res => {
        expect(res.penalty).toBe(cntLastMonthPenalty.penalty);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
