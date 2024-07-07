/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdjustmentDetails, BillSummary } from '../../../../shared/models';
import { BilingualText } from '@gosi-ui/core';
import { CurrencyArabic } from '../../../../shared/enums';

@Component({
  selector: 'blg-adjustment-dc',
  templateUrl: './adjustment-dc.component.html',
  styleUrls: ['./adjustment-dc.component.scss']
})
export class AdjustmentDcComponent implements OnChanges {
  /* Local variables */
  totalValue = 0;
  gccCurrency: BilingualText = new BilingualText();
  notApplicableFlag = false;

  /* Input variables */
  @Input() adjustmentBreakup: AdjustmentDetails[];
  @Input() exchangeRate = 1;
  @Input() summary: BillSummary[];
  @Input() isGccCountry: boolean;
  @Input() currencyType: BilingualText;
  @Input() isMofFlag: boolean;
  @Input() violationCount: number;

  /**
   * This method is used to handle the changes in the input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.summary && changes.summary.currentValue) {
      this.totalValue = 0;
      this.summary.forEach(item => {
        if (item.type.english === 'Adjustments') {
          this.totalValue = item.amount;
        }
      });
      if (this.currencyType) {
        this.gccCurrency.english = this.currencyType.english;
        this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
      }
    }
  }
}
