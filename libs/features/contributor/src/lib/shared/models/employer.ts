/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';

/**
 * Wrapper class to hold contributors employer details.
 *
 * @export
 * @class Employer
 */
export class Employer {
  code: number = undefined;
  //   employerName: BilingualText = new BilingualText();
  value: BilingualText = new BilingualText();
  disabled? = false;
}
