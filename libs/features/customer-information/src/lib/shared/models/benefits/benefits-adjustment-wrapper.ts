/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BenefitsAdjustment } from './benefits-adjustment';
import { BilingualText } from '@gosi-ui/core';

export class BenefitsAdjustmentWrapper {
  benefitsAdjustment: BenefitsAdjustment[] = [];
  finalbenefitamount: number;
  totalAdjustmentAmount: number;
  adjustmentType: BilingualText;
}
