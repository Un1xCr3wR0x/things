/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BilingualText, DocumentItem } from '@gosi-ui/core';
import { CurrencyDetails, EstablishmentDetails, PaymentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-receipt-details-dc',
  templateUrl: './receipt-details-dc.component.html',
  styleUrls: ['./receipt-details-dc.component.scss']
})
export class ReceiptDetailsDcComponent implements OnChanges {
  /** Local variables. */
  isOutsideGroupPresent: boolean;
  isBranchPresent: boolean;
  /** Input Variables */
  @Input() receipt: PaymentDetails;
  @Input() establishment: EstablishmentDetails;
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccFlag: boolean;
  @Input() documents: DocumentItem[];
  @Input() currency: BilingualText;
  @Input() isMofReceiptFlag: boolean;

  /* Output variables */
  @Output() mofAllocationBreakupDetails: EventEmitter<null> = new EventEmitter();
  /** Method to detect chnages in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receipt && changes.receipt.currentValue) {
      if (!this.isMofReceiptFlag) {
        this.isBranchPresent = this.receipt.branchAmount.some(item => !item.outsideGroup);
        this.isOutsideGroupPresent = this.receipt.branchAmount.some(item => item.outsideGroup);
      }
    }
  }
  getMofAllocationBreakupDetails() {
    this.mofAllocationBreakupDetails.emit();
  }
}
