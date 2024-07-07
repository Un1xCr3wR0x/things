/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExchangeRate } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  /**
   *
   * @param http
   */
  constructor(readonly http: HttpClient) {}

  /**
   * Method to get exchange rate for currency conversion.
   * @param fromCurrency
   * @param toCurrency
   */
  getExchangeRate(fromCurrency: string, toCurrency: string, reqDate: string): Observable<number> {
    const httpHeaders = new HttpHeaders().set('Accept', 'application/json');
    const options = {
      headers: httpHeaders
    };
    //const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const exchangeRate = `/api/v1/erp/exchangerate?conversionDate=${reqDate}&conversionType=Corporate&fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`;
    return this.http
      .get<ExchangeRate>(exchangeRate, options)
      .pipe(map((response: ExchangeRate) => response.conversionRate));
  }
}
