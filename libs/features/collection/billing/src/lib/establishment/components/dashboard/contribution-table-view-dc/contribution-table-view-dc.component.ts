/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { ContributionCategory, CurrencyArabic } from '../../../../shared/enums';
import { ContributionBreakup, ContributionDetails, EstablishmentShare } from '../../../../shared/models';

@Component({
  selector: 'blg-contribution-table-view-dc',
  templateUrl: './contribution-table-view-dc.component.html',
  styleUrls: ['./contribution-table-view-dc.component.scss']
})
export class ContributionTableViewDcComponent implements OnChanges {
  /* Local variables */
  typeAnnuity = ContributionCategory.annuity;
  typeUnemployment = ContributionCategory.ui;
  typeOh = ContributionCategory.oh;
  typePension = ContributionCategory.pension;
  typePPA = ContributionCategory.ppa;
  total = 0;
  gccCurrency: BilingualText = new BilingualText();

  /* Input variables */
  @Input() contributionDetails: ContributionDetails[];
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() isGccCountry: boolean;
  @Input() isMofFlag: boolean;
  @Input() contributionBreakup: ContributionBreakup;
  @Input() employerShare: EstablishmentShare;

  /**
   * Method to detect changes in inputs.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contributionDetails && changes.contributionDetails.currentValue) {
      this.total = 0;
      this.findTotalContribution();
    }
    if (this.currencyType) {
      this.gccCurrency.english = this.currencyType.english;
      this.gccCurrency.arabic = CurrencyArabic[this.currencyType.english];
    }
  }

  /** Method to find total contribution amoount. */
  findTotalContribution() {
    this.contributionDetails.forEach(item => {
      this.total += item.contributionAmount;
    });
  }
}
