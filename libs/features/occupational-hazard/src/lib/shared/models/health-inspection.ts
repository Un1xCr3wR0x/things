/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class HealthInspection {
  inspectionReason: BilingualText;
  establishmentList: string[] = [];
  isParticipantAttendanceRequired: string;
  isVdRequired: boolean;
  specialtyList: SpecialityList[];
  vdDetails: vdDetails = new vdDetails();
}
export class SpecialityList {
  isMainSpecialty: boolean;
  specialty: BilingualText;
  subSpecialty: BilingualText[];
}
export class vdDetails {
  vdReason: BilingualText;
  vdReasonDescription: string;
  vdSpecialties: [];
}
