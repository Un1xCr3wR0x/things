/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

/**
 * Wrapper class to hold occupation details.
 *
 * @export
 * @class Occupation
 */
export class Occupation {
  occupationCode: string = undefined;
  occupationName: BilingualText = new BilingualText();
  workType: string = undefined;
  occupationStartDate: GosiCalendar = new GosiCalendar();
  value: BilingualText = new BilingualText();
  disabled? = false;
}
