/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, convertToYYYYMMDD, endOfMonth, startOfMonth, subtractMonths } from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Months } from '../../../../shared/enums';
import {
  BillDetails,
  DateFormat,
  DetailedBillViolationDetails,
  EstablishmentShare,
  ItemizedRejectedOHWrapper
} from '../../../../shared/models';

@Component({
  selector: 'blg-bill-details-dc',
  templateUrl: './bill-details-dc.component.html',
  styleUrls: ['./bill-details-dc.component.scss']
})
export class BillDetailsDcComponent implements OnInit, OnChanges {
  /**
   * This method isto create an instance of BillingDetailsDcComponent
   * @param fb form builder
   */
  constructor(private fb: FormBuilder, readonly modalService: BsModalService) {}

  /* Local variables */
  billingForm: FormGroup;
  selectedChart = ''; //holds the name of the section in chart user clicked on
  colorCode = 0;
  paymentMonth: string;
  month: DateFormat;
  paymentDate: DateFormat;
  billIssueMonth: string;
  billEventMonth: string;
  billIssueDate: DateFormat;
  dateFormat = 'MMMM YYYY';
  minDateValue: Date;
  maxDate: Date;
    tabIndicator = 0;
  modalRef: BsModalRef;
  totalLateFees = 0;
  monthDifference = 0;
  paidIconFlag = false;
  billAmount = 0;
  showDetailsFlag = false;
  creditAmount = 0;
  creditValue = -1;
  creditFlag = false;
  recordDate: Date;
  showOldRecords: boolean;
  newPreviousBill = 0;
  currentMonthAmount = 0;
  billNo: number;
  isShow: boolean;
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-white-bg-hover.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-white-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-white-bg-normal.svg';
  showMinimumRequired = false;
  /* Input variables */
  @Input() billDetails: BillDetails;
  @Input() establishmentType: string;
  @Input() isAdmin: boolean;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  @Input() isGccCountry: boolean;
  @Input() lawType: BilingualText;
  @Input() isPPA: boolean;
  @Input() isMofFlag: boolean;
  @Input() itemizedDataFlag: boolean;
  @Input() selectedDate: Date;
  @Input() isBillNumber: boolean;
  @Input() initialStartDate: Date;
  @Input() latestBillStartDate: Date;
  @Input() errorMessage: BilingualText;
  @Input() isDisabled: boolean;
  @Input() isNoBillMonth: boolean;
  @Input() rejectedOhDetails: ItemizedRejectedOHWrapper;
  @Input() violationDetails: DetailedBillViolationDetails;
  @Input() initialLoad: boolean;
  @Input() isMigratedBill: boolean;
  @Input() violationCount: number;
  @Input() employerShare: EstablishmentShare;
  @Input() billNumber: number;

  /* Output variables */
  @Output() billingSummary: EventEmitter<Date> = new EventEmitter();
  @Output() date: EventEmitter<string> = new EventEmitter();
  @Output() downloadBill: EventEmitter<null> = new EventEmitter();
  @Output() printBill: EventEmitter<null> = new EventEmitter();
  @Output() showRecords: EventEmitter<null> = new EventEmitter();

  /** This method is to initialise the component */
  ngOnInit() {
    this.billingForm = this.createBillDetailsForm();
    this.setDatesForView();
    this.recordDate = new Date('2015-12-30T00:00:00.000Z');
    this.maxDate = startOfMonth(this.selectedDate, true);
      this.billingForm?.get('month')?.get('gregorian')?.setValue(startOfMonth(this.maxDate));
    if (this.isMofFlag) {
      this.maxDate = (endOfMonth(subtractMonths(new Date(), 1)));
    }
  }

  createBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [new Date(this.selectedDate)],
        hijiri: ['']
      })
    });
  }
  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.initialLoad) this.initialLoad = changes.initialLoad.currentValue;
    if (changes && changes?.initialStartDate) {
      this.initialStartDate = changes?.initialStartDate.currentValue;
      this.getRecordsDifference(this.initialStartDate);
      this.setMaxDate();
    }
    if (changes && changes?.isMigratedBill) {
      this.isMigratedBill = changes?.isMigratedBill?.currentValue;
    }
    if (changes && changes?.violationDetails) {
      this.violationDetails = changes?.violationDetails?.currentValue;
    }
    if (changes && changes.billDetails) {
      this.billDetails = changes.billDetails.currentValue;
      if (this.billDetails) {
        this.initialBreakupView(this.billDetails.summary);

        if (this.billDetails.lateFee !== null)
          this.currentMonthAmount = this.billDetails.currentBill + this.billDetails.lateFee;
        else this.currentMonthAmount = this.billDetails.currentBill;
          this.billNo = this.billDetails.billNo;
       if(this.billNo === this.billNumber){
          this.isShow = true;
      }
      }
      this.setDatesForView();
      this.getDashboardBillDetails();
      this.showMinimumRequired =
        !this.isMofFlag &&
        this.billDetails !== undefined &&
        this.billDetails?.minimumPaymentRequired !== null &&
        this.billDetails?.minimumPaymentRequired !== 0
          ? true
          : false;
    } else {
      if (this.isMofFlag) {
        this.setDatesForView();
        this.getDashboardBillDetails();
      }
    }
    if (changes && changes?.initialStartDate && this.isMofFlag) {
       //this.maxDate = endOfMonth(this.initialStartDate, true);
            this.billingForm?.get('month')?.get('gregorian')?.setValue(endOfMonth(this.initialStartDate, true));
    }
    this.detectChange(changes);
  }
  detectChange(changes: SimpleChanges) {
    if (changes?.selectedDate && this.billingForm) {
      this.selectedDate = changes.selectedDate?.currentValue;
      if (!this.initialLoad) this.billingForm.get('month').get('gregorian').setValue(new Date(this.selectedDate));
    }
    this.billDetails.billBreakUp.adjustmentBreakUp.adjustmentDetails.forEach(element => {
      if (element.amount === 0 && element.noOfContributor === 0 && element.penalty === 0 && element.total === 0) {
        this.tabIndicator = 0;
      }
    });
    if (this.billDetails.previousBill < 0) {
      this.newPreviousBill = this.billDetails.previousBill * this.creditValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.currencyType = changes.currencyType?.currentValue;
      this.exchangeRate = changes.exchangeRate?.currentValue;
    }
  }
  getRecordsDifference(initialStartDate: Date) {
    const recordsDifference = moment(initialStartDate).diff(this.recordDate, 'days');
    if (recordsDifference < 1) this.showOldRecords = true;
    else this.showOldRecords = false;
  }
  viewOldRecords() {
    this.showRecords.emit();
  }
  setMaxDate() {
    if (!this.isMofFlag) {
      if (this.initialStartDate) {
        this.maxDate = endOfMonth(this.initialStartDate, true);
      }
      if (!this.initialLoad) this.maxDate = endOfMonth(this.latestBillStartDate, true);
      if (this.initialLoad)
        this.billingForm?.get('month')?.get('gregorian')?.setValue(endOfMonth(this.initialStartDate, true));
    }
  }
  // Method to fetch bill details based on date
  getDashboardBillDetails() {
    if (this.billDetails.initialBillStartDate.gregorian !== undefined) {
      this.minDateValue = startOfMonth(this.billDetails.initialBillStartDate.gregorian, true);
      //this.minDateValue = new Date('2022-01-01T00:00:00.000Z');
      if(this.establishmentType === 'PPA'){
        this.minDateValue = startOfMonth(this.billDetails.ppaEffectiveDate.gregorian,true);
      }
    }

    if (this.billDetails.paidAmount >= this.billDetails.balanceDue) {
      this.paidIconFlag = true;
    }

    if (!this.isMofFlag) {
      if (this.billDetails.billBreakUp.accountBreakUp === null) {
        this.billAmount = this.billDetails.previousBill + this.billDetails.lateFee + this.billDetails.currentBill;
      }
    } else {
      this.billAmount =
        this.billDetails.previousBill +
        this.billDetails.currentBill -
        this.billDetails.billBreakUp.accountBreakUp.availableCredit;
    }
    if (!this.isMofFlag) {
      if (this.billDetails.amountTransferredToMof !== 0) {
        this.billAmount =
          this.billDetails.previousBill +
          this.billDetails.lateFee +
          this.billDetails.currentBill -
          this.billDetails.billBreakUp.accountBreakUp.availableCredit -
          this.billDetails.amountTransferredToMof;
      } else if (this.billDetails.amountTransferredToMof === 0) {
        this.billAmount =
          this.billDetails.previousBill +
          this.billDetails.lateFee +
          this.billDetails.currentBill -
          this.billDetails.billBreakUp.accountBreakUp.availableCredit;
      }
    }
    if (this.billAmount < 0) {
      this.creditFlag = true;
      this.creditAmount = this.billAmount * this.creditValue;
    } else {
      this.creditFlag = false;
    }
    if (this.billDetails.billBreakUp.accountBreakUp.availableCredit === 0) {
      this.showDetailsFlag = true;
    } else {
      this.showDetailsFlag = false;
    }
  }

  /** This method is to get the bill summary based on start date */
  selectStartDate(dateValue: string) {
    this.isShow = false;
    if (this.billingForm?.get('month')?.get('gregorian')?.dirty) {
      this.date.emit(moment(dateValue).toDate().toString());
    }
    this.getRecordsDifference(moment(dateValue).toDate());
    this.resetChartTab();
  }
  /** Method to set dates for view. */
  setDatesForView() {
    this.paymentDate = this.formatDates(this.billDetails.dueDate.gregorian);
    this.billIssueDate = this.formatDates(this.billDetails.issueDate.gregorian);
    this.billIssueMonth = this.getMonths(this.billDetails.issueDate.gregorian);
    this.paymentMonth = this.getMonths(this.billDetails.dueDate.gregorian);
  }
  downloadBillTransaction(val) {
    this.downloadBill.emit(val);
  }
  printBillTransaction() {
    this.printBill.emit();
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

  /** This method is to get bill summary details */
  getBillDetails() {
    if (this.isAdmin) {
      const dateValue = this.billingForm?.get('month')?.get('gregorian')?.value;
      this.billingSummary.emit(dateValue);
    }
  }
  /**reset chart details */
  resetChartTab() {
    this.tabIndicator = 0;
    this.initialBreakupView(this.billDetails.summary);
  }
  /**
   * Method to switch bill breakup view.
   * @param id tab id
   */
  switchBreakupView(id) {
    this.tabIndicator = id?.tabIndicator;
    this.selectedChart = id?.selectedChart;
    if (this.selectedChart === 'Contributions' || this.selectedChart === 'الاشتراكات') {
      this.colorCode = 0;
    } else if (this.selectedChart === 'Adjustments' || this.selectedChart === 'التسويات') {
      this.colorCode = 1;
    } else if (this.selectedChart === 'Rejected OH Claims' || this.selectedChart === 'إصابات العمل المرفوضة') {
      this.colorCode = 2;
    } else if (this.selectedChart === 'Violations' || this.selectedChart === 'إصابات العمل المرفوضة') {
      this.colorCode = 3;
    }
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }

  /**initial colour code*/
  initialBreakupView(summary) {
    if (summary?.length > 0) {
      if (
        summary?.[0].amount > 0 &&
        (summary?.[0].type.english === 'Contributions' || summary?.[0].type.arabic === 'الاشتراكات')
      ) {
        this.selectedChart = 'Contributions';
        this.colorCode = 0;
      } else if (
        summary?.[1].amount > 0 &&
        (summary?.[1].type.english === 'Adjustments' || summary?.[1].type.arabic === 'التسويات')
      ) {
        this.selectedChart = 'Adjustments';
        this.colorCode = 1;
      } else if (
        summary?.[2].amount > 0 &&
        (summary?.[2].type.english === 'Rejected OH Claims' || summary?.[2].type.arabic === 'إصابات العمل المرفوضة')
      ) {
        this.selectedChart = 'Rejected OH Claims';
        this.colorCode = 2;
      } else if (
        summary?.[3].amount > 0 &&
        (summary?.[3].type.english === 'Violations' || summary?.[3].type.arabic === 'إصابات العمل المرفوضة')
      ) {
        this.selectedChart = 'Violations';
        this.colorCode = 3;
      }
    }
  }
}
