/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import moment from 'moment';
import { BillDashboardService, DetailedBillService } from '../../../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AllocationDetails,
  EstablishmentHeader,
  ContributorCreditAllocation,
  ContributorAllocationDetails,
  CreditAllocation
} from '../../../../shared/models';
import {
  StorageService,
  subtractMonths,
  BilingualText,
  startOfMonth,
  convertToYYYYMMDD,
  LanguageToken,
  ExchangeRateService,
  CurrencyToken,
  AppConstants,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BillingConstants } from '../../../../shared/constants';
import { GccCountry } from '../../../../shared/enums';
import { ContributorAllocationFilterRequest } from '../../../../shared/models/contributor-allocation-filter-request';

@Component({
  selector: 'blg-contributor-allocation-credit-sc',
  templateUrl: './contributor-allocation-credit-sc.component.html',
  styleUrls: ['./contributor-allocation-credit-sc.component.scss']
})
export class ContributorAllocationCreditScComponent implements OnInit {
  /** Local Variables */
  filterRequests: ContributorAllocationFilterRequest;
  minDateCalValue: Date;
  maxDateCalValue: Date;
  dateFormat = 'MMMM YYYY';
  allocationForm: FormGroup;
  billNumber = 0;
  idNumber: number;
  dateSelected: string;
  billIssueDate: string;
  closedAtDate: string;
  isAdmin = false;
  allocationDetails: AllocationDetails;
  individualAllocation: ContributorCreditAllocation;
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  establishmentName: BilingualText;
  contributorAllocationSummary: ContributorAllocationDetails;
  pageNo = 0;
  pageSize = 10;
  sin = '';
  name = '';
  lang = 'en';
  currentCurrency = 'SAR';
  exchangeRate = 1;
  mofEstablishment: boolean;
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  isInitialCurrencyChange = true;
  previousSelectedCurrency: string;
  previousExchangeRate: number;
  selectedCurrency: string;
  gccEstablishmentFlag: boolean;
  isMofFlag: boolean;
  selectedTab = 'BILLING.CREDITS';
  responsiblePayee = 'ESTABLISHMENT';
  creditSummaryValue: CreditAllocation[];
  list: CreditAllocation[] = [];
  allocationCreditTotal = 0;
  searchValue: string;
  tabList = ['BILLING.CREDITS', 'BILLING.ALLOCATION-OF-CREDITS', 'BILLING.ALLOCATION-CONTRIBUTION-SUMMARY'];
  isPPA: boolean;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private fb: FormBuilder,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly billDashboardService: BillDashboardService,
    readonly detailedBillService: DetailedBillService,
    readonly storageService: StorageService,
    readonly exchangeRateService: ExchangeRateService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {}

