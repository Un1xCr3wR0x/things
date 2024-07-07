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
  selector: 'blg-available-credit-breakup-dc',
  templateUrl: './available-credit-breakup-dc.component.html',
  styleUrls: ['./available-credit-breakup-dc.component.scss']
})
export class AvailableCreditBreakupDcComponent implements OnInit {
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
  @Input() isGccCountry: boolean;

  /* Method to instantiate the component. */
  ngOnInit() {
    if (this.currencyType) {
      this.gccCurrency.english = this.currencyType.english;
      this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
    }
  }
}
