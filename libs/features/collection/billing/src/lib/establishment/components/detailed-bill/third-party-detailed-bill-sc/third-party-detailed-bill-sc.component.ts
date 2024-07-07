/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  BillDetails,
  ItemizedContributionMonthWrapper,
  ItemizedReceiptWrapper,
  FilterParams
} from '../../../../shared/models';
import { Component, OnInit, Inject } from '@angular/core';
import {
  convertToYYYYMMDD,
  startOfMonth,
  BilingualText,
  StorageService,
  LovList,
  endOfMonth,
  LookupService,
  LanguageToken,
  downloadFile
} from '@gosi-ui/core';
import {
  BillDashboardService,
  BillingRoutingService,
  ContributionPaymentService,
  DetailedBillService,
  ReportStatementService
} from '../../../../shared/services';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, noop } from 'rxjs';
import { MofContributionRequestList } from '../../../../shared/models/mof-contribution-request-list';
import { MofItemizedContributionFilter } from '../../../../shared/models/mof-itemized-contribution-filter';
import { ItemizedBillCreditAdjustmentWrapper } from '../../../../shared/models/itemized-bill-credit-adjustment-wrapper';
import { LanguageTypeEnum } from '../../../../shared/enums';

@Component({
  selector: 'blg-third-detailed-party-bill-sc',
  templateUrl: './third-party-detailed-bill-sc.component.html',
  styleUrls: ['./third-party-detailed-bill-sc.component.scss']
})
export class ThirdPartyDetailedBillScComponent implements OnInit {
  /** Local Variables */
  filterRequest: MofItemizedContributionFilter;
  sortBy = 'ESTABLISHMENT_NAME_ENG';
  sortOrder = 'ASC';
  filterParams: FilterParams;
  lang = 'en';
  languageType: string;
  enitytType = 'THIRD_PARTY';
  exchangeRate = 1;
  billDetails: BillDetails = new BillDetails();
  mofEstablishmentBill: BillDetails = new BillDetails();
  accountDetails;
  itemizedContributionMonth: ItemizedContributionMonthWrapper = new ItemizedContributionMonthWrapper();
  debitAdjustmentDetails: ItemizedBillCreditAdjustmentWrapper = new ItemizedBillCreditAdjustmentWrapper();
  creditAdjustmentDetails: ItemizedBillCreditAdjustmentWrapper = new ItemizedBillCreditAdjustmentWrapper();
  currencyType: BilingualText = BillingConstants.CURRENCY_SAR;
  isAdmin = false;
  isGccCountry = false;
  isMofFlag = true;
  billDate: string;
  billNumber: number;
  itemizedDataFlag = false; //Note: Review to remove
  noOfDays: number;
  pageNo = 0;
  pageSize = 10;
  selectedDate: string;
  filterSortValues: MofContributionRequestList;
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  selectedTab = 'BILLING.CONTRIBUTION';
  dateSelected: string;
  billIssueDate: string;
  tabList = ['BILLING.CONTRIBUTION', 'BILLING.DEBIT-ADJUSTMENT', 'BILLING.RECEIPTS-AND-CREDITS'];
  search: string;
  isDisable = false;

  /**********Receipt and Credite Variables ******/
  ReceiptDetails: ItemizedReceiptWrapper = new ItemizedReceiptWrapper();
  endDate: Date;
  startDate: Date;
  receiptSort$: Observable<LovList>;
  paymentReceiptFilterParams: FilterParams = new FilterParams();
  paymentReceiptPageNo = 0;
  paymentReceiptPageSize = 10;
  receiptSortBy: string;
  paymentReceiptSortOrder: string;
  errorMessage: BilingualText = new BilingualText();
  isBillNumber = false;
  initialStartDate: string;
  billStartDate: string;
  regNo: number;
  // Observables
  mofContributionSort$: Observable<LovList>;
  yesOrNoList$: Observable<LovList>;
  establishmentType: string;

  constructor(
    readonly detailedBillService: DetailedBillService,
    readonly billingRoutingService: BillingRoutingService,
    readonly reportStatementService: ReportStatementService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly lookUpService: LookupService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly billDashboardService: BillDashboardService,
    readonly contributionPaymentService: ContributionPaymentService
  ) {}

