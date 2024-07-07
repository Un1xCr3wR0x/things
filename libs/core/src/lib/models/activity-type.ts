/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';

/**
 * Wrapper class to hold activity type details
 *
 * @export
 * @class ActivityType
 */
export class ActivityType {
  code: number = undefined;
  id: string = undefined;
  name: BilingualText = new BilingualText();
  sectorIndicator: number = undefined;
}
