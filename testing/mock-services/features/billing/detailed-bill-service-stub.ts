import { of } from 'rxjs';
import {
  billDetails,
  billHistoryMockData,
  establishmentHeaderMockData,
  mofBillMockData,
  receiptListMockData,
  mofContributionMonthMockData,
  itemizedAdjustmentDetailsMockData,
  contributionDetailedBillMockDate,
  paymentDetailsMockData,
  allocationDetailsMockData,
  ItemizedAdjustmentDetails,
  itemizedRejectedOHMockData,
  changeEngagementDetails,
  itemizedInstallmentMockData,
  violationDetailedBillMockData
} from 'testing/test-data';

export class DetailedBillServiceStub {
  /**
   * Mock method for getting bill breakup
   *
   * @param registrationNumber
   * @param startDate
   * @param admin
   */
  getBillBreakup() {
    return of(billDetails);
  }

  /**
   * Mock method for getting bill Number
   *
   * @param registrationNumber
   * @param endDate
   * @param startDate
   * @param admin
   */
  getBillNumber() {
    return of(billHistoryMockData);
  }
  getBillOnMonthChanges() {
    return of(billHistoryMockData);
  }
  /**
   * Mock for billing header
   * @param idNumber
   * @param admin
   */
  getBillingHeader() {
    return of(establishmentHeaderMockData);
  }

  getReceipts() {
    return of(receiptListMockData);
  }

  getMofEstablishmentBill() {
    return of(mofBillMockData);
  }
  getItemizedLatefeesDetails() {
    return of(changeEngagementDetails);
  }

  /**
   * Mock for contribution month header
   * @param pageNo
   * @param pageSize
   * @param startDate
   */
  getMofContributionMonth() {
    return of(mofContributionMonthMockData);
  }
  getItemizedContribution() {
    return of(contributionDetailedBillMockDate);
  }

  getItemizedDebitAdjustment() {
    return of(itemizedAdjustmentDetailsMockData);
  }

  getVicReceiptList() {
    return of(receiptListMockData);
  }
  getVicReceiptDetList() {
    return of(paymentDetailsMockData);
  }
  getVicCreditDetails() {
    return of(allocationDetailsMockData);
  }
  getItemizedLateFee() {
    return of('');
  }
  getCreditAdjustment() {
    return of(ItemizedAdjustmentDetails);
  }
  getRejectedOHDetails() {
    return of(itemizedRejectedOHMockData);
  }
  getDebitAdjustment() {
    return of(itemizedRejectedOHMockData);
  }
  getInstallmentDetails() {
    return of(itemizedInstallmentMockData);
  }
  getCreditTransferDetails() {
    return of('');
  }
  getLateFeeWavier() {
    return of('');
  }
  getViolationDetails() {
    return of(violationDetailedBillMockData);
  }
  getRejectedOHRecoveryDetails() {
    return of(contributionDetailedBillMockDate);
  }
}
