/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
import { LovCategory } from './lov-category';

/**
 * Model Lov(Lookup Value) used as response type for lookup APIs such as country, currency, etc.
 */
export class LovCategoryList {
  hasError? = false;
  items: LovCategory[];
  errorMessage?: BilingualText = new BilingualText();

  constructor(items: LovCategory[]) {
    this.items = items;
  }
}
