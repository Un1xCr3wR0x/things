import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntUnPaidAmount } from '../../models/establishments/get-cnt-un-paid-amount';

import { GetCntUnPaidAmountService } from './get-cnt-un-paid-amount.service';

describe('GetCntUnPaidAmountService', () => {
  let service: GetCntUnPaidAmountService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntUnPaidAmountService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntUnPaidAmountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt unpaid amount service', () => [
    it('should get unpaid amount', () => {
      const establishmentId = 34564566;
      let cntUnPaidAmount: GetCntUnPaidAmount = new GetCntUnPaidAmount();
      cntUnPaidAmount.unpaidamount = 5;

      const response = {
        elements: [cntUnPaidAmount]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_unpaid_amount/views/bv_cnt_unpaid_amount?$filter=p_establishmentid+in+%27${establishmentId}%27`;
      service.getCntUnPaidAmount(establishmentId).subscribe(res => {
        expect(res.unpaidamount).toBe(cntUnPaidAmount.unpaidamount);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
