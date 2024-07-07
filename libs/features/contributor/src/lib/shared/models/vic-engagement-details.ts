/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { HealthRecordDetails } from './health-record-details';
import { TransactionRefDetails } from './transaction-ref-details';
import { VicEngagementPeriod } from './vic-engagement-period';

export class VicEngagementDetails {
  purposeOfRegistration: BilingualText = new BilingualText();
  engagementPeriod: VicEngagementPeriod[] = [];
  doctorVerificationStatus: string = undefined;
  healthRecords: HealthRecordDetails[] = [];
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  status: string = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  engagementId: number = undefined;
  cancellationReason?: BilingualText;
  pendingTransaction: TransactionRefDetails[] = [];
  hasActiveFutureWageAvailable: boolean = undefined;
}
