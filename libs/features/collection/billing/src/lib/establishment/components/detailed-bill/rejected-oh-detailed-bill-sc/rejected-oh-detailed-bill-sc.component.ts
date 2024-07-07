/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import {
  BillDetails,
  DetailedBillViolationDetails,
  EstablishmentHeader,
  GccCurrency,
  ItemizedBillDetailsWrapper,
  ItemizedInstallmentWrapper,
  ItemizedRejectedOHWrapper
} from '../../../../shared/models';
import { BillingRoutingService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import moment from 'moment';
import {
  convertToYYYYMMDD,
  ExchangeRateService,
  LookupService,
  LovList,
  startOfMonth,
  StorageService,
  BilingualText,
  CurrencyToken,
  AppConstants,
  downloadFile,
  LanguageToken,
  endOfMonth,
  RegistrationNumber,
  RegistrationNoToken
} from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GccCountry, GccCurrencyLabel, CurrencyArabicShortForm, LanguageTypeEnum } from '../../../../shared/enums';
import { BehaviorSubject, noop } from 'rxjs';
@Component({
  selector: 'blg-rejected-oh-detailed-bill-sc',
  templateUrl: './rejected-oh-detailed-bill-sc.component.html',
  styleUrls: ['./rejected-oh-detailed-bill-sc.component.scss']
})
export class RejectedohDetailedBillScComponent implements OnInit {
  noOfDays: number;
  selectedDate: string;
  currentCurrencyDetails: GccCurrency = new GccCurrency();
  isGccCountry = false;
  idNumber: number;
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  isAdmin = false;
  exchangeRate = 1;
  billNumber;
  currencyList: GccCurrency[] = [];
  gccCountry: string;
  currencyValues: BilingualText = new BilingualText();
  currentValues: string;
  enityType = 'ESTABLISHMENT';
  violationDetails: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  pageNo = 0;
  rejectOHFileName: string;
  rejectOHType: string;
  pageSize = 10;
  billStartDate: string;
  billDetails: BillDetails = new BillDetails();
  isMofFlag = false;
  tabValues;
  Url: string;
  lang = 'en';
  languageType: string;
  selectedTabName: string;
  billIssueDate: string;
  errorMessage: BilingualText = new BilingualText();
  itemizedBills: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  isBillNumber = false;
  isInitials = false;
  gccCurrencyList: LovList;
  isBillResponse = false;
  initialStartDate: string;
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  /**
   *
 * Creates an instance of LatefeeDetailedBillScComponent

   * @param lookUpService
   * @param storageService
   * @param establishmentBillService
   * @param route
   */
  constructor(
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly detailedBillService: DetailedBillService,
    readonly reportStatementService: ReportStatementService,
    readonly billingRoutingService: BillingRoutingService,
    readonly lookUpService: LookupService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly exchangeRateService: ExchangeRateService,
    readonly router: Router
  ) {}
  /**
   * This method handles initialization tasks.
   *
   * @memberof BillingScComponent
   */
  ngOnInit() {
    this.currency.subscribe(currentCurrencyKey => {
      this.currentValues = currentCurrencyKey;
      if (this.isInitials && currentCurrencyKey) {
        this.currencyValueChanges(currentCurrencyKey);
      }
    }, noop);
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.currentCurrencyDetails.label = GccCurrencyLabel.SAR;
    this.currentCurrencyDetails.code.value = BillingConstants.CURRENCY_SAR;
    this.lookUpService.getGccCurrencyList().subscribe(res => {
      this.gccCurrencyList = res;
    }, noop);
    this.route.queryParams.subscribe(params => {
      this.billNumber = params.billNumber;
      this.billIssueDate = params.billIssueDate;
      this.selectedDate = params.monthSelected;
      this.idNumber = params.registerNo;
      this.isMofFlag = params.mofFlag;
      this.initialStartDate = params.billStartDate;
    }, noop);
    //TODO Can we use appTokens
    this.isAdmin = true;
    this.idNumber = this.establishmentRegistrationNo.value;
    this.getBillBreakUpDetails(this.idNumber);
    this.getBillingHeaderDetails(this.idNumber);
  }

