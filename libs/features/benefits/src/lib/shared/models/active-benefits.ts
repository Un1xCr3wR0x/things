/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdditionalContributionDetails } from './additional-contribution-details';
import { DependentDetails } from './dependent-details';
import { Assessment } from './disability-assessment-details';
import { HeirBenefitDetails } from './heir-benefit-details';
import { PersonBankDetails } from './person-bank-details';

export class ActiveBenefits {
  additionalContributionDetails: AdditionalContributionDetails;
  amount: number;
  lastBenefitAmount: number;
  appeal: boolean;
  benefitRequestId: number;
  benefitType: BilingualText;
  benefitStartDate: GosiCalendar;
  benefitReason: BilingualText;
  missingDate: GosiCalendar;
  missingDateStr: string;
  dependentAmount: number;
  assessmentDetails?: Assessment;
  deathDate: GosiCalendar;
  deathDateStr: string;
  contributorAmount: number;
  heirBenefitDetails: HeirBenefitDetails[];
  finalAverageWage: number;
  paidMonths: number;
  injuryId?: number;
  identifier?: string;
  nationalId?: number;
  // unbornPersonId: number;
  // unbornMotherId: number;
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  status: BilingualText;
  sin: number;
  contributorSin?: number;
  nin?: number;
  waiveStartDate: GosiCalendar;
  waiveStopDate: GosiCalendar;
  notes: string;
  beneficiaryBenefitStatus: BilingualText;
  warningMessages?: Array<BilingualText>;
  dependentDetails?: DependentDetails[];
  lateRequestDetails: LateRequestedDetails;
  expiryDate?: GosiCalendar;
  eligibleForDependentComponent?: boolean;

  constructor(sin: number, reqId: number, type: BilingualText, referenceNo: number, nin?: number) {
    this.sin = sin;
    this.benefitRequestId = reqId;
    this.benefitType = type;
    this.referenceNo = referenceNo > 0 ? referenceNo : null;
    this.nin = nin;
  }

  setBenefitStartDate(date: GosiCalendar) {
    this.benefitStartDate = date;
  }
}

export class ActiveSanedAppeal {
  appealDetails: AppealDetails;
  bankDetails?: PersonBankDetails;
  requestDate: GosiCalendar;
  benefitRequestId: number;
  referenceNo: number;

  constructor(
    appealDetails: AppealDetails,
    bankDetails: PersonBankDetails,
    benefitRequestId: number,
    requestDate: GosiCalendar,
    referenceNo: number
  ) {
    this.appealDetails = appealDetails;
    this.bankDetails = bankDetails;
    this.benefitRequestId = benefitRequestId;
    this.requestDate = requestDate;
    this.referenceNo = referenceNo;
  }
}

export class LateRequestedDetails {
  bypass: boolean;
  delayedMonths: number;
  reason: string;
}

export class AppealDetails {
  periodSelected?;
  eligiblePeriod: BilingualText;
  reasonForAppeal: BilingualText;
  otherReason?: string;
}
