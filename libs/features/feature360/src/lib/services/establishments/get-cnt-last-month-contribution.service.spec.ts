import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntLastMonthContribution } from '../../models/establishments/get-cnt-last-month-contribution';

import { GetCntLastMonthContributionService } from './get-cnt-last-month-contribution.service';

describe('GetCntLastMonthContributionService', () => {
  let service: GetCntLastMonthContributionService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntLastMonthContributionService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntLastMonthContributionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt last month contribution service', () => [
    it('should get cnt last month contribution', () => {
      const establishmentId = 34564566;
      const fromDate = new Date();
      let cntLastMonthContribution: GetCntLastMonthContribution = new GetCntLastMonthContribution();
      cntLastMonthContribution.contribution = 1234;

      const response = {
        elements: [cntLastMonthContribution]
      };
      const url = `${
        service.interceptUrl
      }/customer360/bv_cnt_get_last_month_contribution/views/bv_cnt_get_last_month_contribution?$filter=p_fromdate+in+%27${service.getDate(
        fromDate
      )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getLastMonthContribution(fromDate, establishmentId).subscribe(res => {
        expect(res.contribution).toBe(cntLastMonthContribution.contribution);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
