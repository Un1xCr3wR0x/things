import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntDebitAdjustmentAndPaidViolation } from '../../models/establishments/get-cnt-debit-adjustment-and-paid-violation';

import { GetCntDebitAdjustmentAndPaidViolationService } from './get-cnt-debit-adjustment-and-paid-violation.service';

describe('GetCntDebitAdjustmentAndPaidViolationService', () => {
  let service: GetCntDebitAdjustmentAndPaidViolationService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntDebitAdjustmentAndPaidViolationService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntDebitAdjustmentAndPaidViolationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt debit adjustment and paid violation service', () => [
    it('should get cnt credit adjustment', () => {
      const establishmentId = 34564566;
      const fromDate = new Date();
      let cntDebitAdjustmentAndPaidViolation: GetCntDebitAdjustmentAndPaidViolation =
        new GetCntDebitAdjustmentAndPaidViolation();
      cntDebitAdjustmentAndPaidViolation.adjustmentcredit = 1234;

      const response = {
        elements: [cntDebitAdjustmentAndPaidViolation]
      };
      const url = `${
        service.interceptUrl
      }/customer360/bv_cnt_get_debit_adjustment_and_paid_violation/views/bv_cnt_get_debit_adjustment_and_paid_violation?$filter=p_fromdate+in+%27${service.getDate(
        fromDate
      )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
      service.getDebitAdjustmentAndPaidViolation(fromDate, establishmentId).subscribe(res => {
        expect(res.adjustmentcredit).toBe(cntDebitAdjustmentAndPaidViolation.adjustmentcredit);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
