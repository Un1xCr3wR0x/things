/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RoleIdEnum } from '@gosi-ui/core';

export class SafetyInspectionConstants {
  public static DELTA_VALUES(): Map<string, number> {
    const map: Map<string, number> = new Map();
    map.set('min', 0).set('medium', 1).set('max', 2);
    return map;
  }

  public static get REINSPECTION_TYPE(): string {
    return 'SC';
  }

  public static get REINSPECTION_REASON(): string {
    return 'Decrease OH Rate';
  }

  /**
   * method to get the eligible roles to perfoem re-inspection transaction
   */
  public static get CREATE_INSPECTION_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.CSR, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN];
  }
  public static get CREATE_INSPECTION_ACCESS_ROLES_OH(): RoleIdEnum[] {
    return [RoleIdEnum.OH_ADMIN, RoleIdEnum.CNT_ADMIN, RoleIdEnum.REG_ADMIN];
  }
  /** Route for contributor transaction tracking view. */
  public static ROUTE_TRANSACTION_TRACKING(id: string, refId: number) {
    return `/home/transactions/view/${id}/${refId}`;
  }
}
