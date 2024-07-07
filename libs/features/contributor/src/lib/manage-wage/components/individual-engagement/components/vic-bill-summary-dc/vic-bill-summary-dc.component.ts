import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { BillDetails, DateFormat } from '@gosi-ui/features/contributor/lib/shared';
import moment from 'moment';

@Component({
  selector: 'cnt-vic-bill-summary-dc',
  templateUrl: './vic-bill-summary-dc.component.html',
  styleUrls: ['./vic-bill-summary-dc.component.scss']
})
export class VicBillSummaryDcComponent implements OnInit, OnChanges {
  /* Local variables */
  tempHide = true;
  currentMonth = '';
  previousMonth = '';
  unPaidAmount = 0;
  creditAmount = 0;
  paidAmount = 0;
  unpaidBalance = 0;
  balanceDue = 0;
  availableCreditBalance = 0;
  excessPaidFlag = false;
  creditDate: DateFormat = new DateFormat();
  currentDate: DateFormat = new DateFormat();
  previousDate: DateFormat = new DateFormat();
  creditMonth = '';
  billAmountDate: Date;
  receiptCreditDate: Date;
  creditBalance = false;
  lastBillAmount = 0;

  constructor() {}
  /* Input variables */
  @Input() personId: string;
  @Input() lang: string;
  @Input() billBalanceDetails: BillDetails;
  @Output() show: EventEmitter<TemplateRef<HTMLElement>> = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() navigate: EventEmitter<null> = new EventEmitter();

  /* Method to instantiate the component. */
  ngOnInit() {
    this.initializeTheViewDetails();
    this.billAmountDate = moment(this.billBalanceDetails?.lastBillEndDate?.gregorian).toDate();
    this.previousDate = this.formatDatesBillBalanceDetails(this.billAmountDate);
    // this.previousMonth = this.getMonthFromDateDetails(this.billAmountDate);

    this.receiptCreditDate = moment(this.billBalanceDetails?.lastBillEndDate?.gregorian).add(1, 'day').toDate();
    this.creditDate = this.formatDatesBillBalanceDetails(this.receiptCreditDate);
    //  this.creditMonth = this.getMonthFromDateDetails(this.receiptCreditDate);
  }

  /**
   * Method to detect chaages in input.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.billBalanceDetails && changes.billBalanceDetails.currentValue) {
      this.paidAmount = changes?.billBalanceDetails?.currentValue?.paidAmount;
      this.balanceDue = changes?.billBalanceDetails?.currentValue?.balanceDue;
      this.unPaidAmount = this.billBalanceDetails?.balanceDue - this.billBalanceDetails?.paidAmount;
      if (this.balanceDue - this.paidAmount > 0) {
        this.unpaidBalance = this.balanceDue - this.paidAmount;
      } else {
        this.availableCreditBalance = this.paidAmount - this.balanceDue;
      }
      if (this.balanceDue < 0) {
        this.lastBillAmount = Math.abs(this.balanceDue);
        this.unPaidAmount = this.balanceDue + this.paidAmount;
        this.creditBalance = true;
      }
      if (this.balanceDue <= this.billBalanceDetails.paidAmount) {
        this.excessPaidFlag = true;
        this.creditAmount =
          this.billBalanceDetails.paidAmount -
          this.billBalanceDetails.balanceDue -
          this.billBalanceDetails.creditBalanceRefunded;
      }
    }
  }

  /** Method to initialize the view. */
  initializeTheViewDetails() {
    // this.currentDate.date = moment().toDate().getDate().toString();
    this.currentDate.year = moment(new Date()).subtract(1, 'month').toDate().getFullYear().toString();
    //this.currentMonth = Object.values(Months)[moment(new Date()).subtract(1, 'month').toDate().getMonth()];
  }
  /**
   * Method to format the date.
   * @param date date
   */
  formatDatesBillBalanceDetails(date: Date): DateFormat {
    const formattedDate: DateFormat = new DateFormat();
    //  formattedDate.date = this.getDayFromDateValue(date);
    formattedDate.year = this.getYearFromDateValue(date);
    return formattedDate;
  }
  /**
   * Method to get day from a given date
   * @param date date
   */
  getDayFromDateValue(date: Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  //  getMonthFromDateDetails(date: Date): string {
  //    return Object.values(Months)[moment(date).toDate().getMonth()];
  //  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYearFromDateValue(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
  }

  navigateTo() {
    this.navigate.emit();
  }
  hideModal() {
    this.close.emit();
  }
  showModal(template) {
    this.show.emit(template);
  }
}
