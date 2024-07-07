import { Component, OnInit, Inject } from '@angular/core';
import moment from 'moment-timezone';
import {
  StorageService,
  convertToYYYYMMDD,
  BilingualText,
  ExchangeRateService,
  CurrencyToken,
  LovList,
  LookupService,
  AppConstants,
  subtractMonths,
  endOfMonth,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { BillDashboardService } from '../../../../shared/services/bill-dashboard.service';
import {
  BillHistoryWrapper,
  EstablishmentHeader,
  BillHistoryRouterDetails,
  BillHistoryFilterParams,
  DateFormat,
  ItemizedMiscRequest,
  ItemizedMiscResponse
} from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingRoutingService, DetailedBillService, MiscellaneousAdjustmentService } from '../../../../shared/services';
import { BehaviorSubject, noop, Observable, throwError } from 'rxjs';
import { GccCountry, Months } from '../../../../shared/enums';
import { RouteConstants, BillingConstants } from '../../../../shared/constants';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'blg-bill-history-sc',
  templateUrl: './bill-history-sc.component.html',
  styleUrls: ['./bill-history-sc.component.scss']
})
export class BillHistoryScComponent implements OnInit {
  //----- Variables Declaration --------------------*/
  registrationNo: number;
  registrationStatus: BilingualText = new BilingualText();
  billHistoryDetails: BillHistoryWrapper = new BillHistoryWrapper();
  billHistoryChartData: BillHistoryWrapper = new BillHistoryWrapper();
  billNumber: number;
  pageSize = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  isBillHistory = false;
  establishmentName: BilingualText;
  currentCurrency = 'SAR';
  selectedCurrency: string;
  exchangeRate = 1;
  isGccEstablishment: boolean;
  viewOldBill = false;
  isInitialCurrencyChange = true;
  previousSelectedCurrency: string;
  previousExchangeRate: number;
  searchPage: number;
  yesOrNoList$: Observable<LovList>;
  billPaymentStatus$: Observable<LovList>;
  filterParamValues = new BillHistoryFilterParams();
  isSearch = false;
  isFilter = false;
  amount: number;
  debtStartDate: DateFormat;
  debtStartMonth: string;
  hideColumn: boolean;
  isMofFlag = false;
  miscAdjustmentRequest: ItemizedMiscRequest = new ItemizedMiscRequest();
  miscAdjustmentResponse: ItemizedMiscResponse = new ItemizedMiscResponse();y
  total = 0;
  alertService: any;
  constructor(
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly exchangeRateService: ExchangeRateService,
    readonly billingRoutingService: BillingRoutingService,
    readonly billDashboardService: BillDashboardService,
    readonly miscAdjustmentService: MiscellaneousAdjustmentService,
    readonly detailedBillService: DetailedBillService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    readonly lookupService: LookupService,
    readonly router: Router
  ) {}

