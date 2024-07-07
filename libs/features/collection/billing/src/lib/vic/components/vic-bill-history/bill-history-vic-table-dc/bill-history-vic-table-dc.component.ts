import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarTypeEnum, GosiCalendar, LanguageToken, LovList } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HijiriMonths, Months } from '../../../../shared/enums';
import {
  BillHistory,
  BillHistoryFilterParams,
  BillHistoryRouterDetails,
  BillHistoryWrapper,
  DateFormat
} from '../../../../shared/models';

@Component({
  selector: 'blg-bill-history-vic-table-dc',
  templateUrl: './bill-history-vic-table-dc.component.html',
  styleUrls: ['./bill-history-vic-table-dc.component.scss']
})
export class BillHistoryVicTableDcComponent implements OnInit, OnChanges {
  /**
   * output variables
   */
  routeDetails: BillHistoryRouterDetails = new BillHistoryRouterDetails();
  itemsPerPage = 10;
  noOfRecords = 0;
  currentPage = 0;
  lang = 'en';
  placement = 'bottom right';
  filterSearch: BillHistoryFilterParams = new BillHistoryFilterParams();
  regexp: RegExp = new RegExp('^[0-9]+$');
  billIssueDates: DateFormat;
  /**
   * Input Variables
   */
  @Input() yesOrNoList: LovList;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  @Input() billPaymentStatus: LovList;
  @Input() mofBillHistoryDetails: BillHistoryWrapper;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * Output variable
   */
  @Output() routeTo: EventEmitter<BillHistoryRouterDetails> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() downLoadVic: EventEmitter<number> = new EventEmitter();
  @Output() filterDetails: EventEmitter<BillHistoryFilterParams> = new EventEmitter();
  @Output() SearchOfAmount: EventEmitter<BillHistoryFilterParams> = new EventEmitter();

  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.pageDetails?.currentValue) {
      this.pageDetails = changes.pageDetails.currentValue;
    }
    if (changes?.mofBillHistoryDetails?.currentValue) {
      this.mofBillHistoryDetails = changes.mofBillHistoryDetails.currentValue;
    }
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }
  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchAmountValue(amount: number) {
    if (amount) {
      this.filterSearch.isSearch = true;
      this.filterSearch.amount = amount;
      this.SearchOfAmount.emit(this.filterSearch);
    } else {
      this.filterSearch.isSearch = false;
      this.filterSearch.amount = 0;
      this.SearchOfAmount.emit(this.filterSearch);
    }
  }
  /**
   * /**
   *  Method to get hijri Payment date
   * @param date
   */
  getPaymentDate(paymentDate: GosiCalendar): string {
    if (paymentDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
      this.billIssueDates = this.formatDate(paymentDate?.gregorian);
      return this.getPaymentMonths(paymentDate?.gregorian);
    } else if (paymentDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      this.billIssueDates = this.formatDate(paymentDate?.hijiri, true);
      return this.getHijriPaymentMonths(paymentDate?.hijiri);
    }
  }
  getBillPeriod(issueDate: GosiCalendar): string {
    if (issueDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
      const calendarMonth = this.getMonthFromDate(issueDate.gregorian);
      return 'BILLING.' + 'MONTH-YEAR.' + calendarMonth.toUpperCase();
    } else if (issueDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      const calendarMonth = this.getHijiriMonthFromDate(issueDate.hijiri);
      return 'BILLING.' + 'HIJIRI-MONTH-YEAR.' + calendarMonth.toUpperCase();
    }
  }
  getMonthFromDate(date: Date | string) {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
  getBillPaymentYears(date: GosiCalendar) {
    if (date.entryFormat === CalendarTypeEnum.GREGORIAN) return this.getPaymentYears(date.gregorian);
    else return this.getPaymentYears(date.hijiri, true);
  }
  getHijiriMonthFromDate(date: Date | string) {
    return Object.keys(HijiriMonths)[new Date(date).getMonth()];
  }
  /**
   *  Method to get hijri Payment month
   * @param date
   */
  getHijriPaymentMonths(date: string) {
    return Object.values(HijiriMonths)[new Date(date).getMonth()];
  }
  /**
   * Method to format the date.
   * @param date date
   */
  formatDate(date: string | Date, isHijiri = false): DateFormat {
    const formattedDate: DateFormat = new DateFormat();
    formattedDate.date = this.getPaymentDays(date, isHijiri);
    formattedDate.year = this.getPaymentYears(date, isHijiri);
    return formattedDate;
  }
  /**
   * Method to get month from a given date
   * @param date date
   */
  getPaymentMonths(date: Date): string {
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to get day from a given date
   * @param date date
   */
  getPaymentDays(date: string | Date, isHijiri = false): string {
    return isHijiri ? new Date(date).getDate().toString() : moment(date).toDate().getDate().toString();
  }
  getPaymentYears(date: string | Date, isHijiri = false): string {
    return isHijiri ? new Date(date).getFullYear().toString() : moment(date).toDate().getFullYear().toString();
  }
  /**
   *
   * @param index method to trigger routing to bill-summary page
   */
  routeToBillSummaryScreenDetails(index) {
    this.routeDetails.destinationPageName = 'bill-summary';
    this.routeDetails.index = index;
    this.routeTo.emit(this.routeDetails);
  }
  /**
   *
   * @param index method to trigger routing to bill-details page
   */
  routeToBillScreenDetails(index) {
    this.routeDetails.destinationPageName = 'bill-details';
    this.routeDetails.index = index;
    this.routeTo.emit(this.routeDetails);
  }

  onFilter(filterParams: BillHistoryFilterParams) {
    if (this.filterSearch.isSearch) {
      filterParams.amount = this.filterSearch.amount;
    }
    this.filterSearch = filterParams;
    this.filterDetails.emit(filterParams);
  }
  /**
   *
   * @param index method to trigger routing to allocation page
   */
  routeToAllocationScreenDetails(index) {
    this.routeDetails.destinationPageName = 'allocation';
    this.routeDetails.index = index;
    this.routeTo.emit(this.routeDetails);
  }
  downLoadVicBill(billDetails: BillHistory) {
    this.downLoadVic.emit(billDetails.billNumber);
  }
}
