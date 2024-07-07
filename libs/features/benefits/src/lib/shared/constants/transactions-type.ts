/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BenefitType } from '../enum';

export const TransactionType = {
  '302041': BenefitType.stopBenefitWaive,
  '302021': BenefitType.addModifyHeir,
  '302035': BenefitType.startBenefitWaive,
  '302036': BenefitType.stopBenefitWaive,
  '302005': BenefitType.earlyretirement
};
