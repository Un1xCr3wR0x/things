/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { BenefitSubCalculationGuide } from './benefit-subcalculation-guide';

export interface BenefitCalculationGuide {
  calculationType: BilingualText;
  subCalculations: BenefitSubCalculationGuide[];
}
