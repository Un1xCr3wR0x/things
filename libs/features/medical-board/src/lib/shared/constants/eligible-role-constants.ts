/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RoleIdEnum } from '@gosi-ui/core';

export class EligibleRoleConstants {
  /**
   * method to get eligible medical access for Session
   */
  public static get ELIGIBLE_SESSION_MEDICAL_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER, RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR];
  }
  public static get NO_OF_OTP_RETRIES() {
    return 3;
  }
}
