/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';

/**
 * Model Lov(Lookup Value) used as response type for lookup APIs such as country, currency, etc.
 *
 * @export
 * @class Lov
 */
export class LovCategory {
  value: BilingualText = new BilingualText();
  code: string = undefined;
  sequence: string = undefined;
  disabled? = false;
  category: BilingualText = new BilingualText();
  groupByValueEnglish: string;
  groupByValueArabic: string;
}
