/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RoleIdEnum } from '@gosi-ui/core';

export class TerminateEstablishmentConstants {
  /**
   * method to get the eligible roles to perfoem the terminate establishment action
   */
  public static get TERMINATE_ESTABLISHMENT_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.GCC_CSR, RoleIdEnum.CSR, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.GCC_ADMIN];
  }
  public static get REOPEN_ESTABLISHMENT_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.GCC_CSR, RoleIdEnum.CSR];
  }
}
