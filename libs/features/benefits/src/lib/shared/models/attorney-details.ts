/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class AttorneyDetails {
  attorneySource: BilingualText;
  attorneyStatus: BilingualText;
  certificateExpiryDate: GosiCalendar;
  certificateIssueDate: GosiCalendar;
  source: BilingualText;
  authorizationDetailsId: number;
  certificateNumber: number;
  authorizationId: number;
}
