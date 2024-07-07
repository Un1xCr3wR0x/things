/** * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.*/
import {
  convertToYYYYMMDD,
  ExchangeRateService,
  LookupService,
  LovList,
  startOfMonth,
  StorageService,
  endOfMonth,
  BilingualText,
  CurrencyToken,
  LanguageToken,
  AlertService,
  RegistrationNoToken,
  RegistrationNumber,
  CalendarTypeEnum,
  GosiCalendar
} from '@gosi-ui/core';
import { BillingConstants, MiscellaneousConstants } from '../../../../shared/constants';
import { GccCountry, GccCurrencyLabel, CurrencyArabicShortForm, LanguageTypeEnum } from '../../../../shared/enums';
import {
  BillingRoutingService,
  DetailedBillService, HandleDelayedPaymentService,
  MiscellaneousAdjustmentService,
  ReportStatementService
} from '../../../../shared/services';
import {
  BillDetails,
  EstablishmentHeader,
  GccCurrency,
  ItemizedBillDetailsWrapper,
  ItemizedAdjustmentWrapper,
  ItemizedReceiptWrapper,
  FilterParams,
  RequestList,
  ItemizedRejectedOHWrapper,
  ItemizedMiscRequest,
  ItemizedMiscResponse,

  ItemizedLateFeesWrapper
} from '../../../../shared/models';
import moment from 'moment';
import { Observable, BehaviorSubject, noop, throwError } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptCreditDetailedBillBaseScComponent } from '../../../../shared/components/base/receipt-credit-detailed-bill-base-sc.component';
import { CreditTransferWrapper } from '../../../../shared/models/credit-tansfer-wrapper';
import { LateFeeWaiveOff } from '../../../../shared/models/late-fee-waiveoff';
import { ThisReceiver } from '@angular/compiler';
import { catchError, filter, tap } from 'rxjs/operators';
import { MedicalInsuranceBeneficiaryDetailsWrapper} from "@gosi-ui/features/collection/billing/lib/shared/models/medical-insurance-beneficiary-details-wrapper";

