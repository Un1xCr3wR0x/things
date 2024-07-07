/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../enums';
import { RouterData } from '../models/router-data';
import { RouterDataToken } from '../tokens';

export abstract class BaseRoutingService {
  constructor(@Inject(RouterDataToken) readonly routerData: RouterData, readonly router: Router) {}

  abstract setToLocalToken();

  isValidator(): boolean {
    if (
      (this.routerData && this.routerData.assignedRole === Role.CNT_FC_APPROVER) ||
      (this.routerData && this.routerData.assignedRole === Role.VALIDATOR) ||
      (this.routerData && this.routerData.assignedRole === Role.VALIDATOR_1) ||
      (this.routerData && this.routerData.assignedRole === Role.VALIDATOR_2) ||
      (this.routerData && this.routerData.assignedRole === Role.CSB_DIRECTOR) ||
      (this.routerData && this.routerData.assignedRole === Role.INSURANCE_OP_HEAD) ||
      (this.routerData && this.routerData.assignedRole === Role.INSURANCE_DIRECTOR) ||
      (this.routerData && this.routerData.assignedRole === Role.BRANCH_MANAGER) ||
      (this.routerData && this.routerData.assignedRole === Role.COMPLIANCE_MANAGER) ||
      (this.routerData && this.routerData.assignedRole === Role.BACKDATE_ENGAGEMENT_VALIDATOR)
    ) {
      return true;
    } else {
      return false;
    }
  }
  isAdmin() {
    // confirm the role coming in routerData for GOL
    if (this.routerData && this.routerData?.assignedRole === Role.ESTABLISHMENT_ADMIN) {
      return true;
    } else {
      return false;
    }
  }
}
