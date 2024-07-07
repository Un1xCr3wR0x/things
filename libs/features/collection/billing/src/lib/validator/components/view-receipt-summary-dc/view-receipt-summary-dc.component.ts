/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencySar } from '@gosi-ui/core';
import { BillingConstants } from '../../../shared/constants';
import { ReceiptApprovalStatus } from '../../../shared/enums';
import { CurrencyDetails, PaymentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-view-receipt-summary-dc',
  templateUrl: './view-receipt-summary-dc.component.html',
  styleUrls: ['./view-receipt-summary-dc.component.scss']
})
export class ViewReceiptSummaryDcComponent implements OnChanges {
  /** Local variables */
  isOtherBank = false;
  isLocalBank = false;
  isAmountFlag = false;
  otherCurrency = false;
  isCancelReceipt = false;
  penaltyLabel: string;

  /** Input variables */
  @Input() receipt: PaymentDetails;
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccFlag: boolean;
  @Input() isMOF: boolean;
  establishmentType: string;

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receipt && changes.receipt.currentValue) this.setFlagsForView();
  }

  /** Method to set flags for view. */
  setFlagsForView() {
    if (this.receipt.receiptMode.english) {
      if (this.receipt.bank.name === null || this.receipt.bank.name.english === 'Other') {
        this.isOtherBank = true;
      }
      if (this.receipt.bank.type.english === 'Local Bank') {
        this.isLocalBank = true;
      }
    }
    if(this.receipt.mofIndicator === BillingConstants.MOF_GOSI_ESTABLISHMENT) {
      this.establishmentType = 'GOSI';
    }
    if(this.receipt.mofIndicator === BillingConstants.MOF_PPA_ESTABLISHMENT) this.establishmentType = 'PPA';
    if (this.receipt.amountReceived.amount) {
      this.isAmountFlag = true;
    }
    if (this.receipt.amountReceived.currency !== CurrencySar.ENGLISH) {
      this.otherCurrency = true;
    }
    if (this.receipt.status?.english === ReceiptApprovalStatus.TO_BE_CANCELLED) {
      this.isCancelReceipt = true;
      this.penaltyLabel = 'BILLING.CALCULATE-LATE-FEES';
    } else {
      this.isCancelReceipt = false;
      this.penaltyLabel = 'BILLING.REMOVE-LATE-FEES';
    }
  }
}
