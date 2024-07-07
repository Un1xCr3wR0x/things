import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppConstants,
  BilingualText,
  convertToYYYYMMDD,
  CurrencyToken,
  downloadFile,
  endOfMonth,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  startOfMonth,
  StorageService
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject, noop } from 'rxjs';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import { CurrencyArabicShortForm, GccCountry, LanguageTypeEnum } from '../../../../shared/enums';
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

@Component({
  selector: 'blg-violation-detailed-bill-sc',
  templateUrl: './violation-detailed-bill-sc.component.html',
  styleUrls: ['./violation-detailed-bill-sc.component.scss']
})
export class ViolationDetailedBillScComponent implements OnInit {
  routeUrl: string;
  noOfDays: number;
  billDetails: BillDetails = new BillDetails();
  billStartDate: string;
  currentValues: string;
  isInitialValue = false;
  enityType = 'ESTABLISHMENT';
  billViolationNumber;
  billViolationIssueDate: string;
  selectedDateValue: string;
  tabValue = [];
  pageNum = 0;
  pageSize = 10;
  isAdmin = true;
  regNumber: number;
  isBillNumber = false;
  lang = 'en';
  languageType: string;
  violationFileName: string;
  violationType;
  errorMessage: BilingualText = new BilingualText();
  isMofFlag = false;
  initialStartDate: string;
  currentCurrencyDetails: GccCurrency = new GccCurrency();
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  currencyValues: BilingualText = new BilingualText();
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  violationDetails: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  isBillResponse = false;
  establishmentHeaderDetails: EstablishmentHeader = new EstablishmentHeader();
  isGccCountryVal = false;
  gccCountry: string;
  itemizedBills: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  exchangeRate = 1;

