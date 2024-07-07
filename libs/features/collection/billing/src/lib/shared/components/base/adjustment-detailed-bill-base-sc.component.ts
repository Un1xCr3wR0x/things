/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, convertToYYYYMMDD, endOfMonth } from '@gosi-ui/core';
import moment from 'moment';
import { Observable, Observer } from 'rxjs';
import { noop } from 'rxjs/internal/util/noop';
import { BillingConstants } from '../../constants/billing-constants';
import {
  BillDetails,
  ChangeEngagement,
  DetailedBillViolationDetails,
  ItemizedCreditRefund,
  ItemizedInstallmentWrapper,
  ItemizedRejectedOHWrapper,
  RequestList
} from '../../models';
import { CreditTransferWrapper } from '../../models/credit-tansfer-wrapper';
import { ViolationAdjustmentDetails } from '../../models/violation-adjustment-details';
import { DetailedBillService, ReportStatementService } from '../../services';

@Directive()
export abstract class AdjutmentDetailedBillBaseScComponent extends BaseComponent {
  constructor(
    readonly detailedBillService: DetailedBillService,
    readonly router: Router,
    readonly reportStatementService: ReportStatementService
  ) {
    super();
  }
  // Local Variables
  isAdmin = false;
  exchangeRate = 1;
  noOfDays: number;
  wageChangeTotal = 0;
  backdatedCovergeAdditionTotal = 0;
  regChangeTotal = 0;
  reactivateRegChangeTotal = 0;
  ohRateTotal = 0;
  periodChangeTotal = 0;
  lateFeeFlag = false;
  fileName: string;
  type: string;

  creditRefundChange: ItemizedCreditRefund;
  creditTransferChange: CreditTransferWrapper;
  violationDetail: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  initialStartDate: string;
  billStartDate: string;
  filterSearchDetails?: RequestList;
  pageSize = 10;
  billNumber: number;
  billDetails: BillDetails = new BillDetails();
  tabNameDetails: string;
  selectedCountry: string;
  isInitialStatus = false;
  currentCurrency: string;
  adjustUrl: string;
  isMofFlag = false;
  isGccCountry = false;
  selectedDate: string;
  billIssueDate: string;
  pageNo = 0;
  entityType: string;
  selectedUrl: string;
  creditRequired = false;
  sortOrder = 'ASC';
  debitSortBy: string;
  idValue: string;
  name: string;
  searchKey: string;
  regNo: number;
  fromTOIndicator: string;
  startDate: string;
  regFlag = false;
  reactivateFlag = false;
  increaseFlag = false;
  wageIncreaseFlag = false;
  coverageFlag = false;
  ohFlag = false;
  lang = 'en';
  languageType: string;
  isBillNumber = false;
  tabDetails;
  adjustmentBillDetails: BillDetails = new BillDetails();
  rejectedOHDetail: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  fromToIndicator = 'FROM';
  toEntityTransfer = 'ESTABLISHMENT';
  idNumber: number;
  changeEngagement: ChangeEngagement = new ChangeEngagement();
  isCreditAdjustment = false;
  violationAdjustmentdet: ViolationAdjustmentDetails = new ViolationAdjustmentDetails();

  /** Method to get Itemized Credit Refund Details. */

  getItemizedCreditRefundDetails(
    idNumber: number,
    selectedDate: string,
    toEntity: string
  ): Observable<ItemizedCreditRefund> {
    return new Observable((ob: Observer<ItemizedCreditRefund>): void => {
      this.detailedBillService
        .getItemizedCreditRefundDetails(idNumber, this.pageNo, this.pageSize, selectedDate, toEntity)
        .subscribe((value: ItemizedCreditRefund) => {
          ob.next(value);
          ob.complete();
        }, noop);
    });
  }
  /** Method to get Itemized Credit Refund Details.  */

  getItemizedCreditTransferDetails(idNumber: number, selectedDate: string): Observable<CreditTransferWrapper> {
    return new Observable((ob: Observer<CreditTransferWrapper>): void => {
      this.detailedBillService
        .getCreditTransferDetails(
          this.fromToIndicator,
          this.pageNo,
          this.pageSize,
          selectedDate,
          idNumber,
          this.toEntityTransfer
        )
        .subscribe((value: CreditTransferWrapper) => {
          ob.next(value);
          ob.complete();
        }, noop);
    });
  }

