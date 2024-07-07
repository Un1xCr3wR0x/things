/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { AccountDetails } from '../../../../shared/models';
import { BilingualText } from '@gosi-ui/core';
import { CurrencyArabic } from '../../../../shared/enums/currency-arabic';

@Component({
  selector: 'blg-vic-available-credit-breakup-dc',
  templateUrl: './vic-available-credit-breakup-dc.component.html',
  styleUrls: ['./vic-available-credit-breakup-dc.component.scss']
})
export class VicAvailableCreditBreakupDcComponent implements OnInit {
  /**
   * local variable
   */
  gccCurrency: BilingualText = new BilingualText();
  /**
   * Input variable
   */
  @Input() availableCreditBreakup: AccountDetails[];
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;

  /* Method to instantiate the component. */
  ngOnInit() {
    if (this.currencyType) {
      this.gccCurrency.english = this.currencyType.english;
      this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
    }
  }
}