  /**
   * This method handles initialization tasks.
   *
   * @memberof MofScComponent
   */
  /********************************Lifecycle Hooks****************************************** */
  ngOnInit() {
    this.receiptSort$ = this.lookUpService.getReceiptSortFields();
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params.monthSelected;
      this.endDate = endOfMonth(moment(new Date(this.selectedDate)).toDate());
      this.startDate = startOfMonth(moment(new Date(this.selectedDate)).toDate());
      this.billNumber = params.billNumber;
      this.initialStartDate = params.initialStartDate;
      this.billStartDate = params.billStartDate;
      this.establishmentType = params.establishmentType;
      
    }, noop);
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    if (this.lookUpService.getMofContributionSortList !== undefined) {
      this.mofContributionSort$ = this.lookUpService.getMofContributionSortList();
    }
    this.yesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.getMofEstablishmentBillService();

    this.getMofContributionMonthService(this.sortOrder, this.sortBy, this.filterRequest);
    this.getCreditAdjustmentDetails();
    this.getdebitAdjustmentDetails();
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  }

  /***********************************Service Call Methods****************************************** */
  /**
   * This method is to get mof establishment bill details
   */
  getMofEstablishmentBillService() {
    this.detailedBillService.getMofEstablishmentBill(this.selectedDate, this.establishmentType).subscribe(
      res => {
        this.mofEstablishmentBill = res;
        // this.initialStartDate = convertToYYYYMMDD(startOfMonth(moment(this.mofEstablishmentBill?.billStartDate?.gregorian).toDate()).toString());
        if (this.mofEstablishmentBill.billBreakUp !== undefined) {
          this.accountDetails = this.mofEstablishmentBill.billBreakUp.accountBreakUp.accountDetails;
        }
        this.isMofFlag = true;
        this.isAdmin = true;
        this.isBillNumber = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isBillNumber = true;
        if (this.errorMessage.english === BillingConstants.ERROR_MESSAGE) {
          this.isDisable = true;
        }
      }
    );
  }

  /**
   * This method is to get mof contribution month
   */
  getMofContributionMonthService(sortOrder?, sortBy?, filtertValues?) {
    this.detailedBillService
      .getMofContributionMonth(
        this.selectedDate,
        this.pageNo,
        this.pageSize,
        this.establishmentType,
        sortOrder,
        sortBy,
        this.search,
        filtertValues
      )
      .subscribe(res => {
        this.itemizedContributionMonth = res;
        this.isMofFlag = true;
      }, noop);
  }

  /**
   * This method is to get date to set max and min date
   */
  getDate(dateValue: string) {
    this.selectedDate = convertToYYYYMMDD(startOfMonth(moment(new Date(dateValue)).toDate()).toString());
    this.endDate = endOfMonth(moment(new Date(this.selectedDate)).toDate());
    this.startDate = startOfMonth(moment(new Date(dateValue)).toDate());
    this.getReceiptCreditDetails(this.startDate, this.endDate);
    this.billDate = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    if (this.billDate) {
      this.detailedBillService.getMofEstablishmentBill(this.billDate,this.establishmentType).subscribe(
        (res: BillDetails) => {
          this.mofEstablishmentBill = res;
          if (this.mofEstablishmentBill.billBreakUp !== undefined) {
            this.accountDetails = this.mofEstablishmentBill.billBreakUp.accountBreakUp.accountDetails;
          }
          this.itemizedDataFlag = true;
          this.isAdmin = true;
          this.isBillNumber = false;
          if (!this.isBillNumber) {
            this.detailedBillService
              .getMofContributionMonth(this.billDate, this.pageNo, this.pageSize, this.establishmentType, this.sortOrder, this.sortBy)
              .subscribe(resp => {
                this.itemizedContributionMonth = resp;
                this.isMofFlag = true;
              }, noop);
          }
        },
        err => {
          this.errorMessage = err.error.message;
          this.isBillNumber = true;
        }
      );
    }
    this.getCreditAdjustmentDetails();
    this.getdebitAdjustmentDetails();
  }

  /** Method is used to fetchreceipt details */
  getReceiptCreditDetails(startDate: Date, endDate: Date) {
    this.paymentReceiptFilterParams.receiptFilter.endDate.gregorian = endDate;
    this.paymentReceiptFilterParams.receiptFilter.startDate.gregorian = startDate;
    this.detailedBillService
      .getReceipts(
        1,
        this.paymentReceiptFilterParams,
        this.enitytType,
        this.pageNo,
        this.pageSize,
        true,
        this.receiptSortBy,
        this.paymentReceiptSortOrder,
        this.establishmentType,
      )
      .subscribe((responseData: ItemizedReceiptWrapper) => {
        this.ReceiptDetails = responseData;
      }, noop);
  }
  //Method to get credit adjustment details
  getCreditAdjustmentDetails() {
    this.detailedBillService
      .getCreditAdjustment(this.establishmentType,1, convertToYYYYMMDD(String(this.selectedDate)), this.pageNo, this.pageSize)
      .subscribe((responseData: ItemizedBillCreditAdjustmentWrapper) => {
        this.creditAdjustmentDetails = responseData;
      }, noop);
  }

  getPaymentReceiptDetails(sortby, sortOrder) {
    this.detailedBillService
      .getReceipts(1, this.filterParams, this.enitytType, this.pageNo, this.pageSize, true, sortby, sortOrder,this.establishmentType)
      .subscribe(data => {
        this.ReceiptDetails = data;
      }, noop);
  }

  /**
   *This method is to emit  registrationNumber
   */
  getRegistrationNo(registerNo: number, path) {
    this.regNo = registerNo;
     this.detailedBillService.getBillNumber(registerNo, this.selectedDate).subscribe(res => {
      this.billNumber = res.bills[0].billNumber;
       this.router.navigate([BillingConstants.ROUTE_DASHBOARD_BILL], {
         queryParams: {
           monthSelected: convertToYYYYMMDD(this.selectedDate),
           // billIssueDate: convertToYYYYMMDD(
           //   moment(this.mofEstablishmentBill.initialBillStartDate.gregorian).toDate().toString()
           // ),
           billNumber: this.billNumber,
           isSearch: false,
           //mofFlag: true,
       
           billStartDate: convertToYYYYMMDD(
             moment(this.mofEstablishmentBill.billStartDate.gregorian).toDate().toString()
           ),
           registerNo: this.regNo
         },
         
    
        
      });
      
      }, noop);

  }
  /***********************************Service Call Methods Ends****************************************** */

  /**************************************Methods******************************************************* */
  /**
   * This method is to call service for Bill Summary
   */
  getMofDashboardBillDetails() {
    this.billingRoutingService.navigateToMofDashboardBills(this.selectedDate, this.establishmentType);
    //this.router.navigate([BillingConstants.ROUTE_DASHBOARD_MOF]);
    //this.getMofEstablishmentBillService();
  }
  /**
   * This method is to select the page number on pagination
   */
  getselectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getMofContributionMonthService(this.sortOrder, this.sortBy, this.filterRequest);
  }

  //This method is to set current tab on tabset selection
  goToNewTab(selectedTab: string) {
    this.selectedTab = selectedTab;
    // if (this.selectedTab === 'BILLING.RECEIPTS-AND-CREDITS') {
    //   this.getReceiptCreditDetails(this.startDate, this.endDate);
    //   this.getCreditAdjustmentDetails();
    // } else if (this.selectedTab === 'BILLING.DEBIT-ADJUSTMENT') {
    //   this.getdebitAdjustmentDetails();
    // }
  }
  /**
   * Method to get debit adjustment details
   */
  getdebitAdjustmentDetails() {
    this.detailedBillService
      .getDebitAdjustment(this.establishmentType,convertToYYYYMMDD(String(this.selectedDate)), this.pageNo, this.pageSize)
      .subscribe((responseData: ItemizedBillCreditAdjustmentWrapper) => {
        this.debitAdjustmentDetails = responseData;
      }, noop);
  }
  /** Method is used fetch details based on selected page for receipt details*/
  getReceiptSelectPageNo(newPage: number) {
    this.pageNo = newPage;
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  }
  downloadThirdPartyTransaction() {
    this.reportStatementService
      .generatePaymentsReport(this.regNo, this.billNumber, this.isMofFlag, this.languageType)
      .subscribe(data => {
        downloadFile(
          this.languageType === 'ENGLISH'
            ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
            : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR,
          'application/pdf',
          data
        );
      });
  }
  printThirdPartyTransaction() {
    this.reportStatementService
      .generatePaymentsReport(Number(this.regNo), Number(this.billNumber), this.isMofFlag, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  /** Method is used fetch details based on selected page for credit adjustment details*/
  getCreditAdjustmentSelectPageNo(newPage: number) {
    this.pageNo = newPage;
    this.getCreditAdjustmentDetails();
  }
  getDebitAdjustmentSelectPageNo(newPage: number) {
    this.pageNo = newPage;
    this.getdebitAdjustmentDetails();
  }
  // Method to sort payment receipt table
  getReceiptSortList(sortList) {
    this.receiptSortBy = sortList.sortBy;
    this.paymentReceiptSortOrder = sortList.sortOrder;
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  }
  // Method to filter payment receipt table
  getPaymentReceiptList(filterParams?) {
    if (filterParams?.isSearch) {
      this.paymentReceiptFilterParams.parentReceiptNo = filterParams.filterParams.parentReceiptNo;
      this.pageNo = 0;
    } else if (filterParams?.isfilter) {
      this.paymentReceiptFilterParams.receiptFilter.receiptDate.endDate =
        filterParams.filterParams.receiptFilter.receiptDate.endDate;
      this.paymentReceiptFilterParams.receiptFilter.receiptDate.startDate =
        filterParams.filterParams.receiptFilter.receiptDate.startDate;
      this.paymentReceiptFilterParams.receiptFilter.maxAmount = filterParams.filterParams.receiptFilter.maxAmount;
      this.paymentReceiptFilterParams.receiptFilter.minAmount = filterParams.filterParams.receiptFilter.minAmount;
      this.pageNo = 0;
    }
    if (!filterParams) {
      this.paymentReceiptFilterParams.receiptFilter.receiptDate.endDate = null;
      this.paymentReceiptFilterParams.receiptFilter.receiptDate.startDate = null;
      this.paymentReceiptFilterParams.receiptFilter.maxAmount = null;
      this.paymentReceiptFilterParams.receiptFilter.minAmount = null;
    }
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  }

  // Method is used to sort values based on sorting conditions
  getSortValuesForMofContribution(sortValues) {
    this.sortOrder = sortValues.sortOrder;
    this.sortBy = sortValues.sortBy;
    if (sortValues.sortBy.value.english === 'Establishment Name') {
      if (this.lang === 'en') {
        this.sortBy = 'ESTABLISHMENT_NAME_ENG';
      } else {
        this.sortBy = 'ESTABLISHMENT_NAME_ARB';
      }
    } else if (sortValues.sortBy.value.english === 'Registration Number') {
      this.sortBy = 'REGISTRATION_NUMBER';
    } else if (sortValues.sortBy.value.english === 'Total') {
      this.sortBy = 'TOTAL';
    }
    this.getMofContributionMonthService(this.sortOrder, this.sortBy, this.filterRequest);
  }
  getSerachValues(searchValues) {
    this.pageNo = 0;
    this.search = searchValues.searchKey;
    this.getMofContributionMonthService(this.sortOrder, this.sortBy, this.filterRequest);
  }

  // This method is used to get deatis based on filter values
  applyFilterDetails(filtertValues) {
    if (filtertValues !== undefined) {
      this.filterRequest = filtertValues;
    }
    this.pageNo = 0;
    this.getMofContributionMonthService(this.sortOrder, this.sortBy, this.filterRequest);
  }

  downloadThirdPartyDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill(this.selectedDate, 1, null, true, this.languageType, 'PDF')
      .subscribe(data => {
        downloadFile(
          this.languageType === 'ENGLISH'
            ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
            : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR,
          'application/pdf',
          data
        );
      });
  }
  printThirdPartyDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill(this.selectedDate, 1, null, true, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
