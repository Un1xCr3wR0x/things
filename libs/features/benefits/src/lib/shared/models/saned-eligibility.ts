import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class UISanedBenifitEligibilityListDto {
  uiContributorEligibilityDetailsItemDto: UISanedBenifitsEligibilityListItemDto[];
}

export class UISanedBenifitsEligibilityListItemDto {
  /** This field holds the status date. */
  date: GosiCalendar;

  /** This field holds the saned status. */
  status: BilingualText;

  /** This field holds the reasons. */
  reason: BilingualText[];
}
