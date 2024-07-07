import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  BilingualText,
  convertToYYYYMMDD,
  CurrencyToken,
  ExchangeRateService,
  startOfMonth,
  StorageService,
  subtractMonths
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { BillingConstants } from '../../../../shared/constants';
import { CurrencyArabicShortForm, GccCountry, Months } from '../../../../shared/enums';
import { BillDetails, DateFormat, EstablishmentHeader, UnBillAmount } from '../../../../shared/models';
import { CreditManagementService, DetailedBillService } from '../../../../shared/services';

@Component({
  selector: 'blg-bill-account-sc',
  templateUrl: './bill-account-sc.component.html',
  styleUrls: ['./bill-account-sc.component.scss']
})
export class BillAccountScComponent implements OnInit {
  paidAmount = 0;
  unpaidBalance = 0;
  balanceDue = 0;
  months = Months;
  monthSelectedDate: string;
  billDetails: BillDetails = new BillDetails();
  availableCreditBalance = 0;
  currentDate: DateFormat = new DateFormat();
  previousDateValue: DateFormat = new DateFormat();
  creditDate: DateFormat = new DateFormat();
  currentMonth = '';
  previousMonthValue = '';
  idNumber: number;
  unPaidAmount = 0;
  billNumber = 0;
  excessPaidFlag = false;
  creditAmount = 0;
  creditBalance = false;
  lastBillAmount = 0;
  creditMonth = '';
  billAmountDateValue: Date;
  receiptCreditDate: Date;
  totalCreditBalance = 0;
  entityType = 'ESTABLISHMENT';
  isAdmin = false;
  selectedValue: string;
  currentCurrency: string;
  showMinimumRequired = false;
  billBalanceDetail: BillDetails;
  exchangeRate = 1;
  currencyType: BilingualText;
  unBillAmount: UnBillAmount;
  isGccCountry: boolean;
  isMofFlag = false;
  isBillNumber: boolean;
  constructor(
    readonly detailedBillService: DetailedBillService,
    readonly alertService: AlertService,
    readonly creditManagementService: CreditManagementService,
    readonly storageService: StorageService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    readonly exchangeRateService: ExchangeRateService,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = true;
    this.currentDate.date = moment().toDate().getDate().toString();
    this.currentDate.year = moment().toDate().getFullYear().toString();
    this.currentMonth = this.getMonthFromDate(new Date());
    this.currentMonth = 'BILLING.' + 'CALENDAR.' + this.currentMonth.toUpperCase();
    this.idNumber = Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY));
    this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
    this.currency.subscribe(key => {
      this.selectedValue = key;
      if (key) {
        this.currencyExchange(key);
      }
    });
    if (this.idNumber) {
      this.getBillNumber(this.idNumber, true);
      this.getAvailableBalanceDetails(this.idNumber);
      this.getBillDetailsOnSelectedDate();
      this.getBillingHeaderDetails(this.idNumber);
    }
  }
  /**
   * This method to call Bill Breakup Service
   * @param idNo Identification Number
   */
  getBillBreakUpService(idNo: number) {
    this.detailedBillService
      .getBillBreakup(idNo, this.billNumber, this.monthSelectedDate, this.entityType)
      .subscribe((res: BillDetails) => {
        this.billBalanceDetail = res;
        this.unBillAmount = this.billDetails.unBilledAmount;
        this.getBillDetails();
      });
  }
  /**
   * Method to get bill details
   */
  getBillDetails() {
    this.billAmountDateValue = moment(this.billBalanceDetail?.issueDate.gregorian).toDate();
    this.receiptCreditDate = moment(this.billBalanceDetail?.issueDate.gregorian).add(1, 'day').toDate();
    this.previousDateValue = this.formatDatesBillBalance(this.billAmountDateValue);
    this.previousMonthValue = this.getMonthFromDate(this.billAmountDateValue);
    this.previousMonthValue = 'BILLING.' + 'CALENDAR.' + this.previousMonthValue.toUpperCase();
    this.creditMonth = this.getMonthFromDate(this.receiptCreditDate);
    this.creditMonth = 'BILLING.' + 'CALENDAR.' + this.creditMonth.toUpperCase();
    this.creditDate = this.formatDatesBillBalance(this.receiptCreditDate);
    this.unPaidAmount = this.billBalanceDetail.balanceDue - this.billBalanceDetail.paidAmount;
    this.showMinimumRequired =
      !this.isMofFlag &&
      this.billBalanceDetail !== undefined &&
      this.billBalanceDetail?.minimumPaymentRequiredForMonth !== null
        ? true
        : false;

    if (this.balanceDue < this.billBalanceDetail.paidAmount) {
      this.creditAmount =
        this.billBalanceDetail.paidAmount -
        this.billBalanceDetail.balanceDue -
        this.billBalanceDetail?.creditBalanceTransferredOrRefunded;
      this.excessPaidFlag = true;
      if (this.isMofFlag) {
        this.creditAmount = this.billBalanceDetail.paidAmount - this.billBalanceDetail.balanceDue;
      }
    }
    if (this.balanceDue < 0) {
      this.lastBillAmount = Math.abs(this.balanceDue);
      this.unPaidAmount = this.balanceDue + this.paidAmount;
      this.creditBalance = true;
    }
    if (this.balanceDue - this.paidAmount > 0) {
      this.unpaidBalance = this.balanceDue - this.paidAmount;
    } else {
      this.availableCreditBalance = this.paidAmount - this.balanceDue;
    }
  }
  /**
   * Method to get bill number
   * @param idNo
   * @param pageLoad
   */
  getBillNumber(idNo: number, pageLoad) {
    this.detailedBillService.getBillNumber(idNo, this.monthSelectedDate, pageLoad).subscribe(res => {
      this.billNumber = res.bills[0].billNumber;
      this.getBillBreakUpService(idNo);
    });
  }
  /**
   * Method to get bill details on selected date
   * @param idNo
   * @param pageLoad
   */
  getBillDetailsOnSelectedDate() {
    if (this.monthSelectedDate) {
      if (this.detailedBillService.getBillOnMonthChanges !== undefined)
        this.detailedBillService.getBillOnMonthChanges(this.idNumber, this.monthSelectedDate, false).subscribe(res => {
          if (res.bills[0]) {
            this.billNumber = res.bills[0].billNumber;
            this.isBillNumber = false;
          } else this.isBillNumber = true;
        });
    }
  }
  currencyExchange(selectedCurrency: string) {
    if (
      this.currencyType?.english !== selectedCurrency &&
      selectedCurrency === this.currentCurrency &&
      this.isGccCountry &&
      selectedCurrency !== BillingConstants.CURRENCY_SAR?.english
    ) {
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      this.exchangeRateService
        .getExchangeRate(BillingConstants.CURRENCY_SAR?.english, selectedCurrency, currentDate)
        .subscribe(res => {
          this.exchangeRate = res;
          this.currencyType.english = selectedCurrency;
          this.currencyType.arabic = CurrencyArabicShortForm[selectedCurrency];
        });
    } else {
      if (selectedCurrency === BillingConstants.CURRENCY_SAR?.english) {
        if (this.currencyType) {
          this.currencyType.english = BillingConstants.CURRENCY_SAR?.english;
          this.currencyType.arabic = BillingConstants.CURRENCY_SAR.arabic;
        }
        this.exchangeRate = 1;
      } else {
        this.exchangeRate = this.exchangeRate;
        this.currencyType = this.currencyType;
      }
    }
  }
  /**
   * Method to get billing header details
   * @param idNo
   */
  getBillingHeaderDetails(idNo: number) {
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.isGccCountry = res.gccCountry;
      if (this.isGccCountry) {
        Object.keys(GccCountry).forEach(data => {
          if (GccCountry[data] === res.gccEstablishment.country?.english) {
            this.currentCurrency = data;
          }
        });
      }
      if (
        this.selectedValue !== BillingConstants.CURRENCY_SAR?.english &&
        this.currentCurrency === this.selectedValue
      ) {
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        this.exchangeRateService
          .getExchangeRate(BillingConstants.CURRENCY_SAR?.english, this.currentCurrency, currentDate)
          .subscribe(key => {
            this.exchangeRate = key;
            this.currencyType.english = this.currentCurrency;
            this.currencyType.arabic = CurrencyArabicShortForm[this.currencyType?.english];
          });
      } else {
        this.currencyType = BillingConstants.CURRENCY_SAR;
        this.exchangeRate = 1;
      }
    });
  }
  routetodashboard() {
    this.router.navigate([BillingConstants.ROUTE_DASHBOARD_BILL]);
  }
  routeToHistory() {
    this.router.navigate([BillingConstants.ROUTE_BILL_HISTORY]);
  }
  /**
   * Method to format Dates Bill Balance
   * @param date date
   */
  formatDatesBillBalance(date: Date): DateFormat {
    const formattedDate: DateFormat = new DateFormat();
    formattedDate.date = this.getDayFromDate(date);
    formattedDate.year = this.getYearFromDate(date);
    return formattedDate;
  }
  /**
   * Method to get day from a given date
   * @param date date
   */
  getDayFromDate(date: Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonthFromDate(date: Date): string {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYearFromDate(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
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
}
