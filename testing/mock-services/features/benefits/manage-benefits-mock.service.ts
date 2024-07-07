/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { of } from 'rxjs';
import { benefitHistory, uiBenefits } from 'testing/test-data';
export class ManageBenefitMockService {
  registrationNo = 1234;
  socialInsuranceNo = 1234;
  referenceNo = 1234;
  requestId = 1234;
  getAllBenefitHistory() {
    return of(benefitHistory);
  }
  getAnnuityBenefits() {
    return of(benefitHistory);
  }
  getAllUiHistory() {
    return of(benefitHistory);
  }
  setEligibleDependentAmount(val) {}
  getOccBenefits() {
    return of(benefitHistory);
  }
  setBenefitAppliedMessage(val) {}
  getAnnuityStatus() {
    return '';
  }
  setAnnuityStatus(val) {}
  getBenefitAppliedMessage() {
    return { english: '', arabic: '' };
  }
  getRegistrationNo() {
    return this.registrationNo;
  }
  getSocialInsuranceNo() {
    return this.socialInsuranceNo;
  }
  getSystemParams() {
    return of([{ name: 'RETIREMENT_AGE', value: 60 }]);
  }
  getSystemParam() {
    return {};
  }
  getPaymentDetails() {
    return of(uiBenefits);
  }
  getReferenceNo() {
    return this.referenceNo;
  }
  setReferenceNo(val) {
    this.referenceNo = val;
  }
  setIdForValidatorAction(id) {}
  getBenefitStatus() {
    return 'new';
  }
  setBenefitStatus(val) {}
  setBenType() {}
  getId() {
    return this.registrationNo;
  }
  updateAnnuityWorkflow() {
    return of({});
  }
  setPersonId() {}
  navigateToInbox() {}
  validatorDetails() {
    return of({});
  }
}
