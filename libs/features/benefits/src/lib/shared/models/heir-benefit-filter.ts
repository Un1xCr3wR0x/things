/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class HeirBenefitFilter {
  benefitStatus: BilingualText[] = [];
  informationType: BilingualText[] = [];
  personIds: number[] = [];
  benefitPeriodFrom: Date = undefined;
  benefitPeriodTo: Date = undefined;
}