  constructor(
    readonly storageService: StorageService,
    readonly activatedRoute: ActivatedRoute,
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

  ngOnInit(): void {
    this.currency.subscribe(currentCurrencyKey => {
      this.currentValues = currentCurrencyKey;
      if (this.isInitialValue && currentCurrencyKey) {
        this.currencyValueChange(currentCurrencyKey);
      }
    }, noop);
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.activatedRoute.queryParams.subscribe(paramValue => {
      if (paramValue) {
        this.billViolationNumber = paramValue.billNumber;
        this.billViolationIssueDate = paramValue.billIssueDate;
        this.selectedDateValue = paramValue.monthSelected;
        this.regNumber = paramValue.registerNo;
        this.isMofFlag = paramValue.mofFlag;
        this.initialStartDate = paramValue.billStartDate;
      } else {
        this.regNumber = this.establishmentRegistrationNo.value;
      }
    }, noop);

    this.getBillBreakUpDetails(this.regNumber);
    this.getBillingHeaderDetail(this.regNumber);
  }
  /**
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUpDetails(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billViolationNumber, this.selectedDateValue, this.enityType)
      .subscribe((res: BillDetails) => {
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
        this.getInstallmentDetails();
        this.getViolationDetails();
        this.detailedBillService
          .getRejectedOHDetails(this.regNumber, this.selectedDateValue, this.pageNum, this.pageSize)
          .subscribe(
            responseData => {
              this.rejectedOHDetails = responseData;
              if (this.rejectedOHDetails) this.getTabsetValue();
            },
            () => {
              this.getTabsetValue();
            }
          );
      }, noop);
  }
  /**
   * This method is to get installment details on selected date
   */
  getInstallmentDetails() {
    this.detailedBillService.getInstallmentDetails(this.regNumber, this.selectedDateValue).subscribe(
      responseData => {
        this.installmentDetails = responseData;
        if (this.installmentDetails) this.getTabsetValue();
      },
      () => {
        this.getTabsetValue();
      }
    );
  }
  /**
   * This method is to get installment details on selected date
   */
  getViolationDetails() {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(this.selectedDateValue)).toDate())));
    this.detailedBillService
      .getViolationDetails(this.regNumber, this.selectedDateValue, endDate, this.pageNum, this.pageSize)
      .subscribe(
        responseData => {
          this.violationDetails = responseData;
          if (this.violationDetails) this.getTabsetValue();
        },
        () => {
          this.getTabsetValue();
        }
      );
  }
  /**
   * This method is to get bill details on selected date
   */
  getViolationDetailsOnSelectedDate(dateValue: string) {
    this.selectedDateValue = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    this.pageNum = 0;
    if (this.selectedDateValue) {
      this.detailedBillService.getBillNumber(this.regNumber, this.selectedDateValue).subscribe(
        res => {
          this.isBillNumber = false;
          this.billViolationNumber = res.bills[0].billNumber;
          this.detailedBillService
            .getBillBreakup(this.regNumber, this.billViolationNumber, this.selectedDateValue, this.enityType)
            .subscribe((response: BillDetails) => {
              this.billDetails = response;
              if (this.billDetails.initialBillStartDate?.gregorian < this.billDetails.ameenStartDate?.gregorian)
                this.initialStartDate = convertToYYYYMMDD(
                  startOfMonth(this.billDetails.ameenStartDate?.gregorian)?.toString()
                );
              else
                this.initialStartDate = convertToYYYYMMDD(
                  startOfMonth(this.billDetails.initialBillStartDate?.gregorian)?.toString()
                );
              this.getInstallmentDetails();
              this.getViolationDetails();
              this.detailedBillService
                .getRejectedOHDetails(this.regNumber, this.selectedDateValue, this.pageNum, this.pageSize)
                .subscribe(responseData => {
                  this.rejectedOHDetails = responseData;
                  if (this.rejectedOHDetails) this.getTabsetValue();
                });
              if (this.installmentDetails.currentInstallmentAmount === null) {
                if (this.billDetails.totalLateFee !== 0) {
                  this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
                } else if (this.billDetails.totalDebitAdjustment !== 0) {
                  this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
                } else if (this.billDetails.totalReceiptsAndCredits !== 0) {
                  this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
                } else if (this.billDetails.totalContribution !== 0) {
                  this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
                }
                this.router.navigate([this.routeUrl], {
                  queryParams: {
                    monthSelected: convertToYYYYMMDD(this.selectedDateValue),
                    billNumber: this.billViolationNumber,
                    mofFlag: this.isMofFlag,
                    registerNo: this.regNumber,
                    billStartDate: convertToYYYYMMDD(this.initialStartDate)
                  }
                });
              } else this.getTabsetValue();
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
   * This method to get tabset
   * @param billDetails
   */
  /**
   * This method is to call service for Bill Summary
   */
  getDashboardBillDetailsForRejectedOH() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDateValue,
      this.billViolationNumber,
      false,
      this.initialStartDate,
      this.regNumber
    );
    this.getBillBreakUpDetails(this.regNumber);
  }

  getTabsetValue() {
    this.tabValue = [];
    if (this.billDetails) {
      this.tabValue.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.billDetails.totalContribution
      });
      this.tabValue.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.billDetails.totalDebitAdjustment
      });

      this.tabValue.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });

      if (this.billDetails.totalLateFee > 0) {
        this.tabValue.push({
          tabName: 'BILLING.LATE-PAYMENT-FEES',
          amount: this.billDetails.totalLateFee
        });
      }
      if (this.rejectedOHDetails.amount > 0) {
        this.tabValue.push({
          tabName: 'BILLING.REJECTED-OH-CLAIMS',
          amount: this.rejectedOHDetails.amount
        });
      }
      if (this.installmentDetails.currentInstallmentAmount !== null) {
        this.tabValue.push({
          tabName: 'BILLING.INSTALLMENT',
          amount: this.installmentDetails.currentInstallmentAmount
        });
      }
      if (this.violationDetails.totalViolationAmountAggregate > 0) {
        this.tabValue.push({
          tabName: 'BILLING.VIOLATIONS',
          amount: this.violationDetails.totalViolationAmountAggregate
        });
      }
    }
  }
  /**
   * This method is to call Billing Header service
   * @param idNo Identification Number
   */
  getBillingHeaderDetail(idNo: number) {
    this.isInitialValue = true;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.establishmentHeaderDetails = res;
      this.isGccCountryVal = res?.gccCountry;
      if (this.isGccCountryVal) {
        Object.keys(GccCountry).forEach(val => {
          if (GccCountry[val] === res.gccEstablishment.country.english) {
            this.gccCountry = val;
          }
        });
      }
      if (this.currentValues === this.gccCountry && this.currentValues !== BillingConstants.CURRENCY_SAR.english) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.gccCountry, currentDate)
          .subscribe(data => {
            this.currencyValues.arabic = CurrencyArabicShortForm[this.currencyValues.english];
            this.exchangeRate = data;
            this.currencyValues.english = this.gccCountry;
          }, noop);
      } else {
        this.exchangeRate = 1;
        this.currencyValues = BillingConstants.CURRENCY_SAR;
      }
    }, noop);
  }
  currencyValueChange(value: string) {
    if (
      this.currencyValues.english !== value &&
      value === this.gccCountry &&
      this.isGccCountryVal &&
      value !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, value, currentDate)
        .subscribe(res => {
          this.currencyValues.arabic = CurrencyArabicShortForm[value];
          this.exchangeRate = res;
          this.currencyValues.english = value;
        }, noop);
    } else {
      if (value === BillingConstants.CURRENCY_SAR.english) {
        this.exchangeRate = 1;
        this.currencyValues.english = BillingConstants.CURRENCY_SAR.english;
        this.currencyValues.arabic = BillingConstants.CURRENCY_SAR.arabic;
      } else {
        this.currencyValues = this.currencyValues;
        this.exchangeRate = this.exchangeRate;
      }
    }
  }
  /**
   * This method is to navigate to new tabs
   */
  navToNewTabSelected(selectedTabs: string) {
    if (selectedTabs === 'BILLING.DEBIT-ADJUSTMENTS') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    }

    if (selectedTabs === 'BILLING.RECEIPTS-AND-CREDITS' || selectedTabs === 'BILLING.CREDIT-ADJUSTMENTS')
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (selectedTabs === 'BILLING.LATE-PAYMENT-FEES') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    }
    if (selectedTabs === 'BILLING.CONTRIBUTION' || selectedTabs === 'BILLING.CURRENT-MONTH-CONTRIBUTION') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    }
    if (selectedTabs === 'BILLING.REJECTED-OH-CLAIMS') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    }
    if (selectedTabs === 'BILLING.INSTALLMENT') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    this.router.navigate([this.routeUrl], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDateValue),
        mofFlag: this.isMofFlag,
        billNumber: this.billViolationNumber,
        registerNo: this.regNumber,
        billStartDate: convertToYYYYMMDD(this.initialStartDate)
      }
    });
  }
  selectPage(page: number) {
    this.pageNum = page - 1;
    this.getViolationDetails();
  }
  downloadViolationDetailedBill(val) {
    if (val === 'PDF') {
      this.violationFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.violationType = 'application/pdf';
    } else {
      this.violationFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.violationType = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadDetailedBill('', this.regNumber, this.billViolationNumber, false, this.languageType, val)
      .subscribe(data => {
        downloadFile(this.violationFileName, this.violationType, data);
      });
  }
  printViolationDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.regNumber, this.billViolationNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
