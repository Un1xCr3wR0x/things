/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Months } from '../../../../shared/enums';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillDetails, DateFormat, BillSummary, UnBillAmount } from '../../../../shared/models';
import { BillingConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-bill-balance-dc',
  templateUrl: './bill-balance-dc.component.html',
  styleUrls: ['./bill-balance-dc.component.scss']
})
export class BillBalanceDcComponent implements OnInit, OnChanges {
  /* Local variables */
  tempHide = true;
  paidAmount = 0;
  unpaidBalance = 0;
  balanceDue = 0;
  availableCreditBalance = 0;
  currentDate: DateFormat = new DateFormat();
  previousDate: DateFormat = new DateFormat();
  creditDate: DateFormat = new DateFormat();
  currentMonth = '';
  previousMonth = '';
  unPaidAmount = 0;
  excessPaidFlag = false;
  creditAmount = 0;
  creditBalance = false;
  lastBillAmount = 0;
  creditMonth = '';
  billAmountDate: Date;
  receiptCreditDate: Date;
  modalRef: BsModalRef;
  showMinimumRequired = false;
  currentCreditBalance = 0;
  selectedUrl: string;
  establishmentType: string;
  constructor(readonly modalService: BsModalService) {}
  /* Input variables */
  @Input() tabDetails;
  @Input() selectedTabName: string;
  @Input() billBalanceDetails: BillDetails;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() summary: BillSummary[];
  @Input() unBillAmount: UnBillAmount;
  @Input() isGccCountry: boolean;
  @Input() isMofFlag: boolean;
  @Input() isBillNumber: boolean;
  @Input() isNoBill: boolean;
  @Input() totalCreditBalance: number;

  @Output() estType : EventEmitter<string> = new EventEmitter();
  /* Method to instantiate the component. */
  ngOnInit() {
    this.initializeTheView();
  } 
  /**
   * Method to detect chaages in input.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.billBalanceDetails && changes.billBalanceDetails.currentValue) {
      this.billAmountDate = moment(this.billBalanceDetails.issueDate.gregorian).toDate();
      this.previousDate = this.formatDatesBillBalance(this.billAmountDate);
      this.previousMonth = this.getMonthFromDate(this.billAmountDate);
      this.receiptCreditDate = moment(this.billBalanceDetails.issueDate.gregorian).add(1, 'day').toDate();
      this.creditDate = this.formatDatesBillBalance(this.receiptCreditDate);
      this.creditMonth = this.getMonthFromDate(this.receiptCreditDate);
      this.paidAmount = changes.billBalanceDetails.currentValue.paidAmount;
      this.balanceDue = changes.billBalanceDetails.currentValue.balanceDue;
      if (changes && changes.totalCreditBalance) this.totalCreditBalance = changes.totalCreditBalance.currentValue;
      this.currentCreditBalance = this.totalCreditBalance - this.billBalanceDetails?.creditBalanceTransferredOrRefunded;
      this.unPaidAmount = this.billBalanceDetails.balanceDue - this.billBalanceDetails.paidAmount;
      this.showMinimumRequired =
        !this.isMofFlag &&
        this.billBalanceDetails !== undefined &&
        this.billBalanceDetails?.minimumPaymentRequiredForMonth !== null &&
        this.billBalanceDetails?.minimumPaymentRequiredForMonth !== 0
          ? true
          : false;

      if (this.balanceDue < this.billBalanceDetails.paidAmount) {
        this.excessPaidFlag = true;
        this.creditAmount =
          this.billBalanceDetails.paidAmount -
          this.billBalanceDetails.balanceDue -
          this.billBalanceDetails?.creditBalanceTransferredOrRefunded;
        if (this.isMofFlag) {
          this.creditAmount = this.billBalanceDetails.paidAmount - this.billBalanceDetails.balanceDue;
        }
      }

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
    }
  }
 /* * This method is to navigate to new tabs */
 goToNewTabs(selectedTab: string) {
  if (selectedTab === 'BILLING.PPA')
    this.establishmentType = 'PPA';
    this.selectedTabName = 'BILLING.PPA';
    if(selectedTab === 'BILLING.GOSI'){ 
      this.establishmentType = 'GOSI'; 
      this.selectedTabName = 'BILLING.GOSI';   
    }
    this.estType.emit(this.establishmentType);
  }
  
  /** Method to initialize the view. */
  initializeTheView() {
    this.currentDate.date = moment().toDate().getDate().toString();
    this.currentDate.year = moment().toDate().getFullYear().toString();

    this.currentMonth = Object.values(Months)[moment().toDate().getMonth()];
  }
  /**
   * Method to format the date.
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
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYearFromDate(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
  }
}
