/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Expenses } from './expenses';
import { Claims } from './claims-wrapper';
import { CompanionDetails } from './companion-details';

export class ClaimsWrapper {
  claimType: number = undefined;
  claims: Claims[];
  totalAmount: number = undefined;
  companion: CompanionDetails;
  endDate: GosiCalendar = new GosiCalendar();
  injuryStatus?: number;
  expenses: Expenses[];
  payableTo: string = undefined;
  sin: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  transactionMessage: BilingualText = new BilingualText();
}
