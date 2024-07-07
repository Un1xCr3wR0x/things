import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class VicEngagementDetails {
  purposeOfRegistration: BilingualText = new BilingualText();
  engagementPeriod: VicEngagementPeriod[] = [];
  doctorVerificationStatus: string = undefined;
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  status: string = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  engagementId: number = undefined;
  cancellationReason?: BilingualText;
  hasActiveFutureWageAvailable: boolean = undefined;
}
export class VicEngagementPeriod {
  basicWage: number = undefined;
  occupation: BilingualText = new BilingualText();
  contributionAmount: number = undefined;
  wageCategory: number = undefined;
  coverageTypes: BilingualText[] = [];
  editFlow?: boolean;
  startDate: GosiCalendar = new GosiCalendar();
  isCurrentPeriod: boolean = undefined;
  status: string = undefined;
  monthlyContributoryWage: number = undefined;
}
