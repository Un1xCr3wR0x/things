import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class BenefitInfo {
  benefitAmount: number;
  benefitDuration: number;
  benefitId: number;
  benefitType: BilingualText;
  firstPaymentDate:GosiCalendar;
  lastBenefitDate: GosiCalendar;
}
