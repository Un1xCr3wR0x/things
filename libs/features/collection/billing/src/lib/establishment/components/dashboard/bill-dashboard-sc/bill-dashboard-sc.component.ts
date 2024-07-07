/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  convertToYYYYMMDD,
  CurrencyToken,
  downloadFile,
  endOfMonth,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  RegistrationNoToken,
  RegistrationNumber,
  startOfMonth,
  StorageService,
  subtractMonths
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BillingConstants, ReportConstants, RouteConstants } from '../../../../shared/constants';
import { CoverageConstants } from '../../../../shared/constants/coverage-constants';
import {
  CurrencyArabicShortForm,
  GccCountry,
  GccCurrencyLabel,
  LanguageTypeEnum,
  Months,
  MonthsArabicLabels
} from '../../../../shared/enums';
import {
  BalanceSummary,
  BillDetails,
  BillHistory,
  CreditBalanceDetails,
  DetailedBillViolationDetails,
  EstablishmentHeader,
  EstablishmentShare,
  ItemizedRejectedOHWrapper
} from '../../../../shared/models';
import {
  BillDashboardService,
  BillingRoutingService,
  ContributionPaymentService,
  CreditManagementService,
  DetailedBillService,
  ReportStatementService
} from '../../../../shared/services';

@Component({
  selector: 'blg-bill-dashboard-sc',
  templateUrl: './bill-dashboard-sc.component.html',
  styleUrls: ['./bill-dashboard-sc.component.scss']
})
export class BillDashboardScComponent extends BaseComponent implements OnInit, OnDestroy {
  /** Local Variables */
  billDetails: BillDetails = new BillDetails();
  showComplianceButton = false;
  billHistoryDetails: BillHistory[] = [];
  accountSummary: BalanceSummary[] = [];
  idNumber: number;
  rejectedOhDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  billNumber = 0;
  establishmentHeaderValue: EstablishmentHeader = new EstablishmentHeader();
  isHeader = false;
  isAdmin = false;
  heading = '';
  identificationNo: number;
  isGccCountry: boolean;
  exchangeRate = 1;
  contributorId = new FormControl();
  establishmentList: LovList;
  establishmentListForm: FormGroup;
  establishment: Lov[] = [];
  itemizedDataFlag = false;
  isMofFlag = false;
  noOfDays: number;
  monthSelectedDate: string;
  currencyValue = 'SAR';
  fileName: string;
  type: string;
  currencyType: BilingualText = new BilingualText();
  currentCurrency: string;
  initialValue = false;
  selectedValue: string;
  entityType = 'ESTABLISHMENT';
  isAppPrivate: boolean;
  errorFlag = false;
  isSearch = false;
  isFirstSerach = false;
  isBillNumber = false;
  isFirstLoad = false;
  initialStartDate: Date;
  latestBillStartDate: Date;
  errorMessage: BilingualText = new BilingualText();
  isNoBill = false;
  lang = 'en';
  languageType: string;
  isDisabled = false;
  isNoBillMonth = false;
  startDate: Date;
  isMigratedBill = false;
  ameenReleaseDate;
  violationDetails: DetailedBillViolationDetails = new DetailedBillViolationDetails();
  initialLoad = false;
  creditBalanceDetails: CreditBalanceDetails;
  totalCreditBalance = 0;
  violationCount = 0;
  employerShare: EstablishmentShare;
  billBatchIndicator;
  downloadFileName: string;
  downloadType: string;
  lawType: BilingualText;
  isPPA: boolean;
  billStartDate: Date;
  /**
   *
 * Creates an instance of BillingScComponent

   * @param lookUpService
   * @param storageService
   * @param establishmentBillService
   * @param route
   */
  constructor(
    readonly lookUpService: LookupService,
    readonly storageService: StorageService,
    readonly billDashboardService: BillDashboardService,
    readonly reportStatementService: ReportStatementService,
    readonly detailedBillService: DetailedBillService,
    readonly contributionPaymentService: ContributionPaymentService,
    readonly billingRoutingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    readonly exchangeRateService: ExchangeRateService,
    private fb: FormBuilder,
    readonly router: Router,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly creditManagementService: CreditManagementService
  ) {
    super();
  }
  /**
   * This method handles initialization tasks.
   *
   * @memberof BillingScComponent
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    this.initialiseWithRoute();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.idNumber = this.establishmentRegistrationNo.value;
    this.currency.subscribe(key => {
      this.selectedValue = key;
      if (key) {
        this.currencyExchange(key);
      }
    });
    this.language.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
      this.getMonth(moment(startOfMonth(new Date(), true)).subtract(1, 'month').toDate());
    });
    this.billDashboardService.paymentReceiptOrigin = false;
    this.establishmentListForm = this.createEstablishmentListForm();
    this.currencyValue = GccCurrencyLabel.SAR;
    this.isAdmin = true;
    this.billDashboardService.registartionNo = this.idNumber;
    this.route.queryParams.subscribe(params => {
      this.isSearch = params.isSearch;  
      if (params.monthSelected && params.billNumber) {
        this.monthSelectedDate = params.monthSelected;      
        this.billNumber = params.billNumber;
        this.startDate = params.billStartDate;
        this.idNumber = params.registerNo;
        this.getBillNumber(this.idNumber, false);
        this.calculateEmployerShare(new Date(this.monthSelectedDate));
        this.getBillWidgets();
      } else {
        this.initialLoad = true;
        this.monthSelectedDate = convertToYYYYMMDD(String(startOfMonth(new Date(), true).toString()));
        this.calculateEmployerShare(new Date(this.monthSelectedDate));
        if (this.idNumber) {
          this.getAvailableBalanceDetails(this.idNumber);
          this.getBillNumber(this.idNumber, true);
        }
      }
    });
  }
  getViolationCount(selectedDate) {
    const enddate = convertToYYYYMMDD(endOfMonth(new Date(selectedDate)).toString());
    this.reportStatementService
      .getViolationAdjustmentDetails(this.idNumber, selectedDate, enddate, 'Increase', 1, 10)
      .subscribe(val => {
        this.violationCount = val.violatedContributorsCount;
      });
  }
  initialiseWithRoute() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params && params.get('registrationNo')) {
        this.getBillDetails(Number(params.get('registrationNo')));
        this.establishmentRegistrationNo.value = Number(params.get('registrationNo'));
      }
    });
  }
  getRejectedOhDetails(selectedOhDate) {
    this.detailedBillService.getRejectedOHDetails(this.idNumber, selectedOhDate, 0, 10).subscribe(data => {
      this.rejectedOhDetails = data;
    });
  }
  //get violatoin summary for chart
  getviolationDetails(selectedViolationDate) {
    const endDate = convertToYYYYMMDD(String(endOfMonth(moment(new Date(selectedViolationDate)).toDate())));
    this.detailedBillService.getViolationDetails(this.idNumber, selectedViolationDate, endDate).subscribe(violation => {
      this.violationDetails = violation;
    });
  }
  /***
   * Method to get billdetails
   */
  getBillDetails(idNumber) {
    if (idNumber) {
      this.getAvailableBalanceDetails(idNumber);
      this.detailedBillService.getBillingHeader(idNumber, true).subscribe(
        res => {
          if (res) {
            this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, idNumber);
            this.idNumber = idNumber;
            this.billDashboardService.registartionNo = idNumber;
            this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1), true).toString());
            this.getBillNumber(idNumber, true);
            this.errorFlag = false;
          }
        },
        err => {
          this.errorFlag = true;
          this.isSearch = false;
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /** This method is to get Bill Widgets */
  getBillWidgets() {
    if (!this.isAdmin) {
      this.idNumber = Number(this.contributorId.value);
    }
    this.getBillBreakUpService(this.idNumber);

    //TODO: Remove the check once get contributor is done
    if (this.isAdmin) {
      this.getBillingHeaderDetails(this.idNumber);
    } else {
      this.isHeader = true;
      this.isGccCountry = false;
    }
  }

  /**
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUpService(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.monthSelectedDate, this.entityType)
      .pipe(
        map(details => {
          this.isMigratedBill = details.migratedBill;
          this.ameenReleaseDate = details.ameenReleaseDate;
          this.billStartDate = details.billStartDate.gregorian;
          details?.billBreakUp.adjustmentBreakUp?.adjustmentDetails?.forEach(item => {
            if (item?.adjustmentType?.english === 'Violation Adjustment' && item?.amount > 0) {
              item.noOfContributor = this.violationCount;
            }
          });
          return details;
        })
      )
      .subscribe((res: BillDetails) => {
        this.billDetails = res;
        this.initialStartDate = res.billStartDate?.gregorian;
        this.latestBillStartDate = res.latestBillStartDate?.gregorian;
        if (this.idNumber && this.initialStartDate) {
          this.getRejectedOhDetails(convertToYYYYMMDD(String(startOfMonth(this.initialStartDate, true).toString())));
          this.getviolationDetails(convertToYYYYMMDD(String(startOfMonth(this.initialStartDate, true).toString())));
          this.getViolationCount(convertToYYYYMMDD(String(startOfMonth(this.initialStartDate, true).toString())));
        }
      });
  }
  navigateToViewRecords() {
    this.router.navigate([RouteConstants.ROUTE_VIEW_RECORD]);
  }

  getMonth(date) {
    const dateVal = new Date(date);
    const nextMonthEn = this.getMonthFromDate(dateVal);
    const nextMonthAr = this.getArabicMonth(dateVal);
    if (this.billBatchIndicator) {
      if (this.lang === 'en') {
        this.alertService.setInfoByKey('BILLING.GENERATION-IN-PROGRESS', { month: nextMonthEn });
      } else this.alertService.setInfoByKey('BILLING.GENERATION-IN-PROGRESS', { month: nextMonthAr });
    }
  }
  getMonthFromDate(date: Date) {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
  getArabicMonth(date: Date) {
    return Object.values(MonthsArabicLabels)[moment(date).toDate().getMonth()];
  }
  /**
   * This method to set Bill Number
   * @param idNo Identification Number
   */
  getBillNumber(idNo: number, pageLoad) {
    this.detailedBillService.getBillNumber(idNo, this.monthSelectedDate, pageLoad).subscribe(
      res => {
        this.billNumber = res.bills[0].billNumber;
        this.billBatchIndicator = res.billBatchIndicator;
        this.getMonth(moment(startOfMonth(new Date(), true)).subtract(1, 'month').toDate());
        this.isNoBill = false;
        this.getBillWidgets();
      },
      err => {
        this.errorMessage = err.error.message;
        if (this.errorMessage?.english === BillingConstants.ERROR_MESSAGE_MONTH) this.isNoBillMonth = true;
        else if (this.errorMessage?.english === BillingConstants.ERROR_MESSAGE) this.isDisabled = true;
        this.isNoBill = true;
      }
    );
  }
  downloadBillTransaction(val) {
    if (val === 'PDF') {
      this.downloadFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_BILL_DASBOARD_FILE_NAME_EN
          : ReportConstants.PRINT_BILL_DASBOARD_FILE_NAME_AR;
      this.downloadType = 'application/pdf';
    } else {
      this.downloadFileName =
        this.languageType === 'ENGLISH'
          ? ReportConstants.PRINT_BILL_DASBOARD_FILE_EXCEL_EN
          : ReportConstants.PRINT_BILL_DASBOARD_FILE_EXCEL_AR;
      this.downloadType = 'application/vnd.ms-excel';
    }

    this.reportStatementService
      .generateBillReport(this.monthSelectedDate, this.idNumber, this.billNumber, this.isMofFlag, this.languageType)
      .subscribe(data => {
        downloadFile(this.downloadFileName, this.downloadType, data);
      });
  }

  printBillTransaction() {
    this.reportStatementService
      .generateBillReport(this.monthSelectedDate, this.idNumber, this.billNumber, this.isMofFlag, this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  /**
   * This method is to call service for Bill Summary
   */
  getBillingSummary(eventValue: Date) {
    this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL + '/' + 'contribution'], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(String(startOfMonth(eventValue, true).toString())),
        billNumber: this.billNumber,
        billStartDate: convertToYYYYMMDD(this.initialStartDate?.toString()),
        registerNo: this.idNumber
      }
    });
  }

  /**
   * This method is to get bill details on selected date
   */
  getBillDetailsOnSelectedDate(dateValue: string) {
    const date = new Date(dateValue);
    this.calculateEmployerShare(date);
    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(moment(date, 'YYYY-MM-DD').toDate(), true).toString());
    if (this.monthSelectedDate) {
      if (this.detailedBillService.getBillOnMonthChanges !== undefined)
        this.detailedBillService.getBillOnMonthChanges(this.idNumber, this.monthSelectedDate, false).subscribe(
          res => {
            if (res.bills[0]) {
              this.billNumber = res.bills[0].billNumber;
              this.isBillNumber = false;
              this.isNoBill = false;
            } else this.isBillNumber = true;
            if (!this.isBillNumber) {
              this.detailedBillService
                .getBillBreakup(this.idNumber, this.billNumber, this.monthSelectedDate, this.entityType)
                .pipe(
                  map(details => {
                    this.isMigratedBill = details.migratedBill;
                    this.ameenReleaseDate = details.ameenReleaseDate;
                    details?.billBreakUp?.adjustmentBreakUp?.adjustmentDetails.forEach(item => {
                      if (item?.adjustmentType?.english === 'Violation Adjustment' && item?.amount > 0) {
                        item.noOfContributor = this.violationCount;
                      }
                    });
                    return details;
                  })
                )
                .subscribe((response: BillDetails) => {
                  this.billDetails = response;
                  this.convertCurreny(this.billDetails?.issueDate?.gregorian);
                });
            }
          },
          err => {
            this.errorMessage = err.error.message;
            if (this.errorMessage.english === BillingConstants.ERROR_MESSAGE_MONTH) this.isNoBillMonth = true;
            else if (this.errorMessage.english === BillingConstants.ERROR_MESSAGE) this.isDisabled = true;
            this.isNoBill = true;
          }
        );
      this.getRejectedOhDetails(this.monthSelectedDate);
      this.getviolationDetails(this.monthSelectedDate);
    }
  }
  /**
   * This method is to call Billing Header service
   * @param idNo Identification Number
   */
  getBillingHeaderDetails(idNo: number) {
    this.errorFlag = false;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.isHeader = true;
      this.establishmentHeaderValue = res;
      this.establishmentRegistrationNo.isGcc = res.gccCountry;
      this.lawType = res.lawType;
      this.isPPA = res.ppaEstablishment;
      this.establishment.push({
        value: {
          english: this.establishmentHeaderValue.name.english
            ? this.establishmentHeaderValue.name.english
            : this.establishmentHeaderValue.name.arabic,
          arabic: this.establishmentHeaderValue.name.arabic
        },
        sequence: 1
      });
      this.establishmentList = new LovList(this.establishment);
      this.establishmentListForm
        .get('establishmentName')
        .get('english')
        .setValue(
          this.establishmentHeaderValue.name.english
            ? this.establishmentHeaderValue.name.english
            : this.establishmentHeaderValue.name.arabic
        );
      this.isGccCountry = res.gccCountry;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country.english) {
            this.currentCurrency = data;
          }
        });
      }
      this.convertCurreny(this.billDetails.issueDate?.gregorian || new Date());
    });
  }

  convertCurreny(date: string | Date) {
    if (this.selectedValue !== BillingConstants.CURRENCY_SAR.english && this.currentCurrency === this.selectedValue) {
      const currentDate = moment(date).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.currentCurrency, currentDate)
        .subscribe(key => {
          this.exchangeRate = key;
          this.currencyType = {
            english: this.currentCurrency,
            arabic: CurrencyArabicShortForm[this.currencyType.english]
          };
        });
    } else {
      this.currencyType = BillingConstants.CURRENCY_SAR;
      this.exchangeRate = 1;
    }
  }
  getAvailableBalanceDetails(regNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(regNumber).subscribe(
      datas => {
        if (datas && datas?.totalCreditBalance > 0) {
          this.totalCreditBalance = datas.totalCreditBalance;
        }
      },
      errs => {
        this.alertService.showError(errs.error.message);
      }
    );
  }
  /** Method to create establishment list form. */
  createEstablishmentListForm() {
    return this.fb.group({
      establishmentName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  goToReceiptHistory() {
    this.router.navigate([BillingConstants.ROUTE_RECIEPT], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.billStartDate.toString()),
        billNumber: this.billNumber,
        isSearch: true,
        initialStartDate: convertToYYYYMMDD(this.initialStartDate.toString()),
        registerNo: this.idNumber
      }
    });
    this.billDashboardService.paymentReceiptOrigin = true;
  }

  navigateToBillHistory() {
    this.billingRoutingService.navigateToBillHistory();
  }
  /**
   * Method to calculate exchange rate
   * @param newSelectedCurrency
   */
  currencyExchange(selectedCurrency: string) {
    if (
      this.currencyType.english !== selectedCurrency &&
      selectedCurrency === this.currentCurrency &&
      this.isGccCountry &&
      selectedCurrency !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(this.billDetails?.issueDate?.gregorian || new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, selectedCurrency, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencyType = { english: selectedCurrency, arabic: CurrencyArabicShortForm[selectedCurrency] };
        });
    } else {
      if (selectedCurrency === BillingConstants.CURRENCY_SAR.english) {
        this.currencyType = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencyType = this.currencyType;
      }
    }
  }

  /**
   * Method to calculate employer share
   * @param dateSelected
   */
  calculateEmployerShare(dateSelected: Date) {
    this.employerShare = {
      ui: CoverageConstants.UI_PERCENT(this.isMofFlag, new Date(dateSelected)),
      annuity: CoverageConstants.ANNUITY_PERCENT(this.isMofFlag),
      oh: CoverageConstants.OH_PERCENT(this.isMofFlag),
      ppaAnnuity: CoverageConstants.PPA_PERCENT(this.isMofFlag),
      prAnnuity: CoverageConstants.PENSION_PERCENT(this.isMofFlag),
    };
  }
  //  * Method to destroy all errors */
  ngOnDestroy() {
    this.alertService.clearAlerts();
    super.ngOnDestroy();
  }
}
