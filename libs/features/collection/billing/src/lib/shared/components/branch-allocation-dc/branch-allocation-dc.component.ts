/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { CurrencyDetails, PaymentDetails } from '../../models';

@Component({
  selector: 'blg-branch-allocation-dc',
  templateUrl: './branch-allocation-dc.component.html',
  styleUrls: ['./branch-allocation-dc.component.scss']
})
export class BranchAllocationDcComponent implements OnChanges {
  /** Local variables */
  currentCurrency = 'SAR';
  /** Input variables */
  @Input() receipt: PaymentDetails;
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccFlag: boolean;
  @Input() currency: BilingualText;
  @Input() headingBackgroundRequired = false;
  @Input() showOutsideEstablishment: boolean;
  @Input() ThreeDecimalLabel = false;
  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currency && changes.currency.currentValue && !changes.currency.isFirstChange()) {
      this.currentCurrency = 'BILLING.' + changes.currency.currentValue.english;
    }
  }
}
