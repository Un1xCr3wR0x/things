/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { LateFeeBreakUp } from '../../../../shared/models';
import { BilingualText } from '@gosi-ui/core';
import { CurrencyArabic } from '../../../../shared/enums/currency-arabic';
import { ContributionCategory } from '../../../../shared/enums/contribution-category';

@Component({
  selector: 'blg-vic-late-fees-breakup-dc',
  templateUrl: './vic-late-fees-breakup-dc.component.html',
  styleUrls: ['./vic-late-fees-breakup-dc.component.scss']
})
export class VicLateFeesBreakupDcComponent implements OnInit {
  /**
   * Local Variables
   */
  gccCurrency: BilingualText = new BilingualText();
  typeAnnuity = ContributionCategory.annuity;
  /**
   * Input Variables
   */

  @Input() lateFeesBreakup: LateFeeBreakUp;
  @Input() lateFeeTotal;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;

  /* Method to instantiate the component. */
  ngOnInit() {
    if (this.currencyType) {
      this.gccCurrency.english = this.currencyType.english;
      this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
    }
  }
}
