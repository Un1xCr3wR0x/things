import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class RaiseWrongBenefits {
  benefitType: BilingualText;
  benefitAmount: number;
  // benefitDuration: number;
  firstPaymentDate:GosiCalendar=new GosiCalendar();
  lastBenefitsDuration: GosiCalendar = new GosiCalendar();
  recordActionType: String = undefined;
}
