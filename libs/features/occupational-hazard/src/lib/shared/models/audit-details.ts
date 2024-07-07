/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DateModel } from './date-model';
import { RejectAllowanceDetails } from './reject-allowance-details';
import { BilingualText, LovList } from '@gosi-ui/core';

export class AuditAllowanceDetails {
  allowanceDates = new DateModel();
  rejectionDates = new DateModel();
  minDate = Date;
  maxDate: Date;
  minEndDate: Date;
  allowanceDays: number;
  disabled?: boolean;
  continuousSickPresent?: boolean;
  rejectionReason?: BilingualText = new BilingualText();
  comments?: string;
  rejectedAllowanceDetails?: RejectAllowanceDetails = new RejectAllowanceDetails();
  allowanceSubType: BilingualText;
  allowanceType: BilingualText;
  auditorRejectedClaim?: boolean;
  rejectedAllowanceDays?: number;
  transactionId: number;
  treatment: number;
  isrepartition?: boolean;
  caseId?: number;
  checked?: boolean;
  distanceTravelled: number;
  amount: number;
  visits: number;
  repatriation?: boolean;
  rejectedVisits: number;
  visitList?: LovList;
}
