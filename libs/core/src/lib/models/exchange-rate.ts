/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '../models/gosi-calendar';

/** Model class to hold Currency Exchange Rate details */
export class ExchangeRate {
  conversionDate: GosiCalendar = new GosiCalendar();
  conversionType: string = undefined;
  fromCurrency: string = undefined;
  toCurrency: string = undefined;
  conversionRate: number = undefined;

  /**
   * Creates an instance of ExchangeRate
   * @memberof ExchangeRate
   */
}
