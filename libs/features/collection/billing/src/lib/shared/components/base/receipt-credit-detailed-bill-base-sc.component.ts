/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import { BaseComponent, convertToYYYYMMDD, downloadFile, endOfMonth, LovList, AlertService } from '@gosi-ui/core';
import { noop, Observable, Observer } from 'rxjs';
import { BillDetails } from '../../models/bill-details';
import { CreditTransferWrapper } from '../../models/credit-tansfer-wrapper';
import { ItemizedRejectedOHWrapper } from '../../models/itemized-rejected-OH-wrapper';
import { DetailedBillService } from '../../services/detailed-bill.service';
import { ReportStatementService } from '../../services/report-statement.service';
import { LateFeeReversalDetails } from '../../models/late-fee-reversal-details';
import {
  ChangeEngagement,
  DetailedBillViolationDetails,
  FilterParams,
  ItemizedAdjustmentWrapper,
  ItemizedInstallmentWrapper,
  RequestList
} from '../../models';
import { ReportConstants } from '../../constants';
import { ViolationAdjustmentDetails } from '../../models/violation-adjustment-details';
import moment from 'moment';
import { LateFeeWaiveOff } from '../../models/late-fee-waiveoff';

@Directive()
export abstract class ReceiptCreditDetailedBillBaseScComponent extends BaseComponent {
  billDetails: BillDetails = new BillDetails();
  isAdmin = false;
  exchangeRate = 1;
  tabNames: string;
  selectedTabName: string;
  entityType: string;
  selectedUrlValue: string;
  creditRequired = true;
  receiptSortBy: string;
  sortOrder: string;
  languageType: string;
  receiptFileName: string;
  receiptType: string;
  searchKey: string;
  selectedDate: string;
  endDate: Date;
  startDate: Date;
  billIssueDate: string;
  gccCurrencyList: LovList;
  noOfDays: number;
  isGccCountry = false;
  pageNo = 0;
  pageSize = 10;
  periodDecreaseTotal = 0;
  wageDecreaseTotal = 0;
  coverageDecreaseTotal = 0;
  ohRateDecreaseTotal = 0;
  tabDetails;
  selectedUrl: string;
  gccCountryValue: string;
  idNumber: number;
  billStartDate: string;
  filterParams = new FilterParams();
  changeEngagement: ChangeEngagement = new ChangeEngagement();
  isCreditAdjustment = true;
  billNumber: number;
  isMofFlag = false;
  fromToIndicator = 'TO';
  toEntityTransfer = 'ESTABLISHMENT';
  lang = 'en';
  wageFlag = false;
  periodFlag = false;
  coverageFlag = false;
  ohRateFlag = false;
  lateFeeFlag = true;
  isBillNumber = false;
  isReceiptDetails = false;
  violationAdjustmentdet: ViolationAdjustmentDetails = new ViolationAdjustmentDetails();
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  creditTransferChange: CreditTransferWrapper = new CreditTransferWrapper();
  lateFeeWavierChange: LateFeeWaiveOff = new LateFeeWaiveOff();
  violationDetails: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  LateFeeReversaldet: LateFeeReversalDetails = new LateFeeReversalDetails();
  rejectedOHRecoveryDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  showGosiInitiative: boolean=false;
  showLateFeesWaiver: boolean=false;
  constructor(
    readonly alertService: AlertService,
    readonly detailedBillService: DetailedBillService,
    readonly reportStatementService: ReportStatementService
  ) {
    super();
  }
  /**
   * This method is to get installment details on selected date
   */
  getInstallmentDetails() {
    this.detailedBillService.getInstallmentDetails(this.idNumber, this.selectedDate).subscribe(
      responseData => {
        this.installmentDetails = responseData;
        if (this.installmentDetails) this.tabSetLists();
      },
      () => {
        this.tabSetLists();
      }
    );
  }
  /**
   * This method is to get installment details on selected date
   */
  getViolationDetails() {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(this.selectedDate)).toDate())));
    this.detailedBillService.getViolationDetails(this.idNumber, this.selectedDate, endDate, 0, this.pageSize).subscribe(
      data => {
        this.violationDetails = data;
        if (this.violationDetails) this.tabSetLists();
      },
      () => {
        this.tabSetLists();
      }
    );
  }
  /** This method to get tabset*/
  tabSetLists() {
    this.tabDetails = [];
    if (this.billDetails) {
      this.tabDetails.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.billDetails.totalContribution
      });

      this.tabDetails.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.billDetails.totalDebitAdjustment
      });

      this.tabDetails.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });
    }
    if (this.billDetails.totalLateFee > 0) {
      this.tabDetails.push({
        tabName: 'BILLING.LATE-PAYMENT-FEES',
        amount: this.billDetails.totalLateFee
      });
    }
    if (this.rejectedOHDetails.amount > 0) {
      this.tabDetails.push({
        tabName: 'BILLING.REJECTED-OH-CLAIMS',
        amount: this.rejectedOHDetails.amount
      });
    }
    if (this.installmentDetails.currentInstallmentAmount !== null) {
      this.tabDetails.push({
        tabName: 'BILLING.INSTALLMENT',
        amount: this.installmentDetails.currentInstallmentAmount
      });
    }
    if (this.violationDetails.totalViolationAmountAggregate > 0) {
      this.tabDetails.push({
        tabName: 'BILLING.VIOLATIONS',
        amount: this.violationDetails.totalViolationAmountAggregate
      });
    }
  }
  getItemizedLateFeeWavierDetails(idNumber: number, selectedDate: string) {
    this.detailedBillService.getLateFeeWavier(idNumber, selectedDate).subscribe(LateFeeWavierData => {
      this.lateFeeWavierChange = LateFeeWavierData;
      this.lateFeeWavierChange.waiveOffDetails.forEach(item =>{

        if(item !=null){
          if(item.type == "Gosi-Initiative"){
            this.showGosiInitiative=true;
          }
          else{
            this.showLateFeesWaiver=true;
          }

        }
      });
    }, noop);
  }
  /** Method to get Itemized Credit Refund Details.  */

  getItemizedCreditTransferDetails(idNumber: number, selectedDate: string) {
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
        this.creditTransferChange = value;
      }, noop);
  }
  getCreditTransferselectPageDetails(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getItemizedCreditTransferDetails(this.idNumber, this.selectedDate);
  }
  getLateFeeWavierselectPageDetails(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getItemizedLateFeeWavierDetails(this.idNumber, this.selectedDate);
  }
  getItemizedCreditAdjustmentDetails(
    type: string,
    filterSearchDetails?: RequestList
  ): Observable<ItemizedAdjustmentWrapper> {
    return new Observable((ob: Observer<ItemizedAdjustmentWrapper>): void => {
      this.detailedBillService
        .getItemizedDebitAdjustment(
          this.idNumber,
          this.billNumber,
          this.pageNo,
          this.pageSize,
          type,
          this.entityType,
          this.searchKey,
          filterSearchDetails
        )
        .subscribe((res: ItemizedAdjustmentWrapper) => {
          ob.next(res);
          ob.complete();
        }, noop);
    });
  }
  downloadReceiptDetailedBill(val) {
    if (val === 'PDF') {
      this.receiptFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.receiptType = 'application/pdf';
    } else {
      this.receiptFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.receiptType = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, val)
      .subscribe(data => {
        downloadFile(this.receiptFileName, this.receiptType, data);
      });
  }
  printReceiptDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  getviolationAdjustmentDetails(regNo) {
    const enddate = convertToYYYYMMDD(endOfMonth(new Date(this.selectedDate)).toString());
    this.reportStatementService
      .getViolationAdjustmentDetails(regNo, this.selectedDate, enddate, 'Decrease', this.pageNo, this.pageSize)
      .subscribe(res => {
        this.violationAdjustmentdet = res;
      });
  }
  getviolationAdjustmentselectPageDetails(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getviolationAdjustmentDetails(this.idNumber);
  }
  getRejectedOHRecoveryDet() {
    this.detailedBillService
      .getRejectedOHRecoveryDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
      .subscribe(response => {
        this.rejectedOHRecoveryDetails = response;
        if (this.rejectedOHRecoveryDetails) this.tabSetLists();
      });
  }
  /**
   * This method is to select the page number on pagination
   */
  getselectPage(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getRejectedOHRecoveryDet();
  }
}
