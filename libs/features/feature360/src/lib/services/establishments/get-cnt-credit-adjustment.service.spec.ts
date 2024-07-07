import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntCreditAdjustment } from '../../models/establishments/get-cnt-credit-adjustment';

import { GetCntCreditAdjustmentService } from './get-cnt-credit-adjustment.service';

describe('GetCntCreditAdjustmentService', () => {
  let service: GetCntCreditAdjustmentService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntCreditAdjustmentService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntCreditAdjustmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt credit adjustment service', () => [
    it('should get cnt credit adjustment', () => {
      const establishmentId = 34564566;
      const fromDate = new Date();
      let cntCreditAdjustment: GetCntCreditAdjustment = new GetCntCreditAdjustment();
      cntCreditAdjustment.adjustmentcredit = 1234;

      const response = {
        elements: [cntCreditAdjustment]
      };
      const url = `${
        service.interceptUrl
      }/customer360/bv_cnt_get_credit_adjustment/views/bv_cnt_get_credit_adjustment?$filter=p_fromdate+in+%27${service.getDate(
        fromDate
      )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getCreditAdjustment(fromDate, establishmentId).subscribe(res => {
        expect(res.adjustmentcredit).toBe(cntCreditAdjustment.adjustmentcredit);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
