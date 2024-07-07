/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-receipt-overview-modal-dc',
  templateUrl: './receipt-overview-modal-dc.component.html',
  styleUrls: ['./receipt-overview-modal-dc.component.scss']
})
export class ReceiptOverviewModalDcComponent implements OnChanges {
  /** Local variables */
  isOutsideGroupPresent: boolean;
  isBranchPresent: boolean;
  isApproved: boolean;
  /** Input variables */
  @Input() receipt: PaymentDetails;
  @Input() establishment: EstablishmentDetails;
  @Input() isGccCountry: boolean;
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccCurrency: BilingualText;

  /** Output variables */
  @Output() closeModal: EventEmitter<null> = new EventEmitter();

  /** Method to detect chnages in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receipt && changes.receipt.currentValue) {
      this.isBranchPresent = this.receipt.branchAmount.some(item => !item.outsideGroup);
      this.isOutsideGroupPresent = this.receipt.branchAmount.some(item => item.outsideGroup);
      this.isApproved = this.receipt.approvalStatus.english === 'Approved';
    }
  }

  /** Method to close the receipt overview view. */
  closeReceiptOverview() {
    this.closeModal.emit();
  }
}