  /** Method is used fetch details based on selected page */
  getselectPageDetail(selectedpageNo: number, idNumber: number, date: string, toEntity: string) {
    this.filterSearchDetails.page.pageNo = selectedpageNo;
    this.getItemizedCreditRefundSelectedPage(idNumber, this.filterSearchDetails.page.pageNo, date, toEntity);
  }

  /** Method is used fetch itemized adjustment details based on selected page */
  getItemizedCreditRefundSelectedPage(idNumber: number, pageNo: number, startDate: string, toEntity: string) {
    this.detailedBillService
      .getItemizedCreditRefundDetails(idNumber, pageNo, this.pageSize, startDate, toEntity)
      .subscribe((res: ItemizedCreditRefund) => {
        this.creditRefundChange = res;
      }, noop);
  }
  /**
   * This method is to get installment details on selected date
   */
  getInstallmentDetails() {
    this.detailedBillService.getInstallmentDetails(this.idNumber, this.selectedDate).subscribe(
      responseData => {
        this.installmentDetails = responseData;
        if (this.installmentDetails) this.getItemizedTabsetDetails();
      },
      () => {
        this.getItemizedTabsetDetails();
      }
    );
  }
  /**
   * This method is to get installment details on selected date
   */
  getViolationDetails() {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(this.selectedDate)).toDate())));
    this.detailedBillService.getViolationDetails(this.idNumber, this.selectedDate, endDate, 0, this.pageSize).subscribe(
      responseData => {
        this.violationDetail = responseData;
        if (this.violationDetail) this.getItemizedTabsetDetails();
      },
      () => {
        this.getItemizedTabsetDetails();
      }
    );
  }
  /*** This method to get tabset
   * @param billDetails */
  getItemizedTabsetDetails() {
    this.tabDetails = [];
    if (this.adjustmentBillDetails) {
      this.tabDetails.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.adjustmentBillDetails.totalContribution
      });

      this.tabDetails.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.adjustmentBillDetails.totalDebitAdjustment
      });

      this.tabDetails.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });

      if (this.adjustmentBillDetails.totalLateFee > 0) {
        this.tabDetails.push({
          tabName: 'BILLING.LATE-PAYMENT-FEES',
          amount: this.adjustmentBillDetails.totalLateFee
        });
      }
      if (this.rejectedOHDetail.amount > 0) {
        this.tabDetails.push({
          tabName: 'BILLING.REJECTED-OH-CLAIMS',
          amount: this.rejectedOHDetail.amount
        });
      }
      if (this.installmentDetails.currentInstallmentAmount !== null) {
        this.tabDetails.push({
          tabName: 'BILLING.INSTALLMENT',
          amount: this.installmentDetails.currentInstallmentAmount
        });
      }
      if (this.violationDetail.totalViolationAmountAggregate > 0) {
        this.tabDetails.push({
          tabName: 'BILLING.VIOLATIONS',
          amount: this.violationDetail.totalViolationAmountAggregate
        });
      }
    }
  }
  /** * This method is to navigate to new tab */
  goToNewTab(selectedTab: string) {
    if (selectedTab === 'BILLING.CONTRIBUTION' || selectedTab === 'BILLING.CURRENT-MONTH-CONTRIBUTION')
      this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    if (selectedTab === 'BILLING.RECEIPTS-AND-CREDITS' || selectedTab === 'BILLING.CREDIT-ADJUSTMENTS')
      this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (selectedTab === 'BILLING.DEBIT-ADJUSTMENTS')
      this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    if (selectedTab === 'BILLING.LATE-PAYMENT-FEES') this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    if (selectedTab === 'BILLING.VIOLATIONS') this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
    if (selectedTab === 'BILLING.INSTALLMENT') {
      this.adjustUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    this.router.navigate([this.adjustUrl], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDate),
        billNumber: this.billNumber,
        mofFlag: this.isMofFlag,
        registerNo: this.idNumber,
        billStartDate: this.initialStartDate
      }
    });
  }
  getviolationAdjustmentDetails(regNo) {
    const enddate = convertToYYYYMMDD(endOfMonth(new Date(this.selectedDate)).toString());
    this.reportStatementService
      .getViolationAdjustmentDetails(regNo, this.selectedDate, enddate, 'Increase', this.pageNo, this.pageSize)
      .subscribe(res => {
        this.violationAdjustmentdet = res;
      });
  }

  getviolationAdjustmentselectPageDetails(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getviolationAdjustmentDetails(this.idNumber);
  }

  printAdjustmentDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
