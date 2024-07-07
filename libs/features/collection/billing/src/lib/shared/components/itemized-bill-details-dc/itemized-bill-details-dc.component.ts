/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BilingualText, endOfMonth, startOfMonth, subtractMonths } from '@gosi-ui/core';
import moment from 'moment';
import { DateFormat, BillDetails, ItemizedBillDetailsWrapper } from '../../models';
import { Months } from '../../enums';

@Component({
  selector: 'blg-itemized-bill-details-dc',
  templateUrl: './itemized-bill-details-dc.component.html',
  styleUrls: ['./itemized-bill-details-dc.component.scss']
})
export class ItemizedBillDetailsDcComponent implements OnInit, OnChanges {
  /**
   * This method isto create an instance of BillingDetailsDcComponent
   * @param fb form builder
   */
  constructor(private fb: FormBuilder, readonly modalService: BsModalService) {}

  /* Local variables */
  billingForm: FormGroup;
  paymentMonth: string;
  paymentDate: DateFormat;
  billIssueMonth: string;
  billEventMonth: string;
  billIssueDate: DateFormat;
  dateFormat = 'MMMM YYYY';
  minDate: Date;
  maxDate: Date;
  tabIndicator = 0;
  modalRef: BsModalRef;
  totalLateFees = 0;
  monthDifference = 0;
  paidIconFlag = false;
  billAmount = 0;
  creditAmount = 0;
  creditValue = -1;
  creditFlag = false;
  itemizedPreviousBill = 0;
  datevalue: Date;
  isActiveInstallment = false;
  currentMonthAmount = 0;

  /* Input variables */
  @Input() itemizedBillDetails: BillDetails;
  @Input() accountDetails;
  @Input() isAdmin: boolean;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() isGccCountry: boolean;
  @Input() itemizedBillList: ItemizedBillDetailsWrapper;
  @Input() noOfDays: number;
  @Input() selectedDate: string;
  @Input() isMofFlag: boolean;
  @Input() isBillNumber: boolean;
  @Input() errorMessage: BilingualText;
  @Input() initialStartDate: Date;
  @Input() billStartDate: Date;
  /* Output variables */
  @Output() itemizedDetails: EventEmitter<null> = new EventEmitter();
  @Output() itemizedDate: EventEmitter<string> = new EventEmitter();

  /** This method is to initialise the component */
  ngOnInit() {
    this.minDate = endOfMonth(new Date(this.initialStartDate));
    this.maxDate = endOfMonth(new Date(this.billStartDate));
    this.datevalue = endOfMonth(new Date(this.selectedDate));
    if (this.isMofFlag) {
      this.maxDate =(endOfMonth(subtractMonths(new Date(), 1)));
    }
    this.billingForm = this.createBillDetailsForm();
    this.setDatesForView();
    this.billingForm.updateValueAndValidity();
  }
  createBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [this.datevalue],
        hijiri: ['']
      })
    });
  }

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.initialStartDate?.currentValue) {
      this.initialStartDate = changes.initialStartDate.currentValue;
      this.minDate = endOfMonth(new Date(this.initialStartDate));
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }

    if (changes?.accountDetails?.currentValue) {
      this.accountDetails = changes.accountDetails.currentValue;
    }
    if (changes?.selectedDate?.currentValue) {
      this.selectedDate = changes.selectedDate.currentValue;
    }
    if (!this.isMofFlag) {
      if (changes && changes.itemizedBillDetails && changes.itemizedBillDetails.currentValue) {
        this.getitemizedBillDetails();
      }
      if (changes?.billStartDate?.currentValue) {
        this.billStartDate = changes.billStartDate.currentValue;
        this.maxDate = endOfMonth(new Date(this.billStartDate));
      }
    } else if (this.isMofFlag) {
      if (
        changes &&
        changes.itemizedBillDetails &&
        changes.itemizedBillDetails.currentValue &&
        !changes.itemizedBillDetails.isFirstChange()
      ) {
        this.getitemizedBillDetails();
      }
    }
  }

  /** This method is used to set min date , max date and other calculated values  */
  getitemizedBillDetails() {
    if (this.itemizedBillDetails) {
      if (this.itemizedBillDetails.lateFee !== null)
        this.currentMonthAmount = this.itemizedBillDetails.currentBill + this.itemizedBillDetails.lateFee;
      else this.currentMonthAmount = this.itemizedBillDetails.currentBill;
    }
    if (this.itemizedBillDetails.initialBillStartDate.gregorian !== undefined) {
      if (this.isMofFlag) {
        this.minDate = new Date('2022-01-01T00:00:00.000Z');
      }
     else if (!this.isMofFlag && this.itemizedBillDetails.initialBillStartDate?.gregorian < this.itemizedBillDetails.ameenStartDate?.gregorian)
        this.minDate = startOfMonth(moment(this.itemizedBillDetails.ameenStartDate?.gregorian).toDate());
      else this.minDate = startOfMonth(moment(this.itemizedBillDetails.initialBillStartDate.gregorian).toDate());
    }
    this.setDatesForView();
    if (this.itemizedBillDetails.paidAmount >= this.itemizedBillDetails.balanceDue) {
      this.paidIconFlag = true;
    }
    if (this.itemizedBillDetails.billBreakUp.accountBreakUp === null) {
      this.billAmount =
        this.itemizedBillDetails.previousBill + this.itemizedBillDetails.lateFee + this.itemizedBillDetails.currentBill;
    }

    ///add conditions to mof screen
    if (this.itemizedBillDetails.billBreakUp.accountBreakUp !== null) {
      if (this.itemizedBillDetails.amountTransferredToMof !== 0 && !this.isMofFlag) {
        this.billAmount =
          this.itemizedBillDetails.previousBill +
          this.itemizedBillDetails.lateFee +
          this.itemizedBillDetails.currentBill -
          this.itemizedBillDetails.billBreakUp.accountBreakUp.availableCredit -
          this.itemizedBillDetails.amountTransferredToMof;
      } else {
        this.billAmount =
          this.itemizedBillDetails.previousBill +
          this.itemizedBillDetails.lateFee +
          this.itemizedBillDetails.currentBill -
          this.itemizedBillDetails.billBreakUp.accountBreakUp.availableCredit;
      }
    }
    if (this.billAmount < 0) {
      this.creditFlag = true;
      this.creditAmount = this.billAmount * this.creditValue;
    } else {
      this.creditFlag = false;
    }
    if (this.itemizedBillDetails.previousBill < 0) {
      this.itemizedPreviousBill = this.itemizedBillDetails.previousBill * this.creditValue;
    }
  }

  /** This method is to get the bill summary based on start date */
  selectStartDate(dateValue: string) {
    this.itemizedDate.emit(moment(dateValue).toDate().toString());
  }
  /** Method to set dates for view. */
  setDatesForView() {
    this.paymentDate = this.formatDates(this.itemizedBillDetails.dueDate.gregorian);
    this.billIssueDate = this.formatDates(this.itemizedBillDetails.issueDate.gregorian);
    this.billIssueMonth = this.getMonths(this.itemizedBillDetails.issueDate.gregorian);
    this.paymentMonth = this.getMonths(this.itemizedBillDetails.dueDate.gregorian);
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
   * Method to get day from a given date
   * @param date date
   */
  getDays(date: Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonths(date: Date): string {
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYears(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
  }

  getDashboardBillDetails() {
    if (this.isAdmin) {
      this.itemizedDetails.emit();
    }
  }

  /** Method to show modal. */
  showAvailableCreditModel(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: false, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
}
