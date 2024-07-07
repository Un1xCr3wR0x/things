import { GosiCalendar } from '@gosi-ui/core';

export class RaiseEngagementDetails {
  cancelledPeriodEndDate: GosiCalendar = new GosiCalendar();
  cancelledPeriodStartDate: GosiCalendar = new GosiCalendar();
  contributionAmount: number = undefined;
  engagementId: number = undefined;
  recordActionType: String = undefined;
  isBenefitEffected: boolean;
  isEngagementBackdated: boolean;
  isFullyCancelled: boolean;
  isWageCorrected: boolean;
  isProvisionsViolating: boolean;
}
