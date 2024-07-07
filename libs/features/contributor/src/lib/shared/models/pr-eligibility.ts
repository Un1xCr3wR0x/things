import { BilingualText } from '@gosi-ui/core';

export class pensionReformEligibility {
  message?: BilingualText = new BilingualText();
  pensionReformEligible: string;
  reason: [];
  ageAsOnPensionReformDate?: number;
  servicePeriodInMonths?: number;
  personAlive?: boolean;
  activeMilitary?: boolean;
  havingValidEngagements?: boolean;
}