  /* This method is to handle intial operations on component load*/
  ngOnInit(): void {
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
      if (!this.isInitialCurrencyChange) {
        this.currencyExchangeRate(this.selectedCurrency);
      }
    }, noop);   
    this.registrationNo = this.establishmentRegistrationNo.value;
    this.getRegistrationStatus();
    this.getEstablishmentName(this.registrationNo);
    this.pageChanged(1);
    this.getLookupValues();
  }
  convertDebtDate() {
    this.debtStartDate = this.formatDates(this.billHistoryDetails?.debtStartDate?.gregorian);
    this.debtStartMonth = this.getMonths(this.billHistoryDetails?.debtStartDate?.gregorian);
  }
  /**
   * Method to format the date.
   * @param date date
   */
  formatDates(date: Date): DateFormat {
    const formattedDate: DateFormat = new DateFormat();
    formattedDate.date = this.getDays(date);
    formattedDate.year = this.getYears(date);
    return formattedDate;
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonths(date: Date): string {
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to get day from a given date
   * @param date date
   */
  getDays(date: Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYears(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
  }

  getLookupValues() {
    this.yesOrNoList$ = this.lookupService.getYesOrNoList();
    this.billPaymentStatus$ = this.lookupService.getBillPaymentStatusList();
  }
  /* Method to get Registration status  for header component*/
  getRegistrationStatus() {
    this.isInitialCurrencyChange = false;
    this.detailedBillService.getBillingHeader(this.registrationNo, true).subscribe((res: EstablishmentHeader) => {
      this.registrationStatus = res.status;
      if (res.gccEstablishment) {
        this.isGccEstablishment = res.gccEstablishment?.gccCountry;
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment?.country.english) {
            this.previousSelectedCurrency = data;
          }
        });
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR.english, this.previousSelectedCurrency, currentDate)
          .subscribe(response => {
            this.previousExchangeRate = response;
            this.currencyExchangeRate(this.selectedCurrency);
          }, noop);
      }
    }, noop);
  }
  /* Method to get pagination data on each page select*/
  pageChanged(page: number) {
    const endDate = convertToYYYYMMDD(endOfMonth(subtractMonths(new Date(), 1)).toString());
    if (this.filterParamValues.isFilter || this.filterParamValues.isSearch) {
      this.searchPage = page;
      if (this.filterParamValues.billDate.startDate === null) {
        this.filterParamValues.billDate.startDate = '1980-01-01';
      }
      this.billDashboardService
        .getBillHistorySearch(this.registrationNo, true, page - 1, this.pageSize, this.filterParamValues)
        .subscribe((res: BillHistoryWrapper) => {
          this.billHistoryDetails = res;
        }, noop);
    } else {
      this.searchPage = page;
      this.billDashboardService
        .getBillHistory(this.registrationNo, endDate, '1980-01-01', true, page - 1, this.pageSize)
        .subscribe((res: BillHistoryWrapper) => {
          this.billHistoryDetails = res;
          this.hideColumn = res?.bills.every(item => item.requiredMinPayment === null) ? true : false;
          this.convertDebtDate();
          this.getAdjustmentDetails(this.registrationNo);
        }, noop);
    }
  }
  getAdjustmentDetails(idNumber: number) {
    this.miscAdjustmentService.getMiscProcessedAdjustment(idNumber, this.miscAdjustmentRequest)
      .pipe(
        tap(res => {
          this.miscAdjustmentResponse = res;
          for (const adjustment of this.miscAdjustmentResponse.adjustments) {
            this.total += adjustment.totalAmount;
          }
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err.error.message);
        })
      )
      .subscribe(noop, noop);
  }
  viewRecords() {
    this.router.navigate([RouteConstants.ROUTE_VIEW_RECORD]);
  }

  /* Method to navigate to other screen depending on option selection from kebab menu in bill history table*/
  routeTo(routeDetails: BillHistoryRouterDetails) {
    const selectedDate = convertToYYYYMMDD(
      this.billHistoryDetails.bills[routeDetails.index].issueDate?.gregorian.toString()
    );
    const billIssueDate = this.billHistoryDetails.firstBillIssueDate?.gregorian.toString();
    if (routeDetails.destinationPageName === BillingConstants.BIILL_HISTORY_ROUTE_ALLOCATOIN) {
      this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(selectedDate),
          billIssueDate: convertToYYYYMMDD(billIssueDate),
          maxBilldate: convertToYYYYMMDD(this.billHistoryDetails?.bills[0]?.issueDate?.gregorian.toString())
        }
      });
    } else if (routeDetails.destinationPageName === BillingConstants.BIILL_HISTORY_ROUTE_BILL_DETAILS) {
      this.detailedBillService.getBillNumber(this.registrationNo, selectedDate).subscribe(res => {
        this.billNumber = res.bills[0].billNumber;
        this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL + '/' + 'contribution'], {
          queryParams: {
            monthSelected: convertToYYYYMMDD(selectedDate),
            billNumber: this.billNumber,
            registerNo: this.registrationNo
          }
        });
      }, noop);
    } else {
      this.detailedBillService.getBillNumber(this.registrationNo, selectedDate).subscribe(res => {
        this.billNumber = res.bills[0].billNumber;
        this.router.navigate([BillingConstants.ROUTE_DASHBOARD_BILL], {
          queryParams: {
            monthSelected: convertToYYYYMMDD(selectedDate),
            billNumber: this.billNumber,
            isSearch: true,
            registerNo: this.registrationNo
          }
        });
      }, noop);
    }
  }
  /**
   * This method to get the heading establishment and reg no
   * @param idNo Identification Number
   */
  getEstablishmentName(idNo: number) {
    this.detailedBillService.getBillingHeader(idNo, true).subscribe((res: EstablishmentHeader) => {
      this.establishmentName = res.name;
      const statusDate = new Date(res.startDate?.gregorian);
      const fixedDate = new Date('2022-01-01');
      if (statusDate < fixedDate) {
        this.viewOldBill = true;
      } else this.viewOldBill = false;
    }, noop);
  }

  routeToBillDashboard() {
    this.router.navigate([BillingConstants.ROUTE_DASHBOARD_BILL], {
      queryParams: {
        isSearch: true
      }
    });
  }

  getBillhistoryDetails(amount: number) {
    const startDate = '1980-01-01';
    const endDate = convertToYYYYMMDD(endOfMonth(subtractMonths(new Date(), 1)).toString());
    this.filterParamValues.billDate.startDate =
      this.filterParamValues.billDate.startDate !== null && this.filterParamValues.billDate.startDate !== undefined
        ? this.filterParamValues.billDate.startDate
        : startDate;
    this.filterParamValues.billDate.endDate =
      this.filterParamValues.billDate.endDate !== null && this.filterParamValues.billDate.endDate !== undefined
        ? this.filterParamValues.billDate.endDate
        : endDate;

    if (amount === null) {
      this.pageDetails.currentPage = 1;
      this.pageDetails.goToPage = '1';
    } else {
      this.pageDetails.currentPage = this.searchPage;
      this.pageDetails.goToPage = String(this.searchPage);
    }
    this.isSearch = true;
    this.amount = amount;
    if (!this.isFilter) {
      this.filterParamValues.amount = amount;
      this.filterParamValues.adjustmentIndicator = null;

      this.filterParamValues.paymentStatus = null;
      this.filterParamValues.rejectedOHInducator = null;
      this.filterParamValues.settlementDate.startDate = null;
      this.filterParamValues.settlementDate.endDate = null;
      this.filterParamValues.violtaionIndicator = null;
    } else {
      this.filterParamValues.amount = amount;
    }

    this.billDashboardService
      .getBillHistorySearch(this.registrationNo, true, 0, this.pageSize, this.filterParamValues)
      .subscribe((res: BillHistoryWrapper) => {
        this.billHistoryDetails = res;
      }, noop);
  }
  /** Method to get  currency exchange rate change */
  currencyExchangeRate(newSelectedCurrency: string) {
    if (this.isGccEstablishment) {
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
  getParamDetails(filterParam?: BillHistoryFilterParams) {
    if (filterParam === null) {
      this.pageDetails.currentPage = 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    } else {
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.isFilter = true;
    if (filterParam) {
      this.filterParamValues = filterParam;
    } else {
      this.filterParamValues.adjustmentIndicator = null;
      this.filterParamValues.billDate.startDate = null;
      this.filterParamValues.billDate.endDate = null;
      this.filterParamValues.paymentStatus = null;
      this.filterParamValues.rejectedOHInducator = null;
      this.filterParamValues.settlementDate.startDate = null;
      this.filterParamValues.settlementDate.endDate = null;
      this.filterParamValues.violtaionIndicator = null;
      this.filterParamValues.maxBillAmount = undefined;
      this.filterParamValues.minBillAmount = undefined;
    }
    if (this.isSearch) {
      this.filterParamValues.amount = this.amount;
    }
    this.billDashboardService
      .getBillHistorySearch(this.registrationNo, true, 0, this.pageSize, this.filterParamValues)
      .subscribe((res: BillHistoryWrapper) => {
        this.billHistoryDetails = res;
      }, noop);
  }
}
