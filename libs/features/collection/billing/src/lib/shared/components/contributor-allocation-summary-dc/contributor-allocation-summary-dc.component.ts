/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'blg-contributor-allocation-summary-dc',
  templateUrl: './contributor-allocation-summary-dc.component.html',
  styleUrls: ['./contributor-allocation-summary-dc.component.scss']
})
export class ContributorAllocationSummaryDcomponent implements OnInit, OnChanges {
  /** Local Variables */
  currentCurrencyLable: string;

  /** Input Variables */
  @Input() contributorAllocationSummary;
  @Input() exchangeRate = 1;
  @Input() currentCurrency: string;
  constructor() {}

  /** Method to fetch details on inialising data */
  ngOnInit() {}

  /** Method to fetch details on input changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = changes.currentCurrency.currentValue;
    }
    if (changes?.contributorAllocationSummary?.currentValue) {
      this.contributorAllocationSummary = changes.contributorAllocationSummary.currentValue;
    }
  }
}
