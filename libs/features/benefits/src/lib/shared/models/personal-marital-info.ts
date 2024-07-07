/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

/**
 * The wrapper class for personal marital information.
 *
 * @export
 * @class PersonalMaritalInfo
 */
export class PersonalMaritalInfo {
  spouseId: number;
  eventDate: GosiCalendar;
  maritalStatus: BilingualText;
  source: BilingualText;
}
