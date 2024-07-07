import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { PenaltyWaiverSegmentList } from './penalty-waiver-segment-list';
import { PenaltyWaiverEventDate } from './penalty-waiver-event-date';
import { QuoteValue } from './quote-value';
import { SelectedCriteriaValues } from './selected-criteria-values';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PenaltyWaiverSegmentRequest {
  comments: string = undefined;
  entitySelectionCriteria: PenaltyWaiverSegmentList = new PenaltyWaiverSegmentList();
  entityType: string = undefined;
  eventDate: PenaltyWaiverEventDate[] = [];
  reason: BilingualText = new BilingualText();
  reasonOthers: string = undefined;
  paymentRequired: boolean;
  waiverEndDate: GosiCalendar = new GosiCalendar();
  waiverStartDate: GosiCalendar = new GosiCalendar();
  waivedPenaltyPercentage: number = undefined;
  uuid: string = undefined;
  waiverType: string = undefined;
  quote: QuoteValue = new QuoteValue();
  selectedCriteria: SelectedCriteriaValues = new SelectedCriteriaValues();
}
