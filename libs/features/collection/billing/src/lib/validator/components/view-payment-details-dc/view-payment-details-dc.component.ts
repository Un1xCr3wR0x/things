/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { BranchBreakup, CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-view-payment-details-dc',
  templateUrl: './view-payment-details-dc.component.html',
  styleUrls: ['./view-payment-details-dc.component.scss']
})
export class ViewPaymentDetailsDcComponent implements OnChanges {
  isOutsideGroupPresent: boolean;
  isBranchPresent: boolean;
  branchAmount: BranchBreakup[];

  //Input variables
  @Input() establishmentInfo: EstablishmentDetails;
  @Input() paymentDetails: PaymentDetails;
  @Input() canReturn: boolean;
  @Input() gccFlag: boolean;
  @Input() currency: BilingualText;
  @Input() isMOF: boolean;
  @Input() currencyDetails: CurrencyDetails;
  @Input() isReopenClosingInProgress : boolean;

  //Output variables
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentDetails && changes.paymentDetails.currentValue) {
      if (!this.isMOF) {
        this.isOutsideGroupPresent = this.paymentDetails.branchAmount.some(item => item.outsideGroup);
        this.isBranchPresent = this.paymentDetails.branchAmount.some(item => !item.outsideGroup);
      }
    }
  }

  // Method to emit edit details
  onEditPaymentDetails() {
    this.onEdit.emit();
  }
}
