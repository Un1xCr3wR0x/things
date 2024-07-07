import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GetCntPaymentPeriodService } from './get-cnt-payment-period.service';
import { EnvironmentToken } from '@gosi-ui/core';
import { GetCntPaymentPeriod } from '../../models/establishments/get-cnt-payment-period';

describe('GetCntPaymentPeriodService', () => {
  let service: GetCntPaymentPeriodService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetCntPaymentPeriodService,
        {
          provide: EnvironmentToken,
          useValue: { baseUrl: 'localhost:8080/' }
        }
      ]
    });

    service = TestBed.inject(GetCntPaymentPeriodService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cnt payment period service', () => [
    it('should get cnt payment period', () => {
      let cntPaymentPeriod: GetCntPaymentPeriod = new GetCntPaymentPeriod();
      cntPaymentPeriod.regularpdenddate = { gregorian: new Date(), hijiri: '' };

      const response = {
        elements: [cntPaymentPeriod]
      };
      const url = `${service.interceptUrl}/customer360/bv_cnt_get_payment_period/views/bv_cnt_get_payment_period`;
      service.getPaymentPeriod().subscribe(res => {
        expect(res.regularpdenddate).toBe(cntPaymentPeriod.regularpdenddate);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    })
  ]);
});
