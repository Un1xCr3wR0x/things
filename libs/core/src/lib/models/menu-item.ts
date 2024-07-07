/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { QueryParams } from './query-params';

/**
 * Model class to hold menu item details.
 *
 * @export
 * @class MenuItem
 */
export class MenuItem {
  label: string = undefined;
  link: string = undefined;
  icon?: string = undefined;
  open?: boolean;
  active? = false;
  hasSubMenu?: boolean;
  menuItems?: MenuItem[];
  queryParams?: QueryParams;
  allowedFeatures?: string[];
  allowedLocations?: string;
  isEstablishmentRequired? = false;
  isVicRequired? = false;
  isPpaEstablishment? = false;
  isImage? = false;
  hideMenuForPpa? = false;
}
