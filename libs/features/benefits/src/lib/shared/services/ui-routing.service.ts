/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants, RouterData, RouterDataToken } from '@gosi-ui/core';

@Injectable({
  providedIn: 'root'
})
export class UiRoutingService {
  /**
   * Creates an instance of UiRoutingService
   * @param routerData router data
   * @param contributionPaymentData token
   * @param router router
   */
  constructor(@Inject(RouterDataToken) readonly routerData: RouterData, readonly router: Router) {}

  /** This method is to navigate to inbox. */
  navigateToInbox() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
}
