/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitValues } from '../enum';

export class HeirDebitDetails {
  deductionPercentage: string;
  personId: number = undefined;

  constructor() {
    this.deductionPercentage = BenefitValues.plan25;
  }
}
