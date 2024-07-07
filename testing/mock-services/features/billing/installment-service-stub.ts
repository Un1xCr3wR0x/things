import { of } from 'rxjs';
import { installmentDeatilsMockData } from 'testing/test-data/features/billing/installment-details-mock-data';
import {
  installmentValidatorViewDeatilsMockData,
  paymentResponseMockData,
  installmentSummaryMockData,
  activeInstallment
} from 'testing';

export class InstallmentStub {
  getInstallmentDetails() {
    return of(installmentDeatilsMockData);
  }
  getValidatorInstallmentDetails() {
    return of(installmentValidatorViewDeatilsMockData);
  }
  submitInstallmentDetails() {
    return of(paymentResponseMockData);
  }
  updateInstallmentDetails() {
    return of('');
  }
  getInstallmentactive() {
    return of(activeInstallment);
  }
  getInstallmentDetailsById() {
    return of(installmentSummaryMockData);
  }
}
