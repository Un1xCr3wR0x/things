import { of } from 'rxjs';
import {
  accountSummaryData,
  billDetails,
  billHistoryMockData,
  establishmentHeaderMockData,
  itemizedBillMockData,
  mofBillMockData,
  receiptListMockData,
  mofContributionMonthMockData,
  itemizedAdjustmentDetailsMockData,
  contributionDetailedBillMockDate,
  itemizedReceiptListMockData,
  allocationDetailsMockData,
  cotributorAllocationMockData,
  billhistoryFilterMockData,
  cotributorAllocationDetailsMockData,
  establishmentAllocationDetailsMockData,
  billAllocationMofMock,
  getBillHistoryVicSearchFilterMockData,
  changeEngagementDetails
} from 'testing/test-data';

export class BillDashboardServiceStub {
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
   * Mock method for getting bill history
   *
   * @param registrationNumber
   * @param endDate
   * @param startDate
   * @param admin
   */
  getBillHistory() {
    return of(billHistoryMockData);
  }

  /**
   * Mock method for getting mof bill history
   *
   * @param registrationNumber
   * @param endDate
   * @param startDate
   * @param admin
   */
  getBillHistoryMof() {
    return of(billHistoryMockData);
  }
  /**
   * Mock method for getting mof bill history
   *
   * @param registrationNumber
   * @param endDate
   * @param startDate
   * @param admin
   */
  getBillHistoryMofSearchFilter() {
    return of(billHistoryMockData);
  }
  /**
   * Mock method for getting vic bill history
   *
   * @param registrationNumber
   * @param endDate
   * @param startDate
   * @param admin
   */
  getBillHistoryVic() {
    return of(billHistoryMockData);
  }
  /**
   * Mock method for getting bill history
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
   * Mock method for itemized bill
   * @param registrationNumber
   * @param startDate,
   * @param admin
   */
  getItemizedBillBreakup() {
    return of(itemizedBillMockData);
  }
  /**
   * Mock method for MOF Allocation
   * @param registrationNumber
   * @param startDate,
   * @param admin
   */
  getMofAllocationDetails() {
    return of(billAllocationMofMock);
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

  getAccountSummary() {
    return of(accountSummaryData);
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

  getItemizedCreditAdjustment() {
    return of(itemizedAdjustmentDetailsMockData);
  }
  getItemizedDebitAdjustment() {
    return of(itemizedAdjustmentDetailsMockData);
  }
  addContributionDetails() {
    return of(contributionDetailedBillMockDate);
  }
  contributionDetailedValue() {
    return of(contributionDetailedBillMockDate);
  }
  getReceipDetails() {
    return of(itemizedReceiptListMockData);
  }
  getAllocationDetails() {
    return of(allocationDetailsMockData);
  }
  getVicReceiptList() {
    return of(itemizedReceiptListMockData);
  }
  /**
   * This method is to get contributor credit allocation details
   * @param billNo
   * @param pageNo
   * @param pageSize
   * @param regNo
   */

  getAllocationCredit() {
    return of(cotributorAllocationMockData);
  }

  /**
   * This method is to get contributor credit allocation details
   * @param billNo
   * @param registrationNumber
   * @param sin
   */
  getIndividualcontributorAllocationDetails() {
    return of(cotributorAllocationDetailsMockData);
  }
  getBillHistorySearch() {
    return of(billhistoryFilterMockData);
  }
  getMofEstablishmentAllocationDetails() {
    return of(establishmentAllocationDetailsMockData);
  }
  getVicBillBreakup() {
    return of(billDetails);
  }
  getBillHistoryVicSearchFilter() {
    return of(getBillHistoryVicSearchFilterMockData);
  }
}
