/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import {
  EstablishmentHeader,
  ContributorCreditAllocation,
  ContributorAllocationDetails,
  MofAllocationDetails,
  AllocationFilterSearch,
  DateFormat
} from '../../../../shared/models';
import {
  BilingualText,
  LanguageToken,
  CurrencyToken,
  convertToYYYYMMDD,
  startOfMonth,
  subtractMonths,
  downloadFile,
  QueryParams,
  endOfMonth
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { BillDashboardService, BillingRoutingService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { BillingConstants } from '../../../../shared/constants';
import { MofAllocationOfCreditTableDcComponent } from '../mof-allocation-of-credit-table-dc/mof-allocation-of-credit-table-dc.component';
import { Months } from '../../../../shared/enums/months';
import { ReportConstants } from '../../../../shared/constants/report-constants';
import { LanguageTypeEnum } from '../../../../shared/enums';

@Component({
  selector: 'blg-allocation-bill-mof-sc',
  templateUrl: './allocation-bill-mof-sc.component.html',
  styleUrls: ['./allocation-bill-mof-sc.component.scss']
})
export class AllocationBillMofScomponent implements OnInit {
  @ViewChild('mofAllocationTableComponent') mofAllocationTable: MofAllocationOfCreditTableDcComponent;
  /*-------------------Local Variables-------------------------- */

  /********Month Picker Variables**********************/
  monthPickerMinDate: Date;
  monthPickerMaxDate: Date;
  dateFormat = 'MMMM YYYY';
  dateSelected: string;
  monthPickerForm: FormGroup;
  /********Month Picker Variables Ends**********************/
  balanceAmount = 0;
  billNumber = 0;
  idNumber: number;
  billIssueDate: string;
  closedDate: DateFormat = new DateFormat();
  closedMonth: string;
  allocationCreditTotal = 0;
  isAdmin = false;
  isDebitFlag = false;
  mofAllocationDetails: MofAllocationDetails;
  allocationOfCredits: MofAllocationDetails;
  individualAllocation: ContributorCreditAllocation;
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  establishmentName: BilingualText;
  contributorAllocationSummary: ContributorAllocationDetails;
  pageNo = 0;
  pageSize = 10;
  previousPage = 0;
  pageDetail = {
    currentPage: 1,
    goToPage: ''
  };
  requestDetails: AllocationFilterSearch = new AllocationFilterSearch();
  initialSearchFilter = true;
  sin = '';
  name = '';
  lang = 'en';
  languageType: string;
  currentCurrency = 'SAR';
  onfirstApiCall: boolean;
  exchangeRate = 1;
  tabList = ['BILLING.CREDITS', 'BILLING.ALLOCATION-OF-CREDITS', 'BILLING.SUMMARY-CONTRIBUTION-LATEFEE'];
  selectedTab = 'BILLING.CREDITS';
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  isInitialCurrencyChange = true;
  previousSelectedCurrency: string;
  previousExchangeRate: number;
  selectedCurrency: string;
  gccEstablishmentFlag: boolean;
  isMofFlag: boolean;
  currentCurrencyLable = 'BILLING.SAR';
  establishmentType: string;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    private fb: FormBuilder,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly detailedBillService: DetailedBillService,
    readonly billDashboardService: BillDashboardService,
    readonly reportStatementService: ReportStatementService,
    readonly billingRoutingService: BillingRoutingService,
  ) {}

  // This method is uset to get data when initailsing the data for the component
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
      if (!this.isInitialCurrencyChange) {
        //this.currencyExchangeRate(this.selectedCurrency);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.dateSelected = params?.monthSelected;
      this.monthPickerMaxDate = (endOfMonth(subtractMonths(new Date(), 1)));
      this.establishmentType = params.establishmentType;
    });
    this.closedMonth = moment(this.dateSelected).endOf('month').format('D MMMM YYYY');
    this.monthPickerMinDate = startOfMonth(subtractMonths(new Date(this.dateSelected), 11));
    this.isAdmin = true;
    this.monthPickerForm = this.createMofBillDetailsForm();
    this.onfirstApiCall = true;
    this.getMofallocationDetails();
  }

  /******************************This method route back to MOF bill history ********************************************/
  navigateBackToMofBillHistory() {
    this.billingRoutingService.navigateToMofDashboardBills(this.dateSelected,this.establishmentType);
  }

  /***************************** This method is to get details on selected month is updated******************************/
  onSelectedMonthChange(dateValue: string) {
    this.dateSelected = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    if (this.mofAllocationTable) {
      this.mofAllocationTable.manualFitersReset();
    }
    if (this.selectedTab) this.onfirstApiCall = true;
    this.requestDetails = new AllocationFilterSearch();
    this.requestDetails.selectedDate = this.dateSelected;
    this.pageNo = 0;
    this.initialSearchFilter = true;
    this.setPageDatails(this.pageNo);
    this.getMofallocationDetails();
    this.calculateBalanceAfterAllocation();
    this.closedMonth = moment(this.dateSelected).endOf('month').format('D MMMM YYYY');
  }
  /**
   * This method to set Bill Number
   * @param idNo Identification Number
   */
  getMofallocationDetails() {
    this.requestDetails.pageNo = this.pageNo;
    this.requestDetails.pageSize = this.pageSize;
    this.requestDetails.selectedDate = this.dateSelected;
    this.billDashboardService.getMofAllocationDetails(this.requestDetails,this.establishmentType).subscribe(data => {
      if (this.onfirstApiCall) {
        this.mofAllocationDetails = data;
        this.onfirstApiCall = false;
        this.calculateBalanceAfterAllocation();
      }
      this.allocationOfCredits = data;
    });
  }

  navigateToEstAllocation(registrationNo: number) {
    this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION], {
      queryParams: {
        monthSelected: this.dateSelected,
        registrationNo: registrationNo,
        fromPage: 'mofAllocation'
      }
    });
  }
  /*************************************This method is to set the inital date for the calander***********************************/
  createMofBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [new Date(this.dateSelected)],
        hijiri: ['']
      })
    });
  }
  goToNewTab(selectedTab: string) {
    this.selectedTab = selectedTab;
    if (this.selectedTab === 'BILLING.ALLOCATION-OF-CREDITS') {
      this.getMofallocationDetails();
    }
  }
  calculateBalanceAfterAllocation() {
    this.allocationCreditTotal =
      this.mofAllocationDetails?.creditAdjustment +
      this.mofAllocationDetails?.creditFromPrevious +
      this.mofAllocationDetails?.totalPayment;
    let totalBalanceAfterAllocation = 0;
    this.mofAllocationDetails?.thirdPartyBillAllocations.forEach(value => {
      totalBalanceAfterAllocation += value?.balanceAfterAllocation;
    });
    if (this.mofAllocationDetails?.totalDebitAmount !== this.mofAllocationDetails?.totalAllocatedAmount) {
      this.balanceAmount = totalBalanceAfterAllocation;
      this.isDebitFlag = true;
    } else {
      this.balanceAmount = this.allocationCreditTotal - this.mofAllocationDetails?.totalAllocatedAmount;
      this.isDebitFlag = false;
    }
  }
  onPageChange(page: number) {
    this.pageNo = page;
    this.setPageDatails(this.pageNo);
    this.requestDetails.pageNo = this.pageNo;
    this.requestDetails.pageSize = this.pageSize;
    this.getMofallocationDetails();
  }
  onSearch(searchKey: string) {
    if (searchKey) {
      this.requestDetails.isSearch = true;
      this.requestDetails.searchKey = searchKey;
      this.applyFilter(this.requestDetails);
    } else {
      this.requestDetails.isSearch = false;
      this.requestDetails.searchKey = null;
      this.applyFilter(this.requestDetails);
    }
  }
  applyFilter(filterParams: AllocationFilterSearch) {
    if (filterParams.isSearch || filterParams.isFilter) {
      if (this.initialSearchFilter) {
        this.previousPage = this.pageNo;
        this.pageNo = 0;
        this.setPageDatails(this.pageNo);
        this.initialSearchFilter = false;
      } else {
        this.pageNo = filterParams.pageNo;
      }
    } else {
      this.pageNo = this.previousPage;
      this.setPageDatails(this.pageNo);
      this.initialSearchFilter = true;
    }
    this.requestDetails = filterParams;
    this.requestDetails.pageNo = this.pageNo;
    this.requestDetails.pageSize = this.pageSize;
    this.getMofallocationDetails();
  }
  setPageDatails(page: number) {
    this.pageDetail.currentPage = page + 1;
    this.pageDetail.goToPage = String(this.pageDetail.currentPage);
  }
  setClosedDate(date: string) {
    this.closedDate.date = moment(date).toDate().getDate().toString();
    this.closedDate.year = moment(date).toDate().getFullYear().toString();
    this.closedMonth = Months[moment(date).toDate().getMonth().toString()];
  }

  downloadMofAllocationBill() {
    this.reportStatementService
      .downloadAllocationBill(this.dateSelected, 1, null, true, this.languageType)
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }
  printMofAllocationBill() {
    this.reportStatementService
      .downloadAllocationBill(this.dateSelected, 1, null, true, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
