/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
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
  AlertService,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GccCountry, GccCurrencyLabel, CurrencyArabicShortForm, LanguageTypeEnum } from '../../../../shared/enums';
import {
  BillDetails,
  DetailedBillViolationDetails,
  EstablishmentHeader,
  GccCurrency,
  ItemizedBillDetailsWrapper,
  ItemizedInstallmentWrapper,
  ItemizedLateFee,
  ItemizedRejectedOHWrapper
} from '../../../../shared/models';
import {
  BillDashboardService,
  BillingRoutingService,
  ContributionPaymentService,
  ReportStatementService,
  DetailedBillService
} from '../../../../shared/services';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import moment from 'moment';
import { BehaviorSubject, noop } from 'rxjs';
import { ItemizedLateFeeWrapper } from '../../../../shared/models/itemized-late-fee-wrapper';
@Component({
  selector: 'blg-latefee-detailed-bill-sc',
  templateUrl: './latefee-detailed-bill-sc.component.html',
  styleUrls: ['./latefee-detailed-bill-sc.component.scss']
})
export class LatefeeDetailedBillScComponent implements OnInit {
  exchangeRate = 1;
  noOfDays: number;
  selectedDate: string;
  billStartDate: string;
  billDetails: BillDetails = new BillDetails();
  currentCurrency: GccCurrency = new GccCurrency();
  isGccCountry = false;
  itemizedBillList: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  idNumber: number;
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  isAdmin = false;
  billNumber: number;
  gccCurrencyList: LovList;
  currencyList: GccCurrency[] = [];
  gccCountry: string;
  currencyValue: BilingualText = new BilingualText();
  currentValue: string;
  isInitial = false;
  enityType = 'ESTABLISHMENT';
  lateFeeDetails: ItemizedLateFeeWrapper = new ItemizedLateFeeWrapper();
  pageNo = 0;
  pageSize = 10;
  isMofFlag = false;
  lang = 'en';
  languageType: string;
  lateFeeType: string;
  lateFeeFileName: string;
  violationDetails: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  tabitemDetails;
  Url: string;
  selectedTabName: string;
  billIssueDate: string;
  errorMessage: BilingualText = new BilingualText();
  isBillNumber = false;
  initialStartDate: string;
  showCancelPaymentLateFeeDetails = false;
  showlateFeeEstDetails = false;
  installmentDetails: ItemizedInstallmentWrapper = new ItemizedInstallmentWrapper();
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  lateFeeEstDetails: ItemizedLateFee = new ItemizedLateFee();
  cancelPaymentDetails: ItemizedLateFee = new ItemizedLateFee();
  /**
   *
 * Creates an instance of LatefeeDetailedBillScComponent

   * @param lookUpService
   * @param storageService
   * @param establishmentBillService
   * @param route
   */
  constructor(
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly detailedBillService: DetailedBillService,
    readonly reportStatementService: ReportStatementService,
    readonly exchangeRateService: ExchangeRateService,
    readonly billingRoutingService: BillingRoutingService,
    readonly billDashboardService: BillDashboardService,
    readonly contributionPaymentService: ContributionPaymentService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  /**
   * This method handles initialization tasks.
   *
   * @memberof BillingScComponent
   */
  ngOnInit() {
    this.currency.subscribe(currentCurrencyKey => {
      this.currentValue = currentCurrencyKey;
      if (this.isInitial && currentCurrencyKey) {
        this.currencyValueChange(currentCurrencyKey);
      }
    }, noop);
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params.monthSelected;
      this.billNumber = params.billNumber;
      this.billIssueDate = params.billIssueDate;
      this.isMofFlag = params.mofFlag;
      this.idNumber = params.registerNo;
      this.initialStartDate = params.billStartDate;
    }, noop);
    this.currentCurrency.label = GccCurrencyLabel.SAR;
    this.currentCurrency.code.value = BillingConstants.CURRENCY_SAR;
    this.lookUpService.getGccCurrencyList().subscribe(res => {
      this.gccCurrencyList = res;
    }, noop);
    //TODO Can we use appTokens
    this.isAdmin = true;
    this.idNumber = this.establishmentRegistrationNo.value;
    this.getBillBreakUpServiceDetails(this.idNumber);
    this.getBillingHeaderServiceDetails(this.idNumber);
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
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUpServiceDetails(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDate, this.enityType)
      .subscribe((res: BillDetails) => {
        this.billDetails = res;
        if (res.initialBillStartDate?.gregorian < res.ameenStartDate?.gregorian)
          this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.ameenStartDate?.gregorian)?.toString());
        else this.initialStartDate = convertToYYYYMMDD(startOfMonth(res.initialBillStartDate?.gregorian)?.toString());
        this.billStartDate = convertToYYYYMMDD(startOfMonth(res.latestBillStartDate?.gregorian)?.toString());
        this.getInstallmentDetails();
        this.getViolationDetails();
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
        this.getItemizedLateFeeDetails();
        this.getItemizedEstLateFeeDetails();
        this.getItemizedCancelPaymentLateFee();
      }, noop);
  }
  /**
   * This method to call itemized contribution Service
   * @param idNo Identification Number
   */
  getItemizedLateFeeDetails() {
    this.detailedBillService
      .getItemizedLateFee(this.idNumber, this.billNumber, this.pageNo, this.pageSize)
      .subscribe(responseData => {
        this.lateFeeDetails = responseData;
      }, noop);
  }
  getItemizedEstLateFeeDetails() {
    this.reportStatementService.getItemizedLateEstFee(this.idNumber, this.billNumber).subscribe(
      res => {
        this.showlateFeeEstDetails = true;
        this.lateFeeEstDetails = res;
      },
      err => {
        if (err.error.message.english === 'No records found.') {
          this.showlateFeeEstDetails = false;
        } else {
          this.alertService.showError(err.error.message);
        }
      }
    );
  }
  getItemizedCancelPaymentLateFee() {
    this.reportStatementService.getCancelPaymentLateFee(this.idNumber, this.billNumber).subscribe(
      res => {
        this.showCancelPaymentLateFeeDetails = true;
        this.cancelPaymentDetails = res;
      },
      err => {
        if (err.error.message.english === 'No records found.') {
          this.showCancelPaymentLateFeeDetails = false;
        } else {
          this.alertService.showError(err.error.message);
        }
      }
    );
  }
  /**
   * This method is to call service for Bill Summary
   */
  getDashboardBillDetailsForLatefee() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDate,
      this.billNumber,
      false,
      this.initialStartDate,
      this.idNumber
    );
    this.getBillBreakUpServiceDetails(this.idNumber);
  }

  /**
   * This method is to get bill details on selected date
   */
  getLatefeeBillDetailsOnSelectedDate(dateValue: string) {
    this.pageNo = 0;
    this.selectedDate = convertToYYYYMMDD(startOfMonth(moment(dateValue).toDate()).toString());
    if (this.selectedDate) {
      this.detailedBillService.getBillNumber(this.idNumber, this.selectedDate).subscribe(
        res => {
          this.billNumber = res.bills[0].billNumber;
          this.isBillNumber = false;
          this.getInstallmentDetails();
          this.getViolationDetails();
          this.detailedBillService
            .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
            .subscribe(responseData => {
              this.rejectedOHDetails = responseData;
              if (this.rejectedOHDetails) this.getTabsetValues();
            });
          this.detailedBillService
            .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.enityType)
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
              if (this.billDetails.totalLateFee === 0) {
                if (this.billDetails.totalDebitAdjustment !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
                } else if (this.billDetails.totalReceiptsAndCredits !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
                } else if (this.billDetails.totalContribution !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
                } else if (this.violationDetails.totalViolationAmountAggregate > 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
                } else if (this.rejectedOHDetails.amount !== 0) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
                } else if (this.installmentDetails.currentInstallmentAmount !== null) {
                  this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
                }
                this.router.navigate([this.Url], {
                  queryParams: {
                    monthSelected: convertToYYYYMMDD(this.selectedDate),
                    mofFlag: this.isMofFlag,
                    registerNo: this.idNumber,
                    billNumber: this.billNumber,
                    billStartDate: convertToYYYYMMDD(this.initialStartDate)
                  }
                });
              }
              this.getItemizedLateFeeDetails();
              this.getItemizedEstLateFeeDetails();
              this.getItemizedCancelPaymentLateFee();
              this.getTabsetValues();
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
   * This method is to navigate to new tabs
   */
  goToNewTab(selectedTab: string) {
    if (selectedTab === 'BILLING.DEBIT-ADJUSTMENTS') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    }
    if (selectedTab === 'BILLING.CONTRIBUTION' || selectedTab === 'BILLING.CURRENT-MONTH-CONTRIBUTION') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    }
    if (selectedTab === 'BILLING.RECEIPTS-AND-CREDITS' || selectedTab === 'BILLING.CREDIT-ADJUSTMENTS')
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (selectedTab === 'BILLING.LATE-PAYMENT-FEES') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    }
    if (selectedTab === 'BILLING.REJECTED-OH-CLAIMS') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    }
    if (selectedTab === 'BILLING.INSTALLMENT') {
      this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    if (selectedTab === 'BILLING.VIOLATIONS') this.Url = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
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

  /**
   * This method to get tabset
   * @param billDetails
   */

  getTabsetValues() {
    this.tabitemDetails = [];
    if (this.billDetails) {
      this.tabitemDetails.push({
        tabName: this.isMofFlag ? 'BILLING.CURRENT-MONTH-CONTRIBUTION' : 'BILLING.CONTRIBUTION',
        amount: this.billDetails.totalContribution
      });
      this.tabitemDetails.push({
        tabName: 'BILLING.DEBIT-ADJUSTMENTS',
        amount: this.billDetails.totalDebitAdjustment
      });
      this.tabitemDetails.push({
        tabName: this.isMofFlag ? 'BILLING.CREDIT-ADJUSTMENTS' : 'BILLING.RECEIPTS-AND-CREDITS',
        amount: this.isMofFlag ? this.billDetails.totalCreditAdjustment : this.billDetails.totalReceiptsAndCredits
      });

      if (this.billDetails.totalLateFee > 0) {
        this.tabitemDetails.push({
          tabName: 'BILLING.LATE-PAYMENT-FEES',
          amount: this.billDetails.totalLateFee
        });
      }
    }
    if (this.rejectedOHDetails.amount > 0) {
      this.tabitemDetails.push({
        tabName: 'BILLING.REJECTED-OH-CLAIMS',
        amount: this.rejectedOHDetails?.amount
      });
    }
    if (this.installmentDetails.currentInstallmentAmount !== null) {
      this.tabitemDetails.push({
        tabName: 'BILLING.INSTALLMENT',
        amount: this.installmentDetails?.currentInstallmentAmount
      });
    }
    if (this.violationDetails.totalViolationAmountAggregate > 0) {
      this.tabitemDetails.push({
        tabName: 'BILLING.VIOLATIONS',
        amount: this.violationDetails?.totalViolationAmountAggregate
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
  getBillingHeaderServiceDetails(idNo: number) {
    this.isInitial = true;
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
      if (this.currentValue !== BillingConstants.CURRENCY_SAR.english && this.currentValue === this.gccCountry) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.gccCountry, currentDate)
          .subscribe(key => {
            this.exchangeRate = key;
            this.currencyValue.english = this.gccCountry;
            this.currencyValue.arabic = CurrencyArabicShortForm[this.currencyValue.english];
          }, noop);
      } else {
        this.currencyValue = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    }, noop);
  }

  currencyValueChange(selectedValue: string) {
    if (
      this.currencyValue.english !== selectedValue &&
      selectedValue === this.gccCountry &&
      this.isGccCountry &&
      selectedValue !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, selectedValue, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencyValue.english = selectedValue;
          this.currencyValue.arabic = CurrencyArabicShortForm[selectedValue];
        }, noop);
    } else {
      if (selectedValue === BillingConstants.CURRENCY_SAR.english) {
        this.currencyValue.english = BillingConstants.CURRENCY_SAR.english;
        this.currencyValue.arabic = BillingConstants.CURRENCY_SAR.arabic;
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencyValue = this.currencyValue;
      }
    }
  }
  /**
   * This method is to select the page number on pagination
   */
  getselectPage(selectedpageNo: number) {
    this.pageNo = selectedpageNo;
    this.getItemizedLateFeeDetails();
  }
  downloadLatefeeDetailedBill(val) {
    if (val === 'PDF') {
      this.lateFeeFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_AR;
      this.lateFeeType = 'application/pdf';
    } else {
      this.lateFeeFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_ENG
          : ReportConstants.PRINT_ITEMIZED_BILL_FILE_NAME_EXCEL_AR;
      this.lateFeeType = 'application/vnd.ms-excel';
    }
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, val)
      .subscribe(data => {
        downloadFile(this.lateFeeFileName, this.lateFeeType, data);
      });
  }
  printLatefeeDetailedBill() {
    this.reportStatementService
      .downloadDetailedBill('', this.idNumber, this.billNumber, false, this.languageType, 'PDF')
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
