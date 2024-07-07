/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { TestBed } from '@angular/core/testing';
import { ExchangeRate } from '../models';

describe('ExchangeRateService', () => {
  let httpMock: HttpTestingController;
  let service: ExchangeRateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ExchangeRateService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  describe('getExchangeRate', () => {
    it('should get exchange rate', () => {
      const conversionDetails = new ExchangeRate();
      conversionDetails.conversionRate = 1.01;

      const url = `/api/v1/erp/exchangerate?conversionDate=2020-11-18&conversionType=Corporate&fromCurrency=BHD&toCurrency=SAR`;
      service.getExchangeRate('BHD', 'SAR', '2020-11-18').subscribe(res => {
        expect(res).toEqual(1.01);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(conversionDetails);
    });
  });
});
