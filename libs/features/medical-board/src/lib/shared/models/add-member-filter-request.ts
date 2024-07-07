import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AddMemberFilterRequest {
  touched:boolean;
  speciality: BilingualText[] = [];
  subSpeciality: BilingualText[] = [];
  location: BilingualText[] = [];
  availability: BilingualText[] = [];
  medicalBoardType: BilingualText[] = [];
  assessmentType?: BilingualText[] = [];
}
