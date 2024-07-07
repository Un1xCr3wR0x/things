/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class RequireVisitingDoctor {
  vdreason: BilingualText;
  vdReasonDescription: string = undefined;
  vdSpecialties: BilingualText[];
  visitingDoctor: boolean = undefined;
  visitingDoctorSpecialty?; //To Redo change
}
