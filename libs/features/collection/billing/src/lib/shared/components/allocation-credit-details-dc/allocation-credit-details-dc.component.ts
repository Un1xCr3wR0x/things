/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, SimpleChanges, OnChanges, Output } from '@angular/core';
import { AllocationDetails, CreditAllocation } from '../../../shared/models';
import { ContributorAllocationDetails } from '../../../shared/models/contributor-allocation-details';

@Component({
  selector: 'blg-allocation-credit-details-dc',
  templateUrl: './allocation-credit-details-dc.component.html',
  styleUrls: ['./allocation-credit-details-dc.component.scss']
})
export class AllocationCreditDetailsDcomponent implements OnChanges {
  /** Local Variables */
  listValues: CreditAllocation[] = [];
  allocationCreditTotal = 0;
  creditSummary: CreditAllocation[];
  currentCurrencyLable: string;
  /** Input Variables */
  @Input() allocationDetails: AllocationDetails;
  @Input() contributorAllocationSummary: ContributorAllocationDetails;
  @Input() exchangeRate = 1;
  @Input() currentCurrency = 'SAR';
  @Input() fromPage: string;
  @Input() isContributor = false;
  /** Output Variables */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  constructor() {}

  /** Method to detect details on input changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allocationDetails && changes.allocationDetails.currentValue) {
      this.allocationDetails = changes.allocationDetails.currentValue;
      this.allocationCreditTotal =
        this.allocationDetails.creditAdjustment +
        this.allocationDetails.creditFromPrevious +
        this.allocationDetails.incomingTransfer +
        this.allocationDetails.totalPayment;
      this.getAllocationValues(this.allocationDetails);
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }

    if (changes?.contributorAllocationSummary?.currentValue) {
      this.contributorAllocationSummary = changes.contributorAllocationSummary.currentValue;
      this.getAllocationValues(this.contributorAllocationSummary);
    }
  }

  /** Method to get allocation details and pushing this to new list */
  getAllocationValues(allocationDetails) {
    this.listValues = [];
    this.creditSummary = [];
    for (let i = 0; i < allocationDetails.creditAllocation.length; i++) {
      this.listValues.push(allocationDetails.creditAllocation[i]);
      const allocation = {
        amountFromPreviousBill: {
          debitAmount: this.listValues[i]?.amountFromPreviousBill?.debitAmount,
          allocatedAmount: this.listValues[i]?.amountFromPreviousBill?.allocatedAmount,
          balance:
            this.listValues[i]?.amountFromPreviousBill?.debitAmount -
            this.listValues[i]?.amountFromPreviousBill?.allocatedAmount
        },
        adjustmentForCurrent: {
          debitAmount: this.listValues[i].adjustmentForCurrent?.debitAmount,
          allocatedAmount: this.listValues[i]?.adjustmentForCurrent?.allocatedAmount,
          balance:
            this.listValues[i]?.adjustmentForCurrent?.debitAmount -
            this.listValues[i]?.adjustmentForCurrent?.allocatedAmount
        },
        currentMonthDues: {
          debitAmount: this.listValues[i]?.currentMonthDues?.debitAmount,
          allocatedAmount: this.listValues[i]?.currentMonthDues?.allocatedAmount,
          balance:
            this.listValues[i]?.currentMonthDues?.debitAmount - this.listValues[i]?.currentMonthDues?.allocatedAmount
        },
        type: this.listValues[i].type
      };
      this.creditSummary.push(allocation);
    }
  }
  closeConfirm() {
    this.cancel.emit();
    this.cancel.emit();
  }
}
