
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BenefitType } from '../enum/benefit-type';

export const isEligibleForPensionReform = function(
  benefitType: string,
  isLumpsum = false,
  eligibleForPensionReform = false
){
    return eligibleForPensionReform && benefitType !== BenefitType.occLumpsum ? true : false
}
