/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RouterConstants } from '@gosi-ui/core';
// import { ContributorRouteConstants } from '../constants';
import { ManageWageService } from '../services';

@Injectable()
export class EngagementActionGuard implements CanActivate {
  constructor(readonly router: Router, readonly mangeWageService: ManageWageService) {}

  /** If service contains the keys activate the route, otherwise route to profile search. */
  canActivate() {
    if (
      this.mangeWageService.registrationNo &&
      this.mangeWageService.socialInsuranceNo &&
      this.mangeWageService.engagementId
    )
      return true;
    else {
      // this.router.navigate([ContributorRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_SEARCH]);
      this.router.navigate([RouterConstants.ROUTE_TRANSACTION_HISTORY]); 
      return false;
    }
  }
}
