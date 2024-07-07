import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, noop } from 'rxjs';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import { CurrencyArabicShortForm, GccCountry, LanguageTypeEnum } from '../../../../shared/enums';
import { BillingRoutingService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
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
import {
  BillDetails,
  DetailedBillViolationDetails,
  EstablishmentHeader,
  GccCurrency,
  ItemizedBillDetailsWrapper,
  ItemizedInstallmentWrapper,
  ItemizedRejectedOHWrapper
} from '../../../../shared/models';

@Component({
  selector: 'blg-installment-detailed-bill-sc',
  templateUrl: './installment-detailed-bill-sc.component.html',
  styleUrls: ['./installment-detailed-bill-sc.component.scss']
})
export class InstallmentDetailedBillScComponent implements OnInit {
  currentKeys: string;
  isInitialkey = false;
  enityType = 'ESTABLISHMENT';
  billNumber: number;
  routeUrl: string;
  noOfDays: number;
  billDetails: BillDetails = new BillDetails();
  billStartDate: string;
  billIssueDate: string;
  selectedDateValue: string;
  tabItems = [];
  pageNumber = 0;
  instFileName: string;
  instType: string;
  pageSize = 10;
  lang = 'en';
  languageType: string;
  isAdmin = true;
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  isBillResponse = false;
  establishmentHeaderDetails: EstablishmentHeader = new EstablishmentHeader();
  isGccCountry = false;
  gccCountry: string;
  violationDetail: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  itemizedBills: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  exchangeRateValue = 1;
  idNumber: number;
  isBillNumber = false;
  errorMessage: BilingualText = new BilingualText();
  isMofFlag = false;
  initialStartDate: string;
  currentCurrencyDetails: GccCurrency = new GccCurrency();
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  currencyKeys: BilingualText = new BilingualText();

  constructor(
    readonly route: ActivatedRoute,
    readonly detailedBillService: DetailedBillService,
    readonly reportStatementService: ReportStatementService,
    readonly billingRoutingService: BillingRoutingService,
    readonly storageService: StorageService,
    readonly lookUpService: LookupService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly exchangeRateService: ExchangeRateService,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.billNumber = params.billNumber;
        this.billIssueDate = params.billIssueDate;
        this.selectedDateValue = params.monthSelected;
        this.idNumber = params.registerNo;
        this.isMofFlag = params.mofFlag;
        this.initialStartDate = params.billStartDate;
      } else {
        this.idNumber = this.establishmentRegistrationNo.value;
      }
    }, noop);
    this.currency.subscribe(currentCurrencyKey => {
      this.currentKeys = currentCurrencyKey;
      if (this.isInitialkey && currentCurrencyKey) {
        this.onCurrencyValueChange(currentCurrencyKey);
      }
    }, noop);

    this.getBillingHeadingValue(this.idNumber);
    this.getBillBreakUp(this.idNumber);
  }
  /**
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUp(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDateValue, this.enityType)
      .subscribe((res: BillDetails) => {
        this.getViolationDetail();
        this.getInstallmentDetails();
        this.billDetails = res;
        if (res.initialBillStartDate?.gregorian < res.ameenStartDate?.gregorian)
          this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.ameenStartDate?.gregorian)?.toString());
        else this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.initialBillStartDate?.gregorian)?.toString());
        this.billStartDate = convertToYYYYMMDD(startOfMonth(res.latestBillStartDate?.gregorian)?.toString());
        this.detailedBillService
          .getRejectedOHDetails(this.idNumber, this.selectedDateValue, this.pageNumber, this.pageSize)
          .subscribe(
            responseData => {
              this.rejectedOHDetails = responseData;
              if (this.rejectedOHDetails) this.getTabsetDetails();
            },
            () => {
              this.getTabsetDetails();
            }
          );
      }, noop);
  }
  /**
   * This method is to get installment details on selected date
   */
  getInstallmentDetails() {
    this.detailedBillService.getInstallmentDetails(this.idNumber, this.selectedDateValue).subscribe(
      responseData => {
        this.installmentDetails = responseData;
        if (this.installmentDetails.currentInstallmentAmount === null) {
          this.routeToAvailableTabs();
        } else {
          this.getTabsetDetails();
        }
      },
      () => {
        this.getTabsetDetails();
      }
    );
  }
  /**
   * This method is to get bill details on selected date
   */
  getInstallmentDetailsOnSelectedDate(dateValue: string) {
    this.pageNumber = 0;
    this.selectedDateValue = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    if (this.selectedDateValue) {
      this.detailedBillService.getBillNumber(this.idNumber, this.selectedDateValue).subscribe(
        res => {
          this.isBillNumber = false;
          this.billNumber = res.bills[0].billNumber;
          this.detailedBillService
            .getBillBreakup(this.idNumber, this.billNumber, this.selectedDateValue, this.enityType)
            .subscribe((response: BillDetails) => {
              if (response.initialBillStartDate?.gregorian < response.ameenStartDate?.gregorian)
                this.initialStartDate = convertToYYYYMMDD(startOfMonth(response.ameenStartDate?.gregorian)?.toString());
              else
                this.initialStartDate = convertToYYYYMMDD(
                  startOfMonth(response.initialBillStartDate?.gregorian)?.toString()
                );
              this.billDetails = response;
              this.getInstallmentDetails();
              this.getViolationDetail();
              this.detailedBillService
                .getRejectedOHDetails(this.idNumber, this.selectedDateValue, this.pageNumber, this.pageSize)
                .subscribe(responseData => {
                  this.rejectedOHDetails = responseData;
                  if (this.rejectedOHDetails) this.getTabsetDetails();
                });
              if (this.installmentDetails.currentInstallmentAmount === null) {
                this.routeToAvailableTabs();
              } else this.getTabsetDetails();
            }, noop);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isBillNumber = true;
        }
      );
    }
  }
  //menthod to route to tab with data
  routeToAvailableTabs() {
    if (this.billDetails.totalContribution !== 0) {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    } else if (this.billDetails.totalDebitAdjustment !== 0) {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    } else if (this.billDetails.totalReceiptsAndCredits !== 0) {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    } else if (this.violationDetail.totalViolationAmountAggregate > 0) {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
    } else if (this.rejectedOHDetails.amount !== 0) {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    } else if (this.installmentDetails.currentInstallmentAmount !== null) {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    } else {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    }
    this.router.navigate([this.routeUrl], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDateValue),
        billNumber: this.billNumber,
        mofFlag: this.isMofFlag,
        registerNo: this.idNumber,
        billStartDate: convertToYYYYMMDD(this.initialStartDate)
      }
    });
  }

  getTabsetDetails() {
    this.tabItems = [];
    if (this.billDetails) {
      this.tabItems.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.billDetails.totalContribution
      });
      this.tabItems.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.billDetails.totalDebitAdjustment
      });

      this.tabItems.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });

      if (this.billDetails.totalLateFee > 0) {
        this.tabItems.push({
          tabName: 'BILLING.LATE-PAYMENT-FEES',
          amount: this.billDetails.totalLateFee
        });
      }
      if (this.rejectedOHDetails.amount > 0) {
        this.tabItems.push({
          tabName: 'BILLING.REJECTED-OH-CLAIMS',
          amount: this.rejectedOHDetails.amount
        });
      }
      if (this.installmentDetails.currentInstallmentAmount !== null) {
        this.tabItems.push({
          tabName: 'BILLING.INSTALLMENT',
          amount: this.installmentDetails.currentInstallmentAmount
        });
      }
      if (this.violationDetail.totalViolationAmountAggregate > 0) {
        this.tabItems.push({
          tabName: 'BILLING.VIOLATIONS',
          amount: this.violationDetail.totalViolationAmountAggregate
        });
      }
    }
  }
  /**
   * This method to get tabset
   * @param billDetails
   */
  /**
   * This method is to call service for Bill Summary
   */
  getDashboardBillItemsForRejectedOH() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDateValue,
      this.billNumber,
      false,
      this.initialStartDate,
      this.idNumber
    );
    this.getBillBreakUp(this.idNumber);
  }

  /**
   * This method is to get installment details on selected date
   */
  getViolationDetail() {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(this.selectedDateValue)).toDate())));
    this.detailedBillService
      .getViolationDetails(this.idNumber, this.selectedDateValue, endDate, 0, this.pageSize)
      .subscribe(
        data => {
          this.violationDetail = data;
          if (this.violationDetail) this.getTabsetDetails();
        },
        () => {
          this.getTabsetDetails();
        }
      );
  }
  /**
   * This method is to call Billing Header service
   * @param idNo Identification Number
   */
  getBillingHeadingValue(idNo: number) {
    this.isInitialkey = true;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((details: EstablishmentHeader) => {
      this.establishmentHeaderDetails = details;
      this.isGccCountry = details?.gccCountry;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(val => {
          if (GccCountry[val] === details.gccEstablishment.country.english) {
            this.gccCountry = val;
          }
        });
      }
      if (this.currentKeys !== BillingConstants.CURRENCY_SAR.english && this.currentKeys === this.gccCountry) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.gccCountry, currentDate)
          .subscribe(responseData => {
            this.exchangeRateValue = responseData;
            this.currencyKeys.arabic = CurrencyArabicShortForm[this.currencyKeys.english];
            this.currencyKeys.english = this.gccCountry;
          }, noop);
      } else {
        this.exchangeRateValue = 1;
        this.currencyKeys = BillingConstants.CURRENCY_SAR;
      }
    }, noop);
  }
  onCurrencyValueChange(value: string) {
    if (
      this.currencyKeys.english !== value &&
      value === this.gccCountry &&
      value !== BillingConstants.CURRENCY_SAR.english &&
      this.isGccCountry
    ) {
      const currentDateValue = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, value, currentDateValue)
        .subscribe(res => {
          this.exchangeRateValue = res;
          this.currencyKeys.english = value;
          this.currencyKeys.arabic = CurrencyArabicShortForm[value];
        }, noop);
    } else {
      if (value === BillingConstants.CURRENCY_SAR.english) {
        this.currencyKeys.arabic = BillingConstants.CURRENCY_SAR.arabic;
        this.exchangeRateValue = 1;
        this.currencyKeys.english = BillingConstants.CURRENCY_SAR.english;
      } else {
        this.exchangeRateValue = this.exchangeRateValue;
        this.currencyKeys = this.currencyKeys;
      }
    }
  }
  /**
   * This method is to navigate to new tabs
   */
  onNavToNewTab(selectedTabs: string) {
    if (selectedTabs === 'BILLING.CONTRIBUTION' || selectedTabs === 'BILLING.CURRENT-MONTH-CONTRIBUTION') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    }
    if (selectedTabs === 'BILLING.REJECTED-OH-CLAIMS') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    }
    if (selectedTabs === 'BILLING.DEBIT-ADJUSTMENTS') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    }
    if (selectedTabs === 'BILLING.RECEIPTS-AND-CREDITS' || selectedTabs === 'BILLING.CREDIT-ADJUSTMENTS')
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (selectedTabs === 'BILLING.LATE-PAYMENT-FEES') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    }
    if (selectedTabs === 'BILLING.INSTALLMENT') {
      this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    if (selectedTabs === 'BILLING.VIOLATIONS') this.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
    this.router.navigate([this.routeUrl], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDateValue),
        mofFlag: this.isMofFlag,
        billNumber: this.billNumber,
        registerNo: this.idNumber,
        billStartDate: convertToYYYYMMDD(this.initialStartDate)
      }
    });
  }
  downloadInstallmentDetailedBill(val) {
    if (val === 'PDF') {
      this.instFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.instType = 'application/pdf';
    } else {
      this.instFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.instType = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, val)
      .subscribe(data => {
        downloadFile(this.instFileName, this.instType, data);
      });
  }
  printInstallmentDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
