/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AdditionalContributionDetails } from './additional-contribution-details';
import { HeirBenefitDetails } from './heir-benefit-details';

export class ActiveBenefits {
  additionalContributionDetails: AdditionalContributionDetails;
  amount: number;
  benefitRequestId: number;
  benefitType: BilingualText;
  benefitStartDate: GosiCalendar;
  benefitReason: BilingualText;
  missingDate: GosiCalendar;
  missingDateStr: string;
  dependentAmount: number;
  deathDate: GosiCalendar;
  deathDateStr: string;
  contributorAmount: number;
  heirBenefitDetails: HeirBenefitDetails[];
  finalAverageWage: number;
  paidMonths: number;
  // unbornPersonId: number;
  // unbornMotherId: number;
  referenceNo: number;
  requestDate: GosiCalendar;
  startDate: GosiCalendar;
  status: BilingualText;
  sin: number;
  waiveStartDate: GosiCalendar;
  waiveStopDate: GosiCalendar;
  notes: string;
  beneficiaryBenefitStatus: BilingualText;

  constructor(sin: number, reqId: number, type: BilingualText, referenceNo: number) {
    this.sin = sin;
    this.benefitRequestId = reqId;
    this.benefitType = type;
    this.referenceNo = referenceNo;
  }

  setBenefitStartDate(date: GosiCalendar) {
    this.benefitStartDate = date;
  }
}
