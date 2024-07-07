/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BillDashboardService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { GccCountry, LanguageTypeEnum, Months } from '../../../../shared/enums';
import { AllocationDetails, EstablishmentHeader, CreditAllocation, DateFormat } from '../../../../shared/models';
import {
  StorageService,
  subtractMonths,
  BilingualText,
  startOfMonth,
  convertToYYYYMMDD,
  LanguageToken,
  ExchangeRateService,
  CurrencyToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  AppConstants,
  downloadFile,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { BehaviorSubject } from 'rxjs';
import { ReportConstants } from '../../../../shared/constants/report-constants';

@Component({
  selector: 'blg-allocation-bill-sc',
  templateUrl: './allocation-bill-sc.component.html',
  styleUrls: ['./allocation-bill-sc.component.scss']
})
export class AllocationBillScomponent implements OnInit {
  /** Local Variables */
  minDateCal: Date;
  maxDateCal: Date;
  dateFormat = 'MMMM YYYY';
  allocationForm: FormGroup;
  responsiblePayee = 'ESTABLISHMENT';
  billNumber = 0;
  allocationDetails: AllocationDetails;
  isdisabled = false;
  idNumber: number;
  closedDate: DateFormat = new DateFormat();
  closedMonth: string;
  dateSelected: string;
  billIssueDate: string;
  establishmentName: BilingualText;
  closedAtDate: string;
  isAdmin = false;
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  lang = 'en';
  languageType: string;
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  currentCurrency = 'SAR';
  exchangeRate = 1;
  gccEstablishmentFlags: boolean;
  isInitialCurrencyChange = true;
  previousSelectedCurrency: string;
  routeFrom: string;
  previousExchangeRate: number;
  selectedCurrency: string;
  isAppPrivate: boolean;
  isMofFlag: boolean;
  mofEstablishment: boolean;
  creditSummaryValue: CreditAllocation[];
  list: CreditAllocation[] = [];
  allocationCreditTotal = 0;
  selectedTab = 'BILLING.CREDITS';
  tabList = ['BILLING.CREDITS', 'BILLING.ALLOCATION-OF-CREDITS', 'BILLING.ALLOCATION-CONTRIBUTION-SUMMARY'];
  isPPA: boolean;
  isGcc: boolean;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private fb: FormBuilder,
    readonly billDashboardService: BillDashboardService,
    readonly reportStatementService: ReportStatementService,
    readonly detailedBillService: DetailedBillService,
    readonly storageService: StorageService,
    readonly exchangeRateService: ExchangeRateService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {}

  // This method is uset to get data when initailsing the component
  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
      if (!this.isInitialCurrencyChange) {
        this.currencyExchangeRates(this.selectedCurrency);
      }
    });
    this.isAdmin = true;
    this.route.queryParams.subscribe(params => {
      this.dateSelected = params.monthSelected;
      this.billIssueDate = params?.billIssueDate;
      this.routeFrom = params?.fromPage;
      this.isMofFlag = params?.isMofFlag;
      if (params?.registrationNo) {
        this.idNumber = params.registrationNo;
      } else {
        this.idNumber = this.establishmentRegistrationNo.value;
      }
      if (params?.fromPage === 'mofAllocation') {
        this.responsiblePayee = 'THIRD_PARTY';
        this.maxDateCal = moment(params?.maxBilldate).toDate();
        this.minDateCal = startOfMonth(subtractMonths(new Date(this.dateSelected), 11));
      } else {
        this.responsiblePayee = 'ESTABLISHMENT';
        this.maxDateCal = moment(params?.maxBilldate).toDate();
        this.minDateCal = startOfMonth(moment(this.billIssueDate).toDate());
      }
    });
    this.getallocationBillNumber(this.idNumber);
    this.getAllocationBillingHeaderDetails(this.idNumber);
    this.allocationForm = this.createAllocationBillDetailsForm();
  }

  /** This method is to set the inital date for the calander */
  createAllocationBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [new Date(this.dateSelected)],
        hijiri: ['']
      })
    });
  }

  /** This method is to get the month from the calander */
  selectAllocationStartDate(dateValue: string) {
    this.dateSelected = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    this.getallocationBillNumber(this.idNumber);
    this.closedMonth = moment(this.dateSelected).endOf('month').format('D MMMM YYYY');
  }

  /**
   * This method to set Bill Number
   * @param idNo Identification Number
   */
  getallocationBillNumber(idNo: number) {
    this.isdisabled = false;
    this.detailedBillService.getBillNumber(idNo, this.dateSelected).subscribe(res => {
      this.billNumber = res.bills[0].billNumber;
      if (res) {
        this.billDashboardService.getAllocationDetails(idNo, this.billNumber, this.responsiblePayee).subscribe(data => {
          this.allocationDetails = data;
          this.mofEstablishment = this.allocationDetails.mofEstablishment;
          if (this.allocationDetails.migratedBill) this.isdisabled = true;
          if (!this.isMofFlag && !this.mofEstablishment) {
            this.minDateCal = startOfMonth(new Date(this.allocationDetails?.allocationEnabledDate?.gregorian));
          }
          if (this.responsiblePayee === 'THIRD_PARTY')
            this.tabList = ['BILLING.CREDITS', 'BILLING.ALLOCATION-OF-CREDITS', 'BILLING.SUMMARY-CONTRIBUTION-LATEFEE'];
          this.closedMonth = moment(this.allocationDetails?.closingDate?.gregorian).format('D MMMM YYYY');
          this.allocationCreditTotal =
            this.allocationDetails.creditAdjustment +
            this.allocationDetails.creditFromPrevious +
            this.allocationDetails.incomingTransfer +
            this.allocationDetails.totalPayment;
          this.getEstAllocationValues(this.allocationDetails);
        });
      }
    });
  }

  /**
   * This method to get the heading establishment and reg no
   * @param idNo Identification Number
   */
  getAllocationBillingHeaderDetails(idNo: number) {
    this.isInitialCurrencyChange = false;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((response: EstablishmentHeader) => {
      this.establishmentHeader = response;
      this.establishmentName = this.establishmentHeader.name;
      this.isGcc = response.gccCountry;
      this.isPPA = response.ppaEstablishment;
      if (response.gccEstablishment) {
        this.gccEstablishmentFlags = response.gccEstablishment.gccCountry;
        Object.keys(GccCountry).forEach(keys => {
          if (GccCountry[keys] === response.gccEstablishment.country.english) {
            this.previousSelectedCurrency = keys;
          }
        });
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.previousSelectedCurrency, currentDate)
          .subscribe(res => {
            this.previousExchangeRate = res;
            this.currencyExchangeRates(this.selectedCurrency);
          });
      }
    });
  }
  /** Method to navigate back to receipt list view. */
  navigateBacks() {
    if (this.routeFrom === 'mofAllocation') {
      this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION_MOF], {
        queryParams: {
          monthSelected: this.dateSelected
        }
      });
    } else {
      this.router.navigate([BillingConstants.ROUTE_BILL_HISTORY]);
    }
  }
  navigateToContributorLevels() {
    if (!this.isdisabled) {
      this.router.navigate([BillingConstants.ROUTE_CONTRIBUTOR_CREDIT_ALLOCATION], {
        queryParams: {
          billIssueDate: convertToYYYYMMDD(this.billIssueDate),
          monthSelected: convertToYYYYMMDD(this.dateSelected),
          maxBilldate: convertToYYYYMMDD(this.maxDateCal.toString()),
          isMofFlag: this.isMofFlag,
          registrationNo: this.idNumber,
          responsiblePayee: this.responsiblePayee,
        }
      });
    }
  }

  /** Method to get  currency exchange rate change */
  currencyExchangeRates(newSelectedCurrency: string) {
    if (this.gccEstablishmentFlags) {
      if (newSelectedCurrency === BillingConstants.CURRENCY_SAR.english) {
        this.currentCurrency = newSelectedCurrency;
        this.exchangeRate = 1;
      } else if (newSelectedCurrency === this.previousSelectedCurrency) {
        this.exchangeRate = this.previousExchangeRate;
        this.currentCurrency = this.previousSelectedCurrency;
      }
    } else {
      this.exchangeRate = 1;
      this.currentCurrency = 'SAR';
    }
  }

  /** Method to get allocation details and pushing this to new list */
  getEstAllocationValues(allocationDetails) {
    this.list = [];
    this.creditSummaryValue = [];
    for (let i = 0; i < allocationDetails.creditAllocation.length; i++) {
      this.list.push(allocationDetails.creditAllocation[i]);
      const allocationValues = {
        amountFromPreviousBill: {
          debitAmount: this.list[i]?.amountFromPreviousBill?.debitAmount,
          allocatedAmount: this.list[i]?.amountFromPreviousBill?.allocatedAmount,
          balance:
            this.list[i].amountFromPreviousBill?.debitAmount - this.list[i]?.amountFromPreviousBill?.allocatedAmount
        },
        adjustmentForCurrent: {
          debitAmount: this.list[i].adjustmentForCurrent?.debitAmount,
          allocatedAmount: this.list[i]?.adjustmentForCurrent?.allocatedAmount,
          balance: this.list[i]?.adjustmentForCurrent?.debitAmount - this.list[i]?.adjustmentForCurrent?.allocatedAmount
        },
        currentMonthDues: {
          debitAmount: this.list[i].currentMonthDues.debitAmount,
          allocatedAmount: this.list[i].currentMonthDues.allocatedAmount,
          balance: this.list[i]?.currentMonthDues?.debitAmount - this.list[i]?.currentMonthDues?.allocatedAmount
        },
        type: this.list[i].type
      };
      this.creditSummaryValue.push(allocationValues);
    }
  }
  goToNewTab(selectedTab: string) {
    this.selectedTab = selectedTab;
  }
  setClosedDate(date: string) {
    this.closedDate.date = moment(date).toDate().getDate().toString();
    this.closedDate.year = moment(date).toDate().getFullYear().toString();
    this.closedMonth = Months[moment(date).toDate().getMonth().toString()];
  }
  downloadAllocationBill() {
    this.reportStatementService
      .downloadAllocationBill('', this.idNumber, this.billNumber, false, this.languageType)
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }

  printAllocationBill() {
    this.reportStatementService
      .downloadAllocationBill('', this.idNumber, this.billNumber, false, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
