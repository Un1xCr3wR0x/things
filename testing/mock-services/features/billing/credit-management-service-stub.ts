import { of } from 'rxjs';
import {
  BackdatedTerminationTransactionDetailsMockData,
  CreditBalanceDetailsMockData,
  creditRefundRequestDetailsMockData,
  creditRequestDetailsMockData,
  vicContributorDetailsMockData,
  vicCreditRefundIbanMockData
} from 'testing/test-data';

export class CreditManagementServiceServiceStub {
  /**
   * Mock method for getting bill breakup
   *
   * @param registrationNumber
   * @param startDate
   * @param admin
   */
  getAvailableCreditBalance() {
    return of(CreditBalanceDetailsMockData);
  }

  submitCreditMangmentDetails() {
    return of(creditRequestDetailsMockData);
  }
  submitCreditRefundDetails() {
    return of(creditRefundRequestDetailsMockData);
  }
  submitVicCreditRefundDetails() {
    return of(creditRefundRequestDetailsMockData);
  }
  revertVicRefundDocumentDetails() {
    return of('');
  }
  updateCreditMangmentDetails() {
    return of(creditRequestDetailsMockData);
  }
  updateVicCreditRefundDetails() {
    return of(creditRefundRequestDetailsMockData);
  }
  updateContributorRefundDetails() {
    return of('');
  }
  updateCreditRefundDetails() {
    return of(creditRefundRequestDetailsMockData);
  }
  getContirbutorDetails() {
    return of(vicContributorDetailsMockData);
  }

  getVicCreditRefundAmountDetails() {
    return of(creditRefundRequestDetailsMockData);
  }
  getContirbutorAccountDetails() {
    return of(CreditBalanceDetailsMockData);
  }
  getContirbutorIbanDetails() {
    return of(vicCreditRefundIbanMockData);
  }
  getVicContirbutorIbanDetails() {
    return of(vicCreditRefundIbanMockData);
  }
  getContirbutorRefundDetails() {
    return of(CreditBalanceDetailsMockData);
  }
  getAllCreditBalanceDetails() {
    return of(CreditBalanceDetailsMockData);
  }
  getRefundDetails() {
    return of(creditRefundRequestDetailsMockData);
  }
  setPenalityWaiverReason() {
    return of('');
  }
  revertDocumentDetails() {
    return of('');
  }
  revertContributorRefundDocumentDetails() {
    return of('');
  }
  submitAfterEdit() {
    return of('');
  }
  revertRefundDocumentDetails() {
    return of('');
  }
  getBackdatedTeminationTransactionsDetails() {
    return of(BackdatedTerminationTransactionDetailsMockData);
  }
  searchContributor() {
    return of('');
  }
  setSelectedTerminationPeriod() {}
  getSelectedTerminationPeriod() {
    return of('');
  }
  submitContributorRefundDetails() {
    return of('');
  }
  getBackdatedTerminationDetails() {
    return of(BackdatedTerminationTransactionDetailsMockData);
  }
}
