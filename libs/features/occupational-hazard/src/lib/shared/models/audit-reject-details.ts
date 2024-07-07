import { DateModel } from './date-model';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AuditRejectAllowanceDetails {
  allowanceSubType: BilingualText = new BilingualText();
  allowanceType: BilingualText = new BilingualText();
  claimId: number;
  rejectedAllowance?: number;
  rejectedAllowanceDates: DateModel = new DateModel();
  rejectedDistance?: number;
  rejectedVisits?: number;
  rejectionReason: BilingualText = new BilingualText();
  rejectionRequestDate?: GosiCalendar = new GosiCalendar();
  status?: BilingualText = new BilingualText();
  comments?: string;
  recoveryAppliedOn?: BilingualText = new BilingualText();
}
