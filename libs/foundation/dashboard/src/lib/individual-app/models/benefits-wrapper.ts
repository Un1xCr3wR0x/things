import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class BenefitsWrapper {
  benefitType: BilingualText;
  benefitId: number;
  amount: number;
  assessmentDetails: AssessmentDetails = new AssessmentDetails();
}
export class AssessmentDetails {
  nextDate: GosiCalendar = new GosiCalendar();
}
