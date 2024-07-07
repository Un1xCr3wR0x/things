/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class InjuryHistory {
  injuryNo: number = undefined;
  injuryId: number = undefined;
  date: GosiCalendar = new GosiCalendar();
  type: BilingualText = new BilingualText();
  injuryType: BilingualText = new BilingualText();
  actualStatus?: BilingualText = new BilingualText();
  injuryReason: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  place?: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  establishmentName: BilingualText = new BilingualText();
  complication?: InjuryHistory[];
  disableId?: boolean;
  engagementId: number = undefined;
  establishmentRegNo: number = undefined;
  addComplicationAllowed: boolean;
}
export class VDFormValue {
  vdReason: BilingualText;
  vdReasonDescription: string;
  visitingDoctor: BilingualText;
  visitingDoctorSpecialty: BilingualText[];
}
