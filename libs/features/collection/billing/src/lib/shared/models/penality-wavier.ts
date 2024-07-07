/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, Name, GosiCalendar } from '@gosi-ui/core';
import { WaivePenaltyAmount } from './waive-penalty-amount';
import { WaiveDueAmount } from './waive-due-amount';
import { PreviousPenalityWavier } from './previous-penalty-waiver';

export class PenalityWavier {
  billBatchIndicator: boolean;
  terms: WaivePenaltyAmount = new WaivePenaltyAmount();
  dueAmount: WaiveDueAmount = new WaiveDueAmount();
  eligibleWaiveOffAmount: number = undefined;
  waivedPenaltyPercentage: number = undefined;
  previousInstallmentInd: BilingualText = new BilingualText();
  previouslyApprovedInd: BilingualText = new BilingualText();
  waiverPeriodPenaltyAmount: number = undefined;
  contributorName: Name = undefined;
  contributorNumber: number = undefined;
  extensionReason: string = undefined;
  paymentRequired: BilingualText = new BilingualText();
  exceptionReason: BilingualText = new BilingualText();
  waiverEndDate: GosiCalendar = new GosiCalendar();
  waiverStartDate: GosiCalendar = new GosiCalendar();
  maxWaiverEndDate: GosiCalendar = new GosiCalendar();
  minWaiverStartDate: GosiCalendar = new GosiCalendar();
  exceptionReasonOthers: string = undefined;
  previousPenaltyWaiver: PreviousPenalityWavier[] = [];
  exceptionalSociety = false;
  initiatedDate: GosiCalendar = new GosiCalendar();
  waiverViolationsPercentage:Number = undefined;
  violationsWaiverAmount:Number = undefined;
  totalWaiverAmount:Number=undefined;
  requiredPaymentAmount:Number=undefined;
  requiredPayment: Number =undefined;
  mudadCompliance: BilingualText = new BilingualText();
  qiwaCompliance:  BilingualText = new BilingualText();
}
