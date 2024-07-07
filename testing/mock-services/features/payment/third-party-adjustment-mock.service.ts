/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdjustmentDetails, BeneficiaryList, MonthlyDeductionEligibility } from '@gosi-ui/features/payment/lib/shared';
import { of } from 'rxjs';

export class ThirdPartyAdjustmentMockService {
  getBeneficiaryDetails() {
    return of();
  }
  getAdjustmentMonthlyDeductionEligibilty() {
    return of(new MonthlyDeductionEligibility());
  }
  saveValidatorAdjustmentEdit() {
    return of();
  }
  getThirdPartyAdjustmentValidatorDetails() {
    return of(new AdjustmentDetails());
  }
}
