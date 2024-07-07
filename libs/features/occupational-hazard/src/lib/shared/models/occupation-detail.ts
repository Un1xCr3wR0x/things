import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


/**
 * Wrapper class to hold occupation details.
 *
 * @export
 * @class OccupationDetail
 */
export class OccupationDetail {
  code: string = undefined;
  occupationName: BilingualText = new BilingualText();
  occupationType: BilingualText = new BilingualText();
  workType: string = undefined;
  occupationStartDate: GosiCalendar = new GosiCalendar();
  value: BilingualText = new BilingualText();
  disabled? = false;
  category: BilingualText = new BilingualText();
}
