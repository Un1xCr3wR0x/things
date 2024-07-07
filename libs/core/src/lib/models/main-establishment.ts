/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';

/**
 * Response expected in establishment api when called with query param
 *
 * @export
 * @class MenuItem
 */
export class MainEstablishmentInfo {
  registrationNo: number;
  status: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
}