@Component({
  selector: 'blg-receipt-credit-detailed-bill-sc',
  templateUrl: './receipt-credit-detailed-bill-sc.component.html',
  styleUrls: ['./receipt-credit-detailed-bill-sc.component.scss']
})
export class ReceiptCreditDetailedBillScComponent extends ReceiptCreditDetailedBillBaseScComponent implements OnInit {
  /** Local Variables */
  billDetails: BillDetails = new BillDetails();
  itemizedBillList: ItemizedBillDetailsWrapper = new ItemizedBillDetailsWrapper();
  idNumber: number;
  billStartDate: string;
  filterParams = new FilterParams();
  establishmentHeader: EstablishmentHeader = new EstablishmentHeader();
  currentCurrency: GccCurrency = new GccCurrency();
  ohRateChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  wageChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  periodChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  coverageChange: ItemizedAdjustmentWrapper = new ItemizedAdjustmentWrapper();
  ReceiptDetails: ItemizedReceiptWrapper = new ItemizedReceiptWrapper();
  creditTransferChange: CreditTransferWrapper = new CreditTransferWrapper();
  lateFeeWavierChange: LateFeeWaiveOff = new LateFeeWaiveOff();
  filterSearchDetails: RequestList = new RequestList();
  CurrencyDetails: BilingualText = new BilingualText();
  selectedCurrency: string;
  isinitialValue = false;
  isMofFlag = false;
  filterValues = new FilterParams();
  initialStartDate: string;
  errorMessage: BilingualText = new BilingualText();
  rejectedOHDetails: ItemizedRejectedOHWrapper = new ItemizedRejectedOHWrapper();
  creditTransferTotal: number;
  residentType$: Observable<LovList>; /** Observables */
  receiptSort$: Observable<LovList>;
  adjustmentSort$: Observable<LovList>;
  miscAdjustmentRequest: ItemizedMiscRequest = new ItemizedMiscRequest();
  miscAdjustmentResponse: ItemizedMiscResponse = new ItemizedMiscResponse();
  startDateCalender: GosiCalendar = new GosiCalendar();
  isCoverageRemoval = false;
  itemizedReversedLateFees: ItemizedLateFeesWrapper = new ItemizedLateFeesWrapper();
  medicalInsuranceBeneficiaryDetails:MedicalInsuranceBeneficiaryDetailsWrapper = new MedicalInsuranceBeneficiaryDetailsWrapper();
  isPPA: boolean;
  constructor(
    readonly lookUpService: LookupService /*** Creates an instance of BillingScComponent */,
    readonly storageService: StorageService,
    readonly detailedBillService: DetailedBillService,
    readonly billingRoutingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    readonly exchangeRateService: ExchangeRateService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly router: Router,
    readonly reportStatementService: ReportStatementService,
    readonly alertService: AlertService,
    readonly miscAdjustmentService: MiscellaneousAdjustmentService,
    readonly handleDelayedPaymentService: HandleDelayedPaymentService
  ) {
    super(alertService, detailedBillService, reportStatementService);
  }
  /** * This method handles initialization tasks*/
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
      if (this.isinitialValue && currentCurrencyKey) this.currencyChange(currentCurrencyKey);
    }, noop);
    this.getLookupValues();
    this.currentCurrency.label = GccCurrencyLabel.SAR;
    this.currentCurrency.code.value = BillingConstants.CURRENCY_SAR;
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params.monthSelected;
      this.endDate = endOfMonth(moment(new Date(this.selectedDate)).toDate());
      this.startDate = startOfMonth(moment(new Date(this.selectedDate)).toDate());
      this.billNumber = params.billNumber;
      this.billIssueDate = params.billIssueDate;
      this.isMofFlag = params.mofFlag;
      this.idNumber = params.registerNo;
      this.initialStartDate = params.billStartDate;
    }, noop);
    if (this.isMofFlag) {
      this.selectedTabName = 'BILLING.CREDIT-ADJUSTMENTS';
      this.entityType = 'THIRD_PARTY';
    } else {
      this.selectedTabName = 'BILLING.RECEIPTS-AND-CREDITS';
      this.entityType = 'ESTABLISHMENT';
    }
    this.lookUpService.getGccCurrencyList().subscribe(res => {
      this.gccCurrencyList = res;
    }, noop);
    this.isAdmin = true;
    if (!this.isMofFlag) this.idNumber = this.idNumber = this.establishmentRegistrationNo.value;
    this.getItemizedBillBreakUpServices(this.idNumber);
    this.getBillingHeaderServices(this.idNumber);
    this.getItemizedLateFeeWavierDetails(this.idNumber, this.selectedDate);
    this.getviolationAdjustmentDetails(this.idNumber);
    this.getMiscAdjustmentDetails(this.idNumber);
    this.getReversedLateFeesDetails(this.idNumber, this.selectedDate)
    this.getMedicalInsuranceDetails(this.idNumber,this.selectedDate)
  } /** Method to get lookup values. */
  getLookupValues() {
    this.residentType$ = this.lookUpService.getSaudiNonSaudi();
    this.receiptSort$ = this.lookUpService.getReceiptSortFields();
    this.adjustmentSort$ = this.lookUpService.getAdjustmentSortFieldsList();
  } /*** This method is to call service for Bill Summar */
  getDashboardBillDetails() {
    this.billingRoutingService.navigateToDashboardBill(
      this.selectedDate,
      this.billNumber,
      false,
      this.initialStartDate,
      this.idNumber
    );
    this.getItemizedBillBreakUpServices(this.idNumber);
  } /** * This method is to get bill details on selected date*/
  getReceiptCreditDetailedBillDetailsOnSelectedDate(dateValue: string) {
    this.isReceiptDetails = false;
    this.selectedDate = convertToYYYYMMDD(startOfMonth(moment(new Date(dateValue)).toDate()).toString());
    this.endDate = endOfMonth(moment(new Date(this.selectedDate)).toDate());
    this.startDate = startOfMonth(moment(new Date(dateValue)).toDate());
    this.pageNo = 0;
    if (this.selectedDate) {
      if (this.detailedBillService.getBillOnMonthChanges !== undefined)
        this.detailedBillService.getBillOnMonthChanges(this.idNumber, this.selectedDate).subscribe(
          res => {
            if (res.bills[0]) {
              this.billNumber = res.bills[0].billNumber;
              this.isBillNumber = false;
            } else this.isBillNumber = true;
            this.detailedBillService
              .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.entityType)
              .subscribe((responseData: BillDetails) => {
                this.billDetails = responseData;
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
                this.getRejectedOHRecoveryDet();
                this.getItemizedLateFeeWavierDetails(this.idNumber, this.selectedDate);
                this.getviolationAdjustmentDetails(this.idNumber);
                this.getMiscAdjustmentDetails(this.idNumber);
                this.getReversedLateFeesDetails(this.idNumber, this.selectedDate);
                this.getMiscAdjustmentDetails(this.idNumber);
                this.detailedBillService
                  .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
                  .subscribe(response => {
                    this.rejectedOHDetails = response;
                    if (this.rejectedOHDetails) this.tabSetLists();
                  });
                if (this.billDetails.totalReceiptsAndCredits === 0) {
                  if (this.billDetails.totalContribution !== 0) {
                    this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
                  } else if (this.billDetails.totalDebitAdjustment !== 0) {
                    this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
                  } else if (this.installmentDetails.currentInstallmentAmount !== null) {
                    this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
                  } else if (this.violationDetails.totalViolationAmountAggregate > 0) {
                    this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
                  } else this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
                  this.router.navigate([this.selectedUrl], {
                    queryParams: {
                      monthSelected: convertToYYYYMMDD(this.selectedDate),
                      billNumber: this.billNumber,
                      mofFlag: this.isMofFlag,
                      registerNo: this.idNumber,
                      billStartDate: convertToYYYYMMDD(this.initialStartDate)
                    }
                  });
                }
                this.tabSetLists();
                this.getReceiptCreditDetails(this.startDate, this.endDate);
                this.getadjustmentdetails(this.filterSearchDetails);
                this.getItemizedCreditTransferDetails(this.idNumber, this.selectedDate);
              });
            this.noOfDays = moment(new Date(this.selectedDate)).daysInMonth();
          },
          err => {
            this.errorMessage = err.error.message;
            this.isBillNumber = true;
          }
        );
    }
  } /** This method is to call Billing Header service*/
  getBillingHeaderServices(idNo: number) {
    this.isinitialValue = true;
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.establishmentHeader = res;
      this.isPPA = res.ppaEstablishment;
      this.isGccCountry = res.gccCountry;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country.english) {
            this.gccCountryValue = data;
          }
        });
      }
      if (
        this.selectedCurrency !== BillingConstants.CURRENCY_SAR.english &&
        this.selectedCurrency === this.gccCountryValue
      ) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.gccCountryValue, currentDate)
          .subscribe(key => {
            this.exchangeRate = key;
            this.CurrencyDetails.english = this.gccCountryValue;
            this.CurrencyDetails.arabic = CurrencyArabicShortForm[this.CurrencyDetails.english];
          });
      } else {
        this.CurrencyDetails = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    }, noop);
  }
  currencyChange(selectedValue: string) {
    if (
      this.CurrencyDetails.english !== selectedValue &&
      selectedValue === this.gccCountryValue &&
      this.isGccCountry &&
      selectedValue !== BillingConstants.CURRENCY_SAR.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR.english, selectedValue, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.CurrencyDetails.english = selectedValue;
          this.CurrencyDetails.arabic = CurrencyArabicShortForm[selectedValue];
        }, noop);
    } else {
      if (selectedValue === BillingConstants.CURRENCY_SAR.english) {
        this.CurrencyDetails.english = BillingConstants.CURRENCY_SAR.english;
        this.CurrencyDetails.arabic = BillingConstants.CURRENCY_SAR.arabic;
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.CurrencyDetails = this.CurrencyDetails;
      }
    }
  } /**This method is used to get bill breakup details from api call  */
  getItemizedBillBreakUpServices(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.selectedDate, this.entityType)
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
        this.billNumber = res.billNo;
        this.getViolationDetails();
        this.getInstallmentDetails();
        this.getRejectedOHRecoveryDet();
        this.detailedBillService
          .getRejectedOHDetails(this.idNumber, this.selectedDate, this.pageNo, this.pageSize)
          .subscribe(
            responseData => {
              this.rejectedOHDetails = responseData;
              if (this.rejectedOHDetails) this.tabSetLists();
            },
            () => {
              this.tabSetLists();
            }
          );
        this.getReceiptCreditDetails(this.startDate, this.endDate);
        this.getadjustmentdetails(this.filterSearchDetails);
        this.getItemizedCreditTransferDetails(this.idNumber, this.selectedDate);
      }, noop);
  } /* This method to get adjustment details  */
  getadjustmentdetails(filterSearchDetails?: RequestList) {
    this.getItemizedCreditAdjustmentDetails('WAGE_DECREASE', filterSearchDetails).subscribe(wageChangeRes => {
      this.wageChange = wageChangeRes;
      this.wageDecreaseTotal = this.wageChange.total;
      this.wageChange = wageChangeRes;
      this.wageDecreaseTotal = this.wageChange.total
    }, noop);
    this.getItemizedCreditAdjustmentDetails('PERIOD_DECREASE', filterSearchDetails).subscribe(periodDecreaseRes => {
      this.periodChange = periodDecreaseRes;
      this.periodDecreaseTotal = this.periodChange.total;
    }, noop);
    this.getItemizedCreditAdjustmentDetails('COVERAGE_REMOVAL', filterSearchDetails).subscribe(coverageChangeRes => {
      this.coverageChange = coverageChangeRes;
      this.isCoverageRemoval = this.coverageChange.covRemovalCredit;
      this.coverageDecreaseTotal = this.coverageChange.total;
    }, noop);
    this.getItemizedCreditAdjustmentDetails('OH_RATE_DECREASE', filterSearchDetails).subscribe(ohRateChangeRes => {
      this.ohRateChange = ohRateChangeRes;
      this.ohRateDecreaseTotal = this.ohRateChange.total;
    });
  } /** Method is used to fetchreceipt details */
  getReceiptCreditDetails(startDate: Date, endDate: Date) {
    this.filterParams.receiptFilter.endDate.gregorian = endDate;
    this.filterParams.receiptFilter.startDate.gregorian = startDate;
    this.detailedBillService
      .getReceipts(
        this.idNumber,
        this.filterParams,
        this.entityType,
        this.pageNo,
        this.pageSize,
        false,
        this.receiptSortBy,
        this.sortOrder
      )
      .subscribe((responseData: ItemizedReceiptWrapper) => {
        this.ReceiptDetails = responseData;
        if (this.ReceiptDetails.total === 0) this.isReceiptDetails = true;
      }, noop);
  } /** Method is used to fetch backdated adjustment details */
  /** Method is used fetch details based on selected page */
  getselectPageNo(selectedpageNo: number, type: string) {
    this.pageNo = selectedpageNo;
    this.getItemizedAdjustmentForSelectedPage(type);
  } /** Method is used fetch details based on selected page for receipt details*/
  getReceiptSelectPageNo(newPage: number) {
    this.pageNo = newPage;
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  } /** Method is used fetch itemized adjustment details based on selected page */
  getItemizedAdjustmentForSelectedPage(type) {
    this.detailedBillService
      .getItemizedDebitAdjustment(
        this.idNumber,
        this.billNumber,
        this.pageNo,
        this.pageSize,
        type,
        this.entityType,
        this.searchKey,
        this.filterSearchDetails
      )
      .subscribe((value: ItemizedAdjustmentWrapper) => {
        if (type === 'WAGE_DECREASE') {
          this.wageChange = value;
        } else if (type === 'PERIOD_DECREASE') {
          this.periodChange = value;
        } else if (type === 'COVERAGE_REMOVAL') {
          this.coverageChange = value;
        } else if (type === 'OH_RATE_DECREASE') {
          this.ohRateChange = value;
        }
      }, noop);
  } /* * This method is to navigate to new tabs */
  goToNewTabs(selectedTab: string) {
    if (selectedTab === 'BILLING.DEBIT-ADJUSTMENTS')
      this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
    if (selectedTab === 'BILLING.CONTRIBUTION' || selectedTab === 'BILLING.CURRENT-MONTH-CONTRIBUTION')
      this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
    if (selectedTab === 'BILLING.RECEIPTS-AND-CREDITS' || selectedTab === 'BILLING.CREDIT-ADJUSTMENTS')
      this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
    if (selectedTab === 'BILLING.LATE-PAYMENT-FEES')
      this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
    if (selectedTab === 'BILLING.REJECTED-OH-CLAIMS') {
      this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
    }
    if (selectedTab === 'BILLING.VIOLATIONS') this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/violation';
    if (selectedTab === 'BILLING.INSTALLMENT') {
      this.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
    }
    this.router.navigate([this.selectedUrl], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(this.selectedDate),
        billNumber: this.billNumber,
        mofFlag: this.isMofFlag,
        registerNo: this.idNumber,
        billStartDate: convertToYYYYMMDD(this.initialStartDate)
      }
    });
  } /** * This method is to navigate with new  date selected on the mof emp summary page */
  mofCalDatechanged(DateChanged: string) {
    this.selectedDate = convertToYYYYMMDD(DateChanged);
    this.detailedBillService.getBillNumber(this.idNumber, this.selectedDate).subscribe(
      res => {
        this.billNumber = res.bills[0].billNumber;
        this.isBillNumber = false;
        if (this.billNumber) {
          this.detailedBillService
            .getBillBreakup(this.idNumber, this.billNumber, this.selectedDate, this.entityType)
            .subscribe((response: BillDetails) => {
              this.billDetails = response;
              if (this.billDetails.totalContribution > 0) {
                this.selectedUrlValue = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
              } else if (this.billDetails.totalDebitAdjustment > 0) {
                this.selectedUrlValue = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
              } else if (this.billDetails.totalReceiptsAndCredits > 0)
                this.selectedUrlValue = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
              this.router.navigate([this.selectedUrlValue], {
                queryParams: {
                  monthSelected: convertToYYYYMMDD(this.selectedDate),
                  mofFlag: this.isMofFlag,
                  billNumber: this.billNumber,
                  registerNo: this.idNumber,
                  billStartDate: convertToYYYYMMDD(this.initialStartDate)
                }
              });
              this.noOfDays = moment(this.selectedDate).daysInMonth();
              this.tabSetLists();
            }, noop);
        }
        this.getadjustmentdetails();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isBillNumber = true;
      }
    );
  } // Method to sort payment receipt table
  getReceiptSortList(sortList) {
    this.receiptSortBy = sortList.sortBy;
    this.sortOrder = sortList.sortOrder;
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  } // Method to sort credit tables
  getCreditsSortList(sortListOrder) {
    if (sortListOrder.sortBy.value.english === 'Contributor Name') {
      if (this.lang === 'en') this.filterSearchDetails.sort.column = 'CONTRIBUTOR_NAME_ENG';
      else this.filterSearchDetails.sort.column = 'CONTRIBUTOR_NAME_ARB';
    } else if (sortListOrder.sortBy.value.english === 'Contributory Wage')
      this.filterSearchDetails.sort.column = 'CONTRIBUTORY_WAGE';
    else if (sortListOrder.sortBy.value.english === 'Period (From)')
      this.filterSearchDetails.sort.column = 'ADJ_FROM_PERIOD';
    else if (sortListOrder.sortBy.value.english === 'Late Fees') this.filterSearchDetails.sort.column = 'LATE_FEE';
    else if (sortListOrder.sortBy.value.english === 'Total Amount')
      this.filterSearchDetails.sort.column = 'TOTAL_AMOUNT';
    else if (sortListOrder.sortBy.value.english === 'Calculation Rate (New)')
      this.filterSearchDetails.sort.column = 'CONTRIBUTORY_WAGE';
    else if (sortListOrder.sortBy.value.english === 'Adjustment Date')
      this.filterSearchDetails.sort.column = 'ADJUSTMENT_DATE';
    this.filterSearchDetails.sort.direction = sortListOrder.sortOrder;
    this.getadjustmentdetails(this.filterSearchDetails);
  } // Method to search based on search  values
  getCreditSearchValues(searchValues, type: string) {
    if (type === 'WAGE_DECREASE') this.wageFlag = true;
    else if (type === 'PERIOD_DECREASE') this.periodFlag = true;
    else if (type === 'COVERAGE_REMOVAL') this.coverageFlag = true;
    else if (type === 'OH_RATE_DECREASE') this.ohRateFlag = true;
    else if (type === 'COVERAGE_REMOVAL') this.coverageFlag = true;
    this.searchKey = searchValues;
    this.pageNo = 0;
    this.getadjustmentdetails(this.filterSearchDetails);
  }
  getPaymentReceiptList(filterParams?) {
    if (filterParams?.isSearch) {
      this.filterParams.parentReceiptNo = filterParams.filterParams.parentReceiptNo;
      this.pageNo = 0;
    } else if (filterParams?.isfilter) {
      this.filterParams.receiptFilter.receiptDate.endDate = filterParams.filterParams.receiptFilter.receiptDate.endDate;
      this.filterParams.receiptFilter.receiptDate.startDate =
        filterParams.filterParams.receiptFilter.receiptDate.startDate;
      this.filterParams.receiptFilter.maxAmount = filterParams.filterParams.receiptFilter.maxAmount;
      this.filterParams.receiptFilter.minAmount = filterParams.filterParams.receiptFilter.minAmount;
      this.pageNo = 0;
    }
    if (filterParams) {
      this.filterParams = this.filterParams;
    } else {
      this.filterParams.receiptFilter.receiptDate.endDate = null;
      this.filterParams.receiptFilter.receiptDate.startDate = null;
      this.filterParams.receiptFilter.maxAmount = null;
      this.filterParams.receiptFilter.minAmount = null;
    }
    this.getReceiptCreditDetails(this.startDate, this.endDate);
  } // Method to get response based on filter values
  getCreditAdjustmentFilterDetails(filterParams: RequestList, type: string) {
    if (type === 'WAGE_DECREASE') this.wageFlag = true;
    else if (type === 'PERIOD_DECREASE') this.periodFlag = true;
    else if (type === 'COVERAGE_REMOVAL') this.coverageFlag = true;
    else if (type === 'OH_RATE_DECREASE') this.ohRateFlag = true;
    this.filterSearchDetails = filterParams;
    this.searchKey = undefined;
    this.pageNo = 0;
    this.getadjustmentdetails(this.filterSearchDetails);
  }

  /** getting misc adjustment details on component init */
  getMiscAdjustmentDetails(idNumber: number){
    this.startDateCalender.gregorian = this.startDate;
    this.startDateCalender.entryFormat = CalendarTypeEnum.GREGORIAN;
    this.startDateCalender.hijiri = null;
    this.miscAdjustmentRequest.startDate = this.startDateCalender;
    this.miscAdjustmentRequest.miscellaneousAdjustmentType = MiscellaneousConstants.MISC_CREDIT;

    this.miscAdjustmentService
      .getMiscProcessedAdjustment(idNumber, this.miscAdjustmentRequest)
      .pipe(
        tap(res => {
          this.miscAdjustmentResponse = res;
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err.error.message);
        })
      )
      .subscribe(noop, noop);
  }

  getReversedLateFeesDetails(regNo: number, startDate: string){
    this.handleDelayedPaymentService.getReversedLateFees(regNo, startDate)
      .pipe(
        tap(res => {
          this.itemizedReversedLateFees = res;
        }), catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err.error.message);
        })
      ).subscribe(noop, noop);
  }

  getMedicalInsuranceDetails(regNo: number, startDate: string){
    this.detailedBillService.getMedicalInsuranceDetails(regNo,startDate)
      .pipe(
        tap(res=>{
          this.medicalInsuranceBeneficiaryDetails = res;
        }),catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err.error.message);
        })
      ).subscribe(noop,noop)
  }




}
