/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BilingualText,
  CalendarTypeEnum,
  convertToStringDDMMYYYY,
  endOfMonth,
  GosiCalendar,
  hijiriToJSON,
  Lov,
  LovList,
  startOfMonth
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../../shared/constants';
import { DueDateWidgetLabels, HijiriMonths, Months, GregorianMonthsNumbers, HijiriMonthsNumbers } from '../../../../shared/enums';
import { BillDetails, BillHistoryWrapper, BillPeriods, DateFormat } from '../../../../shared/models';
import { contractSocialInsuranceNo } from 'testing';

@Component({
  selector: 'blg-vic-bill-details-dc',
  templateUrl: './vic-bill-details-dc.component.html',
  styleUrls: ['./vic-bill-details-dc.component.scss']
})
export class VicBillDetailsDcComponent implements OnInit, OnChanges {
  /**
   * This method isto create an instance of BillingDetailsDcComponent
   * @param fb form builder
   */
  constructor(private fb: FormBuilder, readonly modalService: BsModalService) { }

  /* Local variables */
  billingForms: FormGroup;
  paymentsMonth: string;
  paymentDate: DateFormat;
  billIssueMonths: string;
  billIssueMonthHijiri: string;
  billIssueDateHijiri: DateFormat;
  billEventMonths: string;
  billIssueDates: DateFormat;
  dateFormat = 'MMMM YYYY';
  maxDate: Date;
  maxDateHijiri: string;
  totalLateFees = 0;
  tabIndicator = 0;
  modalRef: BsModalRef;
  minimumDate: Date;
  isLastGregorian = true;
  initialLoad = false;
  minimumDateHijiri: string;
  creditAmount = 0;
  monthDiff = 0;
  paidFlag = false;
  billAmt = 0;
  showDetailsFlag = false;
  creditValue = -1;
  currencyType: BilingualText;
  exchangeRate = 1;
  creditFlag = false;
  newPreviousBill = 0;
  monthLabelDueDate: string = DueDateWidgetLabels.ONE_MONTH;
  monthLabelDelayed: string = DueDateWidgetLabels.ONE_MONTH;
  isGregorianFormat = false;
  isHijiriFormat = false;
  showNewMonthPicker: boolean = true;
  billPeriodFormYear: FormGroup;
  billPeriodFormMonth: FormGroup;
  monthLov: LovList;
  selectedYear: BilingualText;
  max : string;
  excelImgSrc = 'assets/images/downloadicons/xcel-on-white-bg-normal.svg';
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-white-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-white-bg-normal.svg';
  selectLov: LovList;
  monthIndex:number;
  /* Input variables */
  @Input() itemizedDataFlag: boolean;
  @Input() billDetails: BillDetails;
  @Input() isAdmin: boolean;
  @Input() selectedDate: Date;
  @Input() firstStartDate: Date;
  @Input() firstStartDateHijiri: string;
  @Input() isBillNumber: boolean;
  @Input() errorMessage: BilingualText;
  @Input() isDisable: boolean;
  @Input() gregorianDate: GosiCalendar;
  @Input() billHistory: BillHistoryWrapper;
  @Input() isLoaded: boolean;
  @Input() hijiriDateValue: string;
  @Input() selectedDateFormat: string;
  @Input() billPeriods: LovList;
  @Input() selectFlag: Object;
  /* Output variables */
  @Output() date: EventEmitter<string> = new EventEmitter();
  @Output() billingSummary: EventEmitter<null> = new EventEmitter();
  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() print: EventEmitter<null> = new EventEmitter();
  @Output() hijiriDateSet: EventEmitter<string> = new EventEmitter();
  /** This method is to initialise the component */
  ngOnInit() {
    this.setDates();
    this.billingForms = this.createBillDetailsForm();
    this.billingForms?.get('month')?.get('hijiri')?.setValue(null);
    this.billPeriodFormYear = this.createBillPeriodFormYear();
    this.billPeriodFormMonth = this.createBillPeriodFormMonth();
    this.currencyType = BillingConstants.CURRENCY_SAR;
    this.billingForms
      ?.get('month')
      ?.get('hijiri')
      ?.valueChanges.subscribe(date => {
        const actualDate = hijiriToJSON(date);
        if (
          (!this.initialLoad && !this.isLastGregorian) ||
          this.initialLoad ||
          (!this.isLoaded && this.selectedDateFormat === CalendarTypeEnum.HIJRI)
        ) {
          this.hijiriDateSet.emit(actualDate);
        }
        this.initialLoad = true;
      });
  }
  createBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [new Date(this.selectedDate)],
        hijiri: [this.hijiriDateValue]
      })
    });
  }
  createBillPeriodFormYear(){
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  createBillPeriodFormMonth(){
    return this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null, { updateOn: 'blur' }]
    });
  }
  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.exchangeRate?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if (changes && changes?.billHistory?.currentValue) {
      this.setDates();
    }
    if (changes && changes.billPeriods && changes.billPeriods.currentValue){
      this.billPeriods = changes.billPeriods.currentValue;
      if (!this.selectFlag) {
        this.max = this.billPeriods.items[this.billPeriods.items.length - 1].value.english;
        for(let i=0;i<this.billPeriods.items.length;i++){
          if(this.billPeriods.items[i].value.english >= this.max){
          this.max = this.billPeriods.items[i].value.english;
          this.billPeriodFormYear.get('english').setValue(changes.billPeriods.currentValue.items[i].value.english);
          this.onSelectStartYear(this.billPeriods.items[i]);
          break;
          }
        }  
      }
      else {
        let year = moment(this.selectedDate).toDate().getFullYear();
        this.monthIndex = moment(this.selectedDate).toDate().getMonth();
        this.billPeriods.items.forEach(item => {
          if (item.code == year) {
            this.billPeriodFormYear.get('english').setValue(item.value.english);
            this.onSelectStartYear(item);
          }
        });
      }
    }
    if (changes && changes.billDetails && changes.billDetails.currentValue) {
      this.getDashboardVicBillDetails();
      this.setMonth(this.billDetails.noOfDelayedPayments, this.billDetails.noOfPaidContribution);
      this.setDates();
    }
    if (this.billDetails.previousBill < 0) {
      this.newPreviousBill = this.billDetails.previousBill * this.creditValue;
    }
    this.detectChanges(changes);
    if (changes && changes?.firstStartDate && changes?.firstStartDate?.currentValue) {
      this.setDates();
      if (this.isLoaded) this.billingForms?.get('month')?.get('gregorian')?.setValue(new Date(this.maxDate));
      else {
        if (this.selectedDateFormat !== CalendarTypeEnum.HIJRI)
          this.billingForms?.get('month')?.get('gregorian')?.setValue(new Date(this.selectedDate));
        else this.billingForms?.get('month')?.get('gregorian')?.setValue(new Date(this.maxDate));
      }
    }
    if (changes?.hijiriDateValue && changes.hijiriDateValue?.currentValue) {
      this.hijiriDateValue = changes.hijiriDateValue?.currentValue;
    }
    if (changes && changes?.firstStartDateHijiri && changes?.firstStartDateHijiri?.currentValue) {
      this.setDates();
      if (this.isLoaded) this.billingForms?.get('month')?.get('hijiri')?.setValue(this.maxDateHijiri);
      else {
        this.hijiriDateValue = convertToStringDDMMYYYY(this.hijiriDateValue)?.toString();
        if (this.selectedDateFormat === CalendarTypeEnum.HIJRI)
          this.billingForms?.get('month')?.get('hijiri')?.setValue(this.hijiriDateValue);
        else this.billingForms?.get('month')?.get('hijiri')?.setValue(this.maxDateHijiri);
      }
    }
  }
  onSelectStartYear(year: Lov) {
    this.selectedYear = year.value;
    this.monthLov = new LovList([]);
    if(this.billPeriodFormYear.valueChanges){
      this.monthLov = new LovList(year.items);
      if(this.selectFlag){
        this.monthLov.items.forEach(item=>{
          if(item.sequence== this.monthIndex ){
            setTimeout(() => {
              this.billPeriodFormMonth.get('english').setValue(item.value.english);
            }, 100);
            this.billPeriodFormMonth.updateValueAndValidity();
          }       
        });
      }
      else{
        setTimeout(() => {
          this.billPeriodFormMonth.get('english').setValue(this.monthLov.items[this.monthLov.items.length - 1].value.english);
        }, 100);
        this.billPeriodFormMonth.updateValueAndValidity();        
      }
      let monthString = year.items[year.items.length - 1].value.english.toUpperCase().split('(')[0].slice(0, -1);    
      let month: number
      if (Object.keys(GregorianMonthsNumbers).includes(monthString)) {
        month = Object.keys(GregorianMonthsNumbers).indexOf(monthString) + 1;        
        let dateString = year.value.english + '-' + month + '-01';
        if (this.selectFlag) {
          this.date.emit(moment(new Date(this.selectedDate)).toDate().toString());
          this.selectFlag=false;
        }
        else {
          this.date.emit(moment(new Date(dateString)).toDate().toString());
        }
      }else {
        month = Object.keys(HijiriMonthsNumbers).indexOf(monthString) + 1;
        let dateString = year.value.english + '-' + month + '-01';
        this.hijiriDateSet.emit(dateString);
      }
    }
  }
  onSelectStartMonth(month: Lov) {
    let year = this.selectedYear.english;
    let monthString = month.value.english.toUpperCase().split('(')[0].slice(0, -1);
    let monthNumber: number;
    if (Object.keys(GregorianMonthsNumbers).includes(monthString)) {
      monthNumber = Object.keys(GregorianMonthsNumbers).indexOf(monthString) + 1;
      let dateString = year + '-' + monthNumber + '-01';
      this.date.emit(moment(new Date(dateString)).toDate().toString());
    }else{
      monthNumber = Object.keys(HijiriMonthsNumbers).indexOf(monthString) + 1;
      let dateString = year + '-' + monthNumber + '-01';
      this.hijiriDateSet.emit(dateString);
    }
  }
  detectChanges(changes: SimpleChanges) {
    if (changes && changes?.isLoaded && changes?.isLoaded?.currentValue) {
      this.isLoaded = changes?.isLoaded?.currentValue;
    }
    if (changes?.selectedDate && changes.selectedDate?.currentValue) {
      this.selectedDate = changes.selectedDate?.currentValue;
    }
    if (changes && changes?.errorMessage && changes?.errorMessage?.currentValue) {
      this.errorMessage = changes.errorMessage.currentValue;
    }
    if (changes?.selectedDateFormat && changes.selectedDateFormat?.currentValue) {
      this.selectedDateFormat = changes.selectedDateFormat?.currentValue;
    }
  }
  //Method to set arabic name for month
  setMonth(noOfDelayedPayments, noOfPaidContribution) {
    if (noOfDelayedPayments) {
      if (noOfDelayedPayments === 0 || noOfDelayedPayments === 1) {
        this.monthLabelDelayed = DueDateWidgetLabels.ONE_MONTH;
      } else if (noOfDelayedPayments === 2) {
        this.monthLabelDelayed = DueDateWidgetLabels.TWO_MONTHS;
      } else if (noOfDelayedPayments > 2) {
        this.monthLabelDelayed = DueDateWidgetLabels.MORE_THAN_THREE_MONTHS;
      }
    }
    if (noOfPaidContribution) {
      if (noOfPaidContribution === 0 || noOfPaidContribution === 1) {
        this.monthLabelDueDate = DueDateWidgetLabels.ONE_MONTH;
      } else if (noOfPaidContribution === 2) {
        this.monthLabelDueDate = DueDateWidgetLabels.TWO_MONTHS;
      } else if (noOfPaidContribution > 2) {
        this.monthLabelDueDate = DueDateWidgetLabels.MORE_THAN_THREE_MONTHS;
      }
    }
  }
  // Method to fetch bill details based on date
  getDashboardVicBillDetails() {
    if (this.billDetails.paidAmount >= this.billDetails.balanceDue) {
      this.paidFlag = true;
    }
    if (this.billDetails.billBreakUp.accountBreakUp === null) {
      this.billAmt =
        this.billDetails.previousBill +
        this.billDetails.lateFee +
        this.billDetails.currentBill +
        this.billDetails.adjustmentContribution;
    }
    if (this.billDetails.billBreakUp !== undefined) {
      if (this.billDetails.totalCreditRefund > 0) {
        this.billAmt =
          this.billDetails.previousBill +
          this.billDetails.lateFee +
          this.billDetails.currentBill +
          this.billDetails.adjustmentContribution -
          this.billDetails.billBreakUp.accountBreakUp.availableCredit;
      } else {
        this.billAmt =
          this.billDetails.previousBill +
          this.billDetails.lateFee +
          this.billDetails.currentBill +
          this.billDetails.adjustmentContribution -
          this.billDetails.billBreakUp.accountBreakUp.availableCredit;
      }
    }
    if (this.billAmt < 0) {
      this.creditFlag = true;
      this.creditAmount = this.billAmt * this.creditValue;
      if (this.billDetails.totalCreditRefund !== undefined) {
        this.creditAmount = this.creditAmount - this.billDetails.totalCreditRefund;
      }
    } else {
      this.creditFlag = false;
    }
    if (this.billDetails.billBreakUp.accountBreakUp.availableCredit === 0) {
      this.showDetailsFlag = true;
    } else {
      this.showDetailsFlag = false;
    }
  }

  /** Method to set dates for view. */
  setDates() {
    const hijiriDate = this.billHistory?.availableBillStartDate?.filter(
      item => item?.entryFormat === CalendarTypeEnum.HIJRI
    );
    if (
      this.billHistory?.availableBillStartDate[this.billHistory?.availableBillStartDate?.length - 1]?.entryFormat ===
      CalendarTypeEnum.GREGORIAN
    )
      this.isLastGregorian = true;
    else this.isLastGregorian = false;
    if (hijiriDate?.length > 0) {
      this.isHijiriFormat = true;
      this.maxDateHijiri = convertToStringDDMMYYYY(hijiriDate[hijiriDate?.length - 1].hijiri).toString();
      this.minimumDateHijiri = convertToStringDDMMYYYY(hijiriDate[0].hijiri).toString();
    }
    const gergorianDate = this.billHistory?.availableBillStartDate?.filter(
      item => item?.entryFormat === CalendarTypeEnum.GREGORIAN
    );
    if (gergorianDate?.length > 0) {
      this.isGregorianFormat = true;
      this.maxDate = endOfMonth(moment(gergorianDate[gergorianDate?.length - 1].gregorian).toDate());
      this.minimumDate = startOfMonth(moment(gergorianDate[0].gregorian).toDate());
    }
    if (this.billDetails?.issueDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
      this.isGregorianFormat = true;
      this.billIssueDates = this.formatDate(this.billDetails.issueDate?.gregorian);
      this.billIssueMonths = this.getMonths(this.billDetails.issueDate?.gregorian);
    } else if (this.billDetails?.issueDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      this.isHijiriFormat = true;
      this.billIssueDates = this.formatDate(this.billDetails.issueDate?.hijiri);
      this.billIssueMonths = this.getHijriMonths(this.billDetails.issueDate?.hijiri);
    }
    if (this.billDetails?.dueDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
      this.paymentDate = this.formatDate(this.billDetails.dueDate?.gregorian);
      this.paymentsMonth = this.getMonths(this.billDetails.dueDate?.gregorian);
    } else if (this.billDetails?.dueDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      this.paymentDate = this.formatDate(this.billDetails.dueDate?.hijiri);
      this.paymentsMonth = this.getHijriMonths(this.billDetails.dueDate?.hijiri);
    }
  }
  /** This method is to get the bill summary based on start date */
  onSelectStartDate(dateValue: string) {
    if (
      this.isLoaded ||
      (!this.isLoaded &&
        (this.selectedDateFormat !== CalendarTypeEnum.HIJRI ||
          this.billingForms?.get('month')?.get('gregorian')?.dirty))
    )
      this.date.emit(moment(new Date(dateValue)).toDate().toString());
  }
  downloadVicBill() {
    this.download.emit();
  }
  printVicBill() {
    this.print.emit();
  }
  getHijriMonths(date: string) {
    return Object.values(HijiriMonths)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to format the date.
   * @param date date
   */
  formatDate(date: string | Date): DateFormat {
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
  getDays(date: string | Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /** This method is to get bill summary details */
  getBillDetails() {
    if (this.isAdmin) {
      this.billingSummary.emit();
    }
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYears(date: string | Date): string {
    return moment(date).toDate().getFullYear().toString();
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }
}
