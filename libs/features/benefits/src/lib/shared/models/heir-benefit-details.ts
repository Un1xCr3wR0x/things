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
import { AdjustmentCalculationDetails } from './adjustment-calculation-details';
export interface HeirBenefitDetails {
  adjustmentCalculationDetails?: AdjustmentCalculationDetails;
  benefitAmount: number;
  identifier: number;
  identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber>;
  identifierStr?: string;
  heirIdentifier: CommonIdentity;
  name: BilingualText;
  payeeType: BilingualText;
  paymentMode: BilingualText;
  relationship: BilingualText;
  lastPaidDate: GosiCalendar;
  status: BilingualText;
  amountBeforeUpdate: number;
  adjustmentAmount?: number;
  marriageGrant: number;
  deathGrant?: number;
  personId: number;
  benefitAmountAfterDeduction?: number;
  sin?: number;
  //for UI
  hasCreditAdjustment: boolean;
}
