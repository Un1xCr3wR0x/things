/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
/**
 * Wrapper class to hold Document details.
 *
 * @export
 * @class DocumentSubmitItem
 */
export class DocumentSubmitItem {
  contentId: string = undefined;
  type: BilingualText = new BilingualText();
  sequenceNumber?: number = undefined;
}