  // This method is uset to get data when initailsing the data for the component
  ngOnInit() {
    this.isAdmin = true;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
      if (!this.isInitialCurrencyChange) {
        this.currencyExchangeRate(this.selectedCurrency);
      }
    });
    this.route.queryParams.subscribe(params => {
      this.dateSelected = params.monthSelected;
      this.billIssueDate = params.billIssueDate;
      this.isMofFlag = params.isMofFlag;
      //this.isPPA = params.isPpa;

      if (params.responsiblePayee) {
        this.responsiblePayee = params.responsiblePayee;
      }
      if (params?.registrationNo) {
        this.idNumber = params.registrationNo;
      } else {
        this.idNumber = this.establishmentRegistrationNo.value;
      }
      this.maxDateCalValue = moment(params?.maxBilldate).toDate();
    });

    this.minDateCalValue = startOfMonth(subtractMonths(new Date(this.dateSelected), 11));
    this.getMofCreditDetails(this.idNumber);
    this.getBillingHeaderDetail(this.idNumber);
    this.allocationForm = this.createMofBillDetailsForm();
  }

  /** This method is to set the inital date for the calander */
  createMofBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [new Date(this.dateSelected)],
        hijiri: ['']
      })
    });
  }

  /** This method is to get the month from the calander */
  selectMofStartDate(dateValue: string) {
    this.dateSelected = moment(dateValue).toDate().toString();
    this.dateSelected = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    this.getMofCreditDetails(this.idNumber);
  }

  /**
   * This method to set Bill Number
   * @param idNo Identification Number
   */
  getMofCreditDetails(idNo: number) {
    this.detailedBillService.getBillNumber(idNo, this.dateSelected).subscribe(res => {
      this.billNumber = res.bills[0].billNumber;
      if (res) {
        this.billDashboardService.getAllocationDetails(idNo, this.billNumber, this.responsiblePayee).subscribe(data => {
          this.allocationDetails = data;
          this.minDateCalValue = moment(this.allocationDetails.ameenBillStartDate?.gregorian).toDate();
          this.mofEstablishment = this.allocationDetails.mofEstablishment;
          if (this.responsiblePayee === 'THIRD_PARTY')
            this.tabList = ['BILLING.CREDITS', 'BILLING.ALLOCATION-OF-CREDITS', 'BILLING.SUMMARY-CONTRIBUTION-LATEFEE'];
          this.allocationCreditTotal =
            this.allocationDetails.creditAdjustment +
            this.allocationDetails.creditFromPrevious +
            this.allocationDetails.incomingTransfer +
            this.allocationDetails.totalPayment;
          this.closedAtDate = moment(this.allocationDetails.closingDate?.gregorian).format('D MMMM YYYY');
          this.getEstAllocationValues(this.allocationDetails);
          this.searchValue = '';
          this.getcontributorAllocationCredit(this.filterRequests);
        });
      }
    });
  }
  getcontributorAllocationCredit(filterRequests?) {
    this.billDashboardService
      .getAllocationCredit(
        this.idNumber,
        this.billNumber,
        this.pageNo,
        this.pageSize,
        this.searchValue,
        filterRequests,
        this.responsiblePayee
      )
      .subscribe(details => {
        this.individualAllocation = details;
      });
  }

  getContributorAllocationDet(sin) {
    this.billDashboardService
      .getContributorAllocationDetails(this.idNumber, this.billNumber, sin, this.responsiblePayee)
      .subscribe(detail => {
        this.contributorAllocationSummary = detail;
      });
  }

  /**
   * This method to get the heading establishment and reg number
   * @param idNo Identification Number
   */
  getBillingHeaderDetail(idNo: number) {
    this.isInitialCurrencyChange = false;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((resValue: EstablishmentHeader) => {
      this.establishmentHeader = resValue;
      this.establishmentName = this.establishmentHeader.name;
      this.isPPA = resValue.ppaEstablishment;
      if (resValue.gccEstablishment) {
        this.gccEstablishmentFlag = resValue.gccEstablishment.gccCountry;
        Object.keys(GccCountry).forEach(keys => {
          if (GccCountry[keys] === resValue.gccEstablishment.country.english) {
            this.previousSelectedCurrency = keys;
          }
        });
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.previousSelectedCurrency, currentDate)
          .subscribe(res => {
            this.previousExchangeRate = res;
            this.currencyExchangeRate(this.selectedCurrency);
          });
      }
    });
  }
  /** Method to navigate back to bill-allocation list view. */
  navigateBackToAllocation() {
    if (this.responsiblePayee === 'THIRD_PARTY') {
      this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(this.dateSelected),
          registrationNo: this.idNumber,
          fromPage: 'mofAllocation'
        }
      });
    } else {
      this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(this.dateSelected),
          billIssueDate: convertToYYYYMMDD(this.billIssueDate),
          maxBilldate: convertToYYYYMMDD(this.maxDateCalValue.toString())
        }
      });
    }
  }

  /**
   * This method is to select the page number on pagination
   */
  getselectPageNo(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getcontributorAllocationCredit();
  }

  getCreditDetails(searchValue) {
    this.pageNo = 0;
    const searchResult = isNaN(searchValue);
    if (searchResult) {
      this.name = searchValue;
    } else {
      this.sin = searchValue;
    }
    this.searchValue = searchValue;
    this.getcontributorAllocationCredit(this.filterRequests);
  }

  /** Method to get  currency exchange rate change */
  currencyExchangeRate(newSelectedCurrency: string) {
    if (this.gccEstablishmentFlag) {
      if (newSelectedCurrency === BillingConstants.CURRENCY_SAR.english) {
        this.exchangeRate = 1;
        this.currentCurrency = newSelectedCurrency;
      } else if (newSelectedCurrency === this.previousSelectedCurrency) {
        this.exchangeRate = this.previousExchangeRate;
        this.currentCurrency = this.previousSelectedCurrency;
      }
    } else {
      this.exchangeRate = 1;
      this.currentCurrency = 'SAR';
    }
  }
  goToNewTab(selectedTab: string) {
    this.selectedTab = selectedTab;
  }
  /** Method to get allocation details and pushing this to new list */
  getEstAllocationValues(allocationDetail) {
    this.list = [];
    this.creditSummaryValue = [];
    for (let i = 0; i < allocationDetail.creditAllocation.length; i++) {
      this.list.push(allocationDetail.creditAllocation[i]);
      const allocationValues = {
        adjustmentForCurrent: {
          debitAmount: this.list[i].adjustmentForCurrent.debitAmount,
          allocatedAmount: this.list[i].adjustmentForCurrent.allocatedAmount,
          balance: this.list[i].adjustmentForCurrent.debitAmount - this.list[i].adjustmentForCurrent.allocatedAmount
        },
        amountFromPreviousBill: {
          debitAmount: this.list[i].amountFromPreviousBill.debitAmount,
          allocatedAmount: this.list[i].amountFromPreviousBill.allocatedAmount,
          balance: this.list[i].amountFromPreviousBill.debitAmount - this.list[i].amountFromPreviousBill.allocatedAmount
        },
        currentMonthDues: {
          debitAmount: this.list[i].currentMonthDues.debitAmount,
          allocatedAmount: this.list[i].currentMonthDues.allocatedAmount,
          balance: this.list[i].currentMonthDues.debitAmount - this.list[i].currentMonthDues.allocatedAmount
        },
        type: this.list[i].type
      };
      this.creditSummaryValue.push(allocationValues);
    }
  }

  // This methodis used to get filter value on applying filter
  applyFilterValues(filterParams) {
    if (filterParams !== undefined) {
      this.filterRequests = filterParams;
    }
    this.pageNo = 0;
    this.getcontributorAllocationCredit(this.filterRequests);
  }
}
