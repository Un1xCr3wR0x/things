/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class HeirVerifyRequest {
  eventDate: GosiCalendar;
  relationship: BilingualText;
  benefitRequestReason: BilingualText;
  contributorIdentifier: number;
  dateOfBirth: GosiCalendar;
  uuid: string;
  heirNationality: BilingualText;
  contributorNationality: BilingualText;

  constructor() {
    this.dateOfBirth = new GosiCalendar();
  }
}

// export interface SearchPerson {
//   isSudi: boolean;
//   nationalId: number;
//   gccId: number;
//   iqamaNo: number;
//   passportNo: string;
//   dob: CalendarTypeHijiriGregorian;
//   calendarType: string;
// }
