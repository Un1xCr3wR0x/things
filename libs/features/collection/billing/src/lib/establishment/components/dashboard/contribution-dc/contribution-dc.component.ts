/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { BillBreakup, BillSummary, EstablishmentShare } from '../../../../shared/models';

@Component({
  selector: 'blg-contribution-dc',
  templateUrl: './contribution-dc.component.html',
  styleUrls: ['./contribution-dc.component.scss']
})
export class ContributionDcComponent implements OnChanges {
  /** Local Variables */
  lang = 'en';
  tabView = false; //To switch between tabular view and chart
  breakupTableView=false;
  totalValue = 0;

  /* Input variables */
  @Input() billBreakup: BillBreakup;
  @Input() admin: boolean;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() summary: BillSummary[];
  @Input() isGccCountry: boolean;
  @Input() lawType: BilingualText;
  @Input() isPPA: boolean;
  @Input() isMofFlag: boolean;
  @Input() employerShare: EstablishmentShare;

  /**
   * This method is used to handle the changes in the input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.summary && changes.summary.currentValue) {
      this.summary.forEach(item => {
        if (item.type.english === 'Contributions') {
          this.totalValue = item.amount;
        }
      });
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = this.exchangeRate;
    }
  }

  /** Method to handle switching between chart and table view. */
  switchView(type: string) {
    if (type === 'chart') {
      this.tabView = false;
      this.breakupTableView=false;
    } else if (type === 'breakup_table') {
      this.tabView = false;
      this.breakupTableView=true;
    }
    else{
      this.breakupTableView=false;
      this.tabView=true;
    }
  }
}
