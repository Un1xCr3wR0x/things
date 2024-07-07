/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyDetails, PaymentDetails } from '../../models';

@Component({
  selector: 'blg-receipt-basic-details-dc',
  templateUrl: './receipt-basic-details-dc.component.html',
  styleUrls: ['./receipt-basic-details-dc.component.scss']
})
export class ReceiptBasicDetailsDcComponent {
  constructor() {}
  /** Input variables */
  @Input() isMofReceiptFlag: boolean;
  @Input() receipt: PaymentDetails;
  @Input() gccFlag: boolean;
  @Input() currencyDetails: CurrencyDetails;

  /* Output variables */
  @Output() mofAllocationBreakupDetails: EventEmitter<number> = new EventEmitter();

  getMofAllocationBreakupDetails() {
    this.mofAllocationBreakupDetails.emit();
  }
}
