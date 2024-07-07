/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Lov } from '../models';
import { BilingualText } from './bilingual-text';

/**
 * Model Lov(Lookup Value) used as response type for lookup APIs such as country, currency, etc.
 */
export class LovList {
  [x: string]: any;
  hasError? = false;
  items: Lov[];
  errorMessage?: BilingualText = new BilingualText();

  constructor(items: Lov[]) {
    this.items = items;
  }
}