  /**
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUpDetails(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDate, this.enityType)
      .subscribe((res: BillDetails) => {
        this.getInstallmentDetails();
        this.getViolationDetails();
        this.billDetails = res;
        if (this.billDetails.initialBillStartDate?.gregorian < this.billDetails.ameenStartDate?.gregorian)
          this.initialStartDate = convertToYYYYMMDD(
            startOfMonth(this.billDetails.ameenStartDate?.gregorian)?.toString()
          );
        else
          this.initialStartDate = convertToYYYYMMDD(
            startOfMonth(this.billDetails.initialBillStartDate?.gregorian)?.toString()
          );
        this.billStartDate = convertToYYYYMMDD(startOfMonth(res.latestBillStartDate?.gregorian)?.toString());
        this.detailedBillService
          .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
          .subscribe(
            responseData => {
              this.rejectedOHDetails = responseData;
              if (this.rejectedOHDetails) this.getTabsetValues();
            },
            () => {
              this.getTabsetValues();
            }
          );
        this.getItemizedRejectedOH();
      }, noop);
  }
  /**
   * This method to call itemized contribution Service
   * @param idNo Identification Number
   */
  getItemizedRejectedOH() {
    this.detailedBillService
      .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
      .subscribe(responseData => {
        this.rejectedOHDetails = responseData;
        if (this.rejectedOHDetails) this.getTabsetValues();
      }, noop);
  }
  /**
   * This method is to get installment details on selected date
   */
  getViolationDetails() {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(this.selectedDate)).toDate())));
    this.detailedBillService.getViolationDetails(this.idNumber, this.selectedDate, endDate, 0, this.pageSize).subscribe(
      data => {
        this.violationDetails = data;
        if (this.violationDetails) this.getTabsetValues();
      },
      () => {
        this.getTabsetValues();
      }
    );
  }
  /**
   * This method is to call service for Bill Summary
   */
  getDashboardBillDetailsForRejectedOH() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDate,
      this.billNumber,
      false,
      this.initialStartDate,
      this.idNumber
    );
    this.getBillBreakUpDetails(this.idNumber);
  }
  /**
   * This method is to get installment details on selected date
   */
  getInstallmentDetails() {
    this.detailedBillService.getInstallmentDetails(this.idNumber, this.selectedDate).subscribe(
      responseData => {
        this.installmentDetails = responseData;
        if (this.installmentDetails) this.getTabsetValues();
      },
      () => {
        this.getTabsetValues();
      }
    );
  }
  /**
   * This method is to get bill details on selected date
   */
  getRejectedOHDetailsOnSelectedDate(dateValue: string) {
    this.isBillResponse = false;
    this.pageNo = 0;
    this.selectedDate = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    if (this.selectedDate) {
      this.detailedBillService.getBillNumber(this.idNumber, this.selectedDate).subscribe(
        res => {
          this.billNumber = res.bills[0].billNumber;
          this.isBillNumber = false;
          this.detailedBillService
            .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.enityType)
            .subscribe((response: BillDetails) => {
              this.getInstallmentDetails();
              this.getViolationDetails();
              this.billDetails = response;
              if (this.billDetails.initialBillStartDate?.gregorian < this.billDetails.ameenStartDate?.gregorian)
                this.initialStartDate = convertToYYYYMMDD(
                  startOfMonth(this.billDetails.ameenStartDate?.gregorian)?.toString()
                );
              else
                this.initialStartDate = convertToYYYYMMDD(
                  startOfMonth(this.billDetails.initialBillStartDate?.gregorian)?.toString()
                );
              this.detailedBillService
                .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
                .subscribe(responseData => {
                  this.isBillResponse = true;
                  this.rejectedOHDetails = responseData;
                  if (this.rejectedOHDetails) this.getTabsetValues();
                });
              if (!this.isBillResponse) this.rejectedOHDetails.amount = 0;
              if (this.rejectedOHDetails.amount === 0) {
                if (this.billDetails.totalLateFee !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
                } else if (this.billDetails.totalDebitAdjustment !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
                } else if (this.billDetails.totalReceiptsAndCredits !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
                } else if (this.billDetails.totalContribution !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
                } else if (this.installmentDetails.currentInstallmentAmount !== null) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
                } else if (this.violationDetails.totalViolationAmountAggregate > 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
                }
                this.router.navigate([this.Url], {
                  queryParams: {
                    monthSelected: convertToYYYYMMDD(this.selectedDate),
                    billNumber: this.billNumber,
                    mofFlag: this.isMofFlag,
                    registerNo: this.idNumber,
                    billStartDate: convertToYYYYMMDD(this.initialStartDate)
                  }
                });
              }
              this.getTabsetValues();
              this.getItemizedRejectedOH();
            }, noop);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isBillNumber = true;
        }
      );
    }
  }
  /**
   * This method is to navigate to new tabs
   */
  goToNewTabSelected(selectedTabs: string) {
    if (selectedTabs === 'BILLING.DEBIT-ADJUSTMENTS') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    }

    if (selectedTabs === 'BILLING.RECEIPTS-AND-CREDITS' || selectedTabs === 'BILLING.CREDIT-ADJUSTMENTS')
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (selectedTabs === 'BILLING.LATE-PAYMENT-FEES') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    }
    if (selectedTabs === 'BILLING.CONTRIBUTION' || selectedTabs === 'BILLING.CURRENT-MONTH-CONTRIBUTION') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    }
    if (selectedTabs === 'BILLING.REJECTED-OH-CLAIMS') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    }
    if (selectedTabs === 'BILLING.INSTALLMENT') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    if (selectedTabs === 'BILLING.VIOLATIONS') this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
    this.router.navigate([this.Url], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDate),
        mofFlag: this.isMofFlag,
        billNumber: this.billNumber,
        registerNo: this.idNumber,
        billStartDate: convertToYYYYMMDD(this.initialStartDate)
      }
    });
  }
  currencyValueChanges(value: string) {
    if (
      this.currencyValues.english !== value &&
      value === this.gccCountry &&
      this.isGccCountry &&
      value !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, value, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencyValues.english = value;
          this.currencyValues.arabic = CurrencyArabicShortForm[value];
        }, noop);
    } else {
      if (value === BillingConstants.CURRENCY_SAR.english) {
        this.currencyValues.english = BillingConstants.CURRENCY_SAR.english;
        this.currencyValues.arabic = BillingConstants.CURRENCY_SAR.arabic;
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencyValues = this.currencyValues;
      }
    }
  }
  /**
   * This method to get tabset
   * @param billDetails
   */

  getTabsetValues() {
    this.tabValues = [];
    if (this.billDetails) {
      this.tabValues.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.billDetails.totalContribution
      });

      this.tabValues.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.billDetails.totalDebitAdjustment
      });

      this.tabValues.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });

      if (this.billDetails.totalLateFee > 0) {
        this.tabValues.push({
          tabName: 'BILLING.LATE-PAYMENT-FEES',
          amount: this.billDetails.totalLateFee
        });
      }
    }
    if (this.rejectedOHDetails.amount > 0) {
      this.tabValues.push({
        tabName: 'BILLING.REJECTED-OH-CLAIMS',
        amount: this.rejectedOHDetails.amount
      });
    }
    if (this.installmentDetails.currentInstallmentAmount !== null) {
      this.tabValues.push({
        tabName: 'BILLING.INSTALLMENT',
        amount: this.installmentDetails.currentInstallmentAmount
      });
    }
    if (this.violationDetails.totalViolationAmountAggregate > 0) {
      this.tabValues.push({
        tabName: 'BILLING.VIOLATIONS',
        amount: this.violationDetails.totalViolationAmountAggregate
      });
    }
  }
  /**
   * This method is to call Billing Header service
   * @param idNo Identification Number
   */
  /**
   * This method is to call Billing Header service
   * @param idNo Identification Number
   */
  getBillingHeaderDetails(idNo: number) {
    this.isInitials = true;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.establishmentHeader = res;
      this.isGccCountry = res.gccCountry;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country.english) {
            this.gccCountry = data;
          }
        });
      }
      if (this.currentValues !== BillingConstants.CURRENCY_SAR.english && this.currentValues === this.gccCountry) {
        const currentDates = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.gccCountry, currentDates)
          .subscribe(key => {
            this.exchangeRate = key;
            this.currencyValues.english = this.gccCountry;
            this.currencyValues.arabic = CurrencyArabicShortForm[this.currencyValues.english];
          }, noop);
      } else {
        this.currencyValues = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    }, noop);
  }

  /**
   * This method is to select the page number on pagination
   */
  getselectPage(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getItemizedRejectedOH();
  }
  downloadRejectedOhDetailedBill(val) {
    if (val === 'PDF') {
      this.rejectOHFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.rejectOHType = 'application/pdf';
    } else {
      this.rejectOHFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.rejectOHType = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, val)
      .subscribe(data => {
        downloadFile(this.rejectOHFileName, this.rejectOHType, data);
      });
  }
  printRejectedOhDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
