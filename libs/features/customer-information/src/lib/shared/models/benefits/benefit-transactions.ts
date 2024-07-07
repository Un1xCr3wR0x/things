/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  BorderNumber,
  CommonIdentity,
  GosiCalendar,
  Iqama,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { ContributorDetails } from './contributor-details';

export class BenefitTransactions {
  contributor: ContributorDetails;
  contributorName: BilingualText;
  contributorIdentifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  identifier: CommonIdentity | null;
  sin: number;
  referenceNo: number;
  requestDate: GosiCalendar;
  benefitType: BilingualText;
  amount: number;
  adjustments: number;
  reasonForHold: BilingualText;
  benefitStatus: BilingualText;
  benefitRequestId: number;
  isLumpsum?: boolean;
  isAdjustmentCredit?: boolean;
}
