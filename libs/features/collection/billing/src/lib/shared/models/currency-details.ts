/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class CurrencyDetails {
  countryCode: string = undefined;
  currencyCode: BilingualText = new BilingualText();
  exchangeRate: number = undefined;
  convertedAmount: number = undefined;
  convertedAllocationAmount:number = undefined;

  constructor(currencyCode?: BilingualText, exchangeRate?: number, convertedAmount?: number) {
    if (currencyCode) this.currencyCode = currencyCode;
    if (exchangeRate) this.exchangeRate = exchangeRate;
    if (convertedAmount) this.convertedAmount = convertedAmount;
  }
}
