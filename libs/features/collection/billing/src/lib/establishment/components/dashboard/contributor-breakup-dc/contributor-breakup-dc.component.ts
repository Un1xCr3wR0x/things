/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AfterViewChecked, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent, BilingualText } from '@gosi-ui/core';
import { ContributionCategory } from '../../../../shared/enums';
import { ContributionBreakup } from '../../../../shared/models';

@Component({
  selector: 'blg-contributor-breakup-dc',
  templateUrl: './contributor-breakup-dc.component.html',
  styleUrls: ['./contributor-breakup-dc.component.scss']
})
export class ContributorBreakupDcComponent extends BaseComponent implements OnChanges, AfterViewChecked {
  /** Local Variables */
  elementWidth = 0;
  xCoordinate = 0;
  percentage = 0;
  totalSaudi = 0;
  totalNonSaudi = 0;
  annuityCount = 0;
  uiCount = 0;
  ohCount = 0;
  AnnuityPPACount = 0;
  AnnuityPensionCount = 0;

  @Input() contributionBreakup: ContributionBreakup;
  @Input() isGccCountry: boolean;
  @Input() lawType: BilingualText;
  @Input() isPPA: boolean;

  /**
   * This method is to create an instance of BillingContributorBreakupDcComponent
   */
  constructor() {
    super();
  }

  /** This method is to detect chanes in component views */
  ngAfterViewChecked() {}

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contributionBreakup && changes.contributionBreakup.currentValue) {
      this.calculatePercentageAndCount();
    }
    if (changes && changes?.isGccCountry?.currentValue) this.isGccCountry = changes.isGccCountry.currentValue;
  }

  /** This method is to calculate the percentage and count of contributors */
  calculatePercentageAndCount() {
    this.contributionBreakup.contributionDetails.forEach(product => {
      if (product.productType.english.toLowerCase() === ContributionCategory.annuity.toLowerCase()) {
        this.annuityCount = product.noOfContributor;
      } else if (product.productType.english.toLowerCase() === ContributionCategory.oh.toLowerCase()) {
        this.ohCount = product.noOfContributor;
      } else if (product.productType.english.toLowerCase() === ContributionCategory.ui.toLowerCase()) {
        this.uiCount = product.noOfContributor;
      } else if (product.productType.english.toLowerCase() === ContributionCategory.ppa.toLowerCase()) {
        this.AnnuityPPACount = product.noOfContributor;
      } else if (product.productType.english.toLowerCase() === ContributionCategory.pension.toLowerCase()) {
        this.AnnuityPensionCount = product.noOfContributor;
      }
    });
  }
}
