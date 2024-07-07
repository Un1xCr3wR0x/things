import { GosiCalendar } from '@gosi-ui/core';

/** Model class to hold Currency Exchange Rate details */
export class ExchangeRate {
  conversionDate: GosiCalendar = new GosiCalendar();
  conversionType: string = undefined;
  fromCurrency: string = undefined;
  toCurrency: string = undefined;
  conversionRate: number = undefined;
}
