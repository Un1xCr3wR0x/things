import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntPaidAmount } from '../../models/establishments/get-cnt-paid-amount';

import { GetCntPaidAmountService } from './get-cnt-paid-amount.service';

describe('GetCntPaidAmountService', () => {
  let service: GetCntPaidAmountService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntPaidAmountService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntPaidAmountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt totally paid amount service', () => [
    it('should get cnt paid amount', () => {
      const establishmentId = 34564566;
      let cntPaidAmount: GetCntPaidAmount = new GetCntPaidAmount();
      cntPaidAmount.paidamount = 5;

      const response = {
        elements: [cntPaidAmount]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_paid_amount/views/bv_cnt_paid_amount?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntPaidAmount(establishmentId).subscribe(res => {
        expect(res.paidamount).toBe(cntPaidAmount.paidamount);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
