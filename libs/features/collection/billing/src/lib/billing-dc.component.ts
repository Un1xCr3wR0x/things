/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit } from '@angular/core';
import { BillingRoutingService } from './shared/services';

@Component({
  selector: 'blg-billing-dc',
  templateUrl: './billing-dc.component.html'
})
export class BillingDcComponent implements OnInit {
  /**
   * Creates an instance of BillingDcComponent
   * @param billingRoutingService
   */
  constructor(private billingRoutingService: BillingRoutingService) {}

  /**
   * This method handles initialization tasks.
   *
   * @memberof BillingDcComponent
   */
  ngOnInit() {
    this.billingRoutingService.navigateToValidator();
  }
}
