/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { LateFeeBreakUp } from '../../../../shared/models';
import { BilingualText } from '@gosi-ui/core';
import { CurrencyArabic } from '../../../../shared/enums/currency-arabic';

@Component({
  selector: 'blg-late-fees-breakup-dc',
  templateUrl: './late-fees-breakup-dc.component.html',
  styleUrls: ['./late-fees-breakup-dc.component.scss']
})
export class LateFeesBreakupDcComponent implements OnInit {
  gccCurrency: BilingualText = new BilingualText();
  @Input() lateFeesBreakup: LateFeeBreakUp;
  @Input() lateFeeTotal;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() isGccCountry: boolean;

  /* Method to instantiate the component. */
  ngOnInit() {
    if (this.currencyType) {
      this.gccCurrency.english = this.currencyType.english;
      this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
    }
  }
}
