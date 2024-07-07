import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class UIHistoryDto {
  uiRequests: UIHistoryItemDto[];
}

export class UIHistoryItemDto {
  /** This field holds the status date. */
  statusDate: GosiCalendar;

  /** This field holds the saned status. */
  status: BilingualText;

  /** This field holds the suspension reasons. */
  suspensionReason: BilingualText[];

  /** This field holds the cycle start date. */
  cycleStartDate: GosiCalendar;

  /** This field holds the cycle stop date. */
  cycleStopDate: GosiCalendar;

  /** This field holds benefit amount. */
  benefitAmount: number;

  /** This field holds the number of months. */
  noOfMonths: number;

  /** This field holds the request date. */
  requestDate: GosiCalendar;
}
