/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { of } from 'rxjs';
import { uiHistory, benefitHistory, benefitRequestResposeMockData, lovMockData } from 'testing/test-data';
import { WizardItem } from '@gosi-ui/core';
import { BenefitDetails, UnemploymentResponseDto } from 'libs/features/benefits/src/lib/shared';
export class SanedBenefitMockService {
  getActiveAnnuityBenefits() {
    return of(benefitHistory);
  }
  getActiveUiBenefits() {
    return of(uiHistory);
  }
  patchBenefit() {
    return of(benefitRequestResposeMockData);
  }
  applySanedBenefit() {
    return of(benefitRequestResposeMockData);
  }
  updateBenefit() {
    return of(benefitRequestResposeMockData);
  }
  getSanedWizardItems() {
    return [new WizardItem('', '', true)];
  }
  getSanedRejectReasonList() {
    return of(lovMockData);
  }
  getSanedReturnReasonList() {
    return of(lovMockData);
  }
  getSanedRejectReasonValidator() {
    return of(lovMockData);
  }
  getBenefitCalculationsForSaned() {
    return of({ ...new BenefitDetails(), isReopen: false });
  }
  getBenefitRequestDetails() {
    return of({ ...new UnemploymentResponseDto(), personId: 1234 });
  }
  revertBenefit() {
    return of(benefitRequestResposeMockData);
  }
  getRejectReasonValidator() {
    return of(null);
  }
}
