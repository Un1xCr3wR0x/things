/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { Lov } from './lov';

/**
 * Model Lov(Lookup Value) used as response type for lookup APIs such as country, currency, etc.
 *
 * @export
 * @class Lov
 */
export class LovStatus {
  value: BilingualText = new BilingualText();
  channel: BilingualText = new BilingualText();
  code?: number = undefined;
  sequence: number = undefined;
  items?: Lov[] = [];
  status: BilingualText = new BilingualText();
  disabled? = false;
}
