/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { AccountDetails } from '../../../shared/models';
import { CurrencyArabic } from '../../../shared/enums/currency-arabic';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'blg-available-credit-breakup-dc',
  templateUrl: './available-credit-breakup-dc.component.html',
  styleUrls: ['./available-credit-breakup-dc.component.scss']
})
export class AvailableCreditBreakupDcComponent implements OnInit {
  /**
   * Input variable
   */
  @Input() currencyType: BilingualText;
  @Input() availableCreditBreakup: AccountDetails[];
  @Input() isGccCountry: boolean;
  @Input() exchangeRate = 1;

  /**
   * local variable
   */
  gccCurrency: BilingualText = new BilingualText();

  /* Method to instantiate the component. */
  ngOnInit() {
    if (this.currencyType) {
      this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
      this.gccCurrency.english = this.currencyType.english;
    }
  }
}
