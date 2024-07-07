/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AllocationDetails } from '../../../shared/models';

@Component({
  selector: 'blg-allocation-credit-summary-dc',
  templateUrl: './allocation-credit-summary-dc.component.html',
  styleUrls: ['./allocation-credit-summary-dc.component.scss']
})
export class AllocationCreditSummaryDcomponent implements OnInit, OnChanges {
  /** Local Variables */
  allocationCreditTotal = 0;
  currentCurrencyLable: string;
  /** Input Variables */
  @Input() allocationDetails: AllocationDetails;
  @Input() exchangeRate = 1;
  @Input() currentCurrency = 'SAR';
  @Input() fromPage;

  constructor() {}

  /** Method to get details on initialising*/
  ngOnInit() {}

  /** Method to fetch details on input changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allocationDetails && changes.allocationDetails.currentValue) {
      this.allocationDetails = changes.allocationDetails.currentValue;
      if (this.fromPage !== 'vic' && this.fromPage !== 'mofAllocation') {
        this.allocationCreditTotal =
          this.allocationDetails?.creditAdjustment +
          this.allocationDetails?.creditFromPrevious +
          this.allocationDetails?.incomingTransfer +
          this.allocationDetails?.totalPayment;
      } else {
        this.allocationCreditTotal =
          this.allocationDetails?.creditAdjustment +
          this.allocationDetails?.creditFromPrevious +
          this.allocationDetails?.totalPayment;
      }
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
  }
}
