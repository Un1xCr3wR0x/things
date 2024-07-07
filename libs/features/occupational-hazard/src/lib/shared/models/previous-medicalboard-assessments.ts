/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';

export class PreviousMedicalboardAssessments {
  assessmentId: number = undefined;
  assessmentDate: GosiCalendar = new GosiCalendar();
  reason: BilingualText = new BilingualText();
  assessmentResult: BilingualText = new BilingualText();
  assessmentType: BilingualText = new BilingualText(); 
  disabilityPercentage: number = undefined;
}
