/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterDataToken, RouterData, RouterConstants } from '@gosi-ui/core';
import { PaymentConstants, AdjustmentConstants } from './shared';

@Component({
  selector: 'pmt-payment-dc',
  templateUrl: './payment-dc.component.html'
})
export class PaymentDcComponent implements OnInit {
  /** Local variables */
  isValidator = false;

  /**
   * Creates an instance of UiDcComponent
   * @param routerData
   * @param router
   */
  constructor(@Inject(RouterDataToken) private routerData: RouterData, readonly router: Router) {}

  /**
   * This method handles initialization tasks.
   *
   * @memberof Pay Online
   */
  ngOnInit() {
    //Validator flow
    if (this.routerData.resourceType === 'Pay Online') {
      this.router.navigate([PaymentConstants.ROUTE_PAY_ONLINE]);
    } else if (this.routerData.resourceType === RouterConstants.TRANSACTION_ADJUSTMENT_REPAYMENT) {
      this.router.navigate([PaymentConstants.APPROVE_ADJUSTMENT_REPAYMENT]);
    } else if (this.routerData.resourceType === PaymentConstants.MISCELLANEOUS_PAYMENT) {
      this.router.navigate([PaymentConstants.ROUTE_VALIDATOR]);
    } else if (this.routerData.resourceType === AdjustmentConstants.HEIR_MAINTAIN_ADJUSTMENT) {
      this.router.navigate([AdjustmentConstants.HEIR_ADJUSTMENT_ROUTE]);
    }
  }
  /* navigate to validator screens*/
  navigateToValidatorScreens() {
    if (this.routerData.resourceType === PaymentConstants.ROUTE_PAY_ONLINE_VALIDATOR) {
      this.router.navigate(['home/payment/validator/approve-pay-online'], {});
    }
  }
}
