/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
//Class to wrap a drop down item details or tab details
export class DropdownItem {
  id: number | string = undefined; // Unique identifier
  key?: string = undefined; // translation key
  value?: BilingualText = new BilingualText(); // Value if key not in i18n
  subValue?: BilingualText = new BilingualText(); // If any sub values like role
  icon?: string = undefined; //Icon to display before the value,
  count?: number = undefined; //Icon to display before the value
  disabled? = false;
}
