import { RoleIdEnum } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class RoleConstants {
  public static get INDV_ROLES() {
    return [
      {
        roleId: RoleIdEnum.VIC,
        roleName: 'DASHBOARD.VIC'
      },
      {
        roleId: RoleIdEnum.SUBSCRIBER,
        roleName: 'DASHBOARD.SUBSCRIBER'
      },
      {
        roleId: RoleIdEnum.GUEST,
        roleName: 'DASHBOARD.GUEST'
      },
      {
        roleId: RoleIdEnum.CONTRACTED_DOCTOR,
        roleName: 'DASHBOARD.CONTRACTED_DOCTOR'
      }
    ];
  }
}
