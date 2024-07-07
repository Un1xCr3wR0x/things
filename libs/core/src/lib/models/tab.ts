import { RoleIdEnum } from '../enums';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class Tab {
  label: string;
  icon: string;
  url?: string;
  id?: string;
  allowedRoles?: RoleIdEnum[] = [];
  count?: number;
  totalCount?: number;
}
