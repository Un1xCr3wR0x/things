/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  CalendarService,
  CalendarTypeEnum,
  convertToStringDDMMYYYY,
  convertToYYYYMMDD,
  CurrencyToken,
  downloadFile,
  ExchangeRateService,
  GosiCalendar,
  hijiriToJSON,
  LanguageToken,
  LookupService,
  StorageService
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { BillingConstants, ReportConstants } from '../../../../shared/constants';
import { HijiriMonths, LanguageTypeEnum, Months } from '../../../../shared/enums';
import { AllocationDetails, CreditAllocation, DateFormat } from '../../../../shared/models';
import {
  BillDashboardService,
  BillingRoutingService,
  DetailedBillService,
  EventDateService,
  ReportStatementService
} from '../../../../shared/services';
@Component({
  selector: 'blg-allocation-bill-vic-sc',
  templateUrl: './allocation-bill-vic-sc.component.html',
  styleUrls: ['./allocation-bill-vic-sc.component.scss']
})
export class AllocationBillVicScomponent implements OnInit {
  /** Local Variables */
  minDateCal: Date;
  minDatehijiri: string;
  maxDateCal: Date;
  maxDateHijiri: string;
  dateFormat = 'MMMM YYYY';
  hijiriDateSelected: string;
  allocationForm: FormGroup;
  allocationDetails: AllocationDetails;
  sinNo: number;
  dateSelected: string;
  isGregorianFormat = false;
  isHijiriFormat = false;
  billIssueDate: string;
  closedAtDate: string;
  noBillMsg: string;
  lang = 'en';
  languageType: string;
  selectedTab = 'BILLING.CREDITS';
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  currentCurrency = 'SAR';
  exchangeRate = 1;
  billNo: number;
  isNoVicAllocation = false;
  lists: CreditAllocation[] = [];
  creditSummaryValue: CreditAllocation[];
  allocationCreditTotal = 0;
  contributorName;
  closeDates;
  closeMonths;
  dateValueFormat: string;
  tabList = ['BILLING.CREDITS', 'BILLING.ALLOCATION-OF-CREDITS', 'BILLING.ALLOCATION-CONTRIBUTION-SUMMARY'];
  _availableBillDates: GosiCalendar[] = [];
  get availableBillDates(): GosiCalendar[] {
    return this._availableBillDates;
  }
  set availableBillDates(dates: GosiCalendar[]) {
    if (this._availableBillDates.length === 0 && dates?.length > 0) {
      this._availableBillDates = dates;
      this.setGregorianBillDates(dates?.filter(date => date.entryFormat !== CalendarTypeEnum.HIJRI));
      this.setHijiriBillDates(dates?.filter(date => date.entryFormat === CalendarTypeEnum.HIJRI));
    }
  }

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private fb: FormBuilder,
    readonly billDashboardService: BillDashboardService,
    readonly detailedBillService: DetailedBillService,
    readonly billingRoutingService: BillingRoutingService,
    readonly storageService: StorageService,
    readonly exchangeRateService: ExchangeRateService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly route: ActivatedRoute,
    readonly eventDateService: EventDateService,
    readonly router: Router,
    readonly reportStatementService: ReportStatementService,
    readonly lookupService: LookupService,
    readonly calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.route.queryParams.subscribe(params => {
      this.dateSelected = params.monthSelected;
      this.billIssueDate = params.billIssueDate;
      this.sinNo = params.sinNo;
      this.dateValueFormat = params.entryFormat;
    });
    this.allocationForm = this.createAllocationBillDetailsForm();
    this.allocationForm
      ?.get('month')
      ?.get('hijiri')
      ?.valueChanges.subscribe(date => {
        const actualDate = hijiriToJSON(date);
        this.getGregorianAllcoationDate(actualDate);
      });
    this.fetchBillDates(this.billIssueDate);
  }

  fetchBillDates(firstBillIssueDate: string) {
    this.billDashboardService.getBillNumber(this.sinNo, firstBillIssueDate).subscribe(
      res => {
        this.availableBillDates = res?.availableBillStartDate;
        this.selectBillDate(this.dateSelected);
        this.getVicCreditDetails();
      },
      () => {
        this.navigateBack();
      }
    );
  }
  /**
   *
   * @param date method to convert gregorian to hijiri
   * @param patch
   */
  convertGregorianToHijiri(date: Date | string, patch?: boolean) {
    this.getHijriAllocationDate(moment(date).toDate()).subscribe(res => {
      this.hijiriDateSelected = convertToStringDDMMYYYY(res.hijiri).toString();
      if (patch) {
        this.allocationForm?.get('month')?.get('hijiri').patchValue(this.hijiriDateSelected, { emitEvent: true });
      }
    });
  }
  /** This method is to set the inital date for the calander */
  createAllocationBillDetailsForm() {
    return this.fb.group({
      month: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      })
    });
  }
  /**
   * Method to get the hijiri allocation date
   */
  getHijriAllocationDate(minDateCal: Date): Observable<GosiCalendar> {
    return this.lookupService.getHijriDate(minDateCal);
  }
  /**
   * Method to get the Gregorian allocation date
   */
  getGregorianAllcoationDate(hijriDate: string) {
    this.calendarService.getGregorianDate(hijriDate).subscribe(res => {
      this.selectAllocationStartDate(moment(new Date(res?.gregorian)).toDate()?.toString());
    });
  }
  /** This method is to get the month from the calander */
  selectAllocationStartDate(dateValue: string) {
    const isSame = moment(this.dateSelected).isSame(new Date(dateValue), 'day');
    this.dateSelected = convertToYYYYMMDD(dateValue).toString();
    if (!isSame) {
      this.getVicCreditDetails();
    }
  }

  /**
   * This method to get allocation summary details
   * @param sinNo social insurance Number
   * @param billNo bill Number
   */
  getVicCreditDetails() {
    this.billDashboardService.getBillNumber(this.sinNo, this.dateSelected).subscribe(
      res => {
        this.billNo = res.bills[0].billNumber;
        this.isNoVicAllocation = false;
        this.getVicAllocationDetails();
      },
      err => {
        const errorMessage = err.error.message;
        if (
          errorMessage?.english === BillingConstants.ERROR_MESSAGE ||
          err.error.code === BillingConstants.DROPPED_MONTH_ERROR_CODE
        ) {
          this.noBillMsg = errorMessage;
          this.isNoVicAllocation = true;
        }
      }
    );
  }

  getVicAllocationDetails() {
    this.detailedBillService.getVicCreditDetails(this.sinNo, this.billNo).subscribe(data => {
      this.allocationDetails = data;
      if (this.allocationDetails.closingDate?.entryFormat === CalendarTypeEnum.GREGORIAN) this.isGregorianFormat = true;
      else if (this.allocationDetails.closingDate?.entryFormat === CalendarTypeEnum.HIJRI) this.isHijiriFormat = true;
      this.allocationCreditTotal =
        this.allocationDetails.creditAdjustment +
        this.allocationDetails.creditFromPrevious +
        this.allocationDetails.totalPayment;
      this.setContributorName(this.allocationDetails);
      this.getvICAllocationValues(this.allocationDetails);

      if (this.allocationDetails.closingDate?.entryFormat === CalendarTypeEnum.GREGORIAN) {
        this.isGregorianFormat = true;
        this.closeDates = this.formatDate(this.allocationDetails.closingDate?.gregorian);
        this.closeMonths = this.getMonths(this.allocationDetails.closingDate?.gregorian);
      } else if (this.allocationDetails.closingDate?.entryFormat === CalendarTypeEnum.HIJRI) {
        this.isHijiriFormat = true;
        this.closeDates = this.formatDate(this.allocationDetails.closingDate?.hijiri);
        this.closeMonths = this.getHijriMonths(this.allocationDetails.closingDate?.hijiri);
      }
    });
  }
  setContributorName(allocationDetails?) {
    let contributorNameEng: string;
    let contributorNameArb: string;
    if (allocationDetails.contributorName?.english?.name)
      contributorNameEng = allocationDetails.contributorName?.english.name;
    if (allocationDetails?.contributorName?.arabic)
      contributorNameArb =
        allocationDetails.contributorName?.arabic.firstName +
        ' ' +
        allocationDetails.contributorName?.arabic.secondName +
        ' ' +
        allocationDetails.contributorName?.arabic.thirdName +
        ' ' +
        allocationDetails.contributorName.arabic?.familyName;
    this.contributorName = {
      contributorNameEng: contributorNameEng,
      contributorNameArb: contributorNameArb
    };
  }
  printVicAllocationBill() {
    this.reportStatementService
      .generateVicAllocationReport(Number(this.sinNo), Number(this.billNo), this.languageType)
      .subscribe(res => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  downloadVicAllocationBill() {
    this.reportStatementService
      .generateVicAllocationReport(Number(this.sinNo), Number(this.billNo), this.languageType)
      .subscribe(data => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
      });
  }
  /** Method to get allocati{on details and pushing this to new list */
  getvICAllocationValues(allocationDetailValue) {
    this.creditSummaryValue = [];
    this.lists = [];

    for (let i = 0; i < allocationDetailValue.creditAllocation.length; i++) {
      this.lists.push(allocationDetailValue.creditAllocation[i]);
      const allocationValues = {
        amountFromPreviousBill: {
          debitAmount: this.lists[i].amountFromPreviousBill.debitAmount,
          allocatedAmount: this.lists[i].amountFromPreviousBill.allocatedAmount,
          balance:
            this.lists[i].amountFromPreviousBill.debitAmount - this.lists[i].amountFromPreviousBill.allocatedAmount
        },
        adjustmentForCurrent: {
          debitAmount: this.lists[i].adjustmentForCurrent.debitAmount,
          allocatedAmount: this.lists[i].adjustmentForCurrent.allocatedAmount,
          balance: this.lists[i].adjustmentForCurrent.debitAmount - this.lists[i].adjustmentForCurrent.allocatedAmount
        },
        currentMonthDues: {
          debitAmount: this.lists[i].currentMonthDues.debitAmount,
          allocatedAmount: this.lists[i].currentMonthDues.allocatedAmount,
          balance: this.lists[i].currentMonthDues.debitAmount - this.lists[i].currentMonthDues.allocatedAmount
        },
        type: this.lists[i].type
      };
      this.creditSummaryValue.push(allocationValues);
    }
  }

  /** Method to navigate back to receipt list view. */
  navigateBack() {
    this.billingRoutingService.navigateToVicBillHistory(this.sinNo);
  }

  goToNewTab(selectedTab: string) {
    this.selectedTab = selectedTab;
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
   * Method to get day from a given date
   * @param date date
   */
  getDays(date: string | Date): string {
    return moment(date).toDate().getDate().toString();
  }

  /**
   * Method to get year from a given date
   * @param date date
   */
  getYears(date: string | Date): string {
    return moment(date).toDate().getFullYear().toString();
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonths(date: Date): string {
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to set min and max gregorian engagements
   * @param gregorianBillDates
   */
  setGregorianBillDates(gregorianBillDates: GosiCalendar[] = []) {
    this.minDateCal = new Date(gregorianBillDates[0]?.gregorian);
    if (gregorianBillDates[gregorianBillDates?.length - 1]?.gregorian) {
      this.maxDateCal = new Date(gregorianBillDates[gregorianBillDates?.length - 1]?.gregorian);
    } else this.maxDateCal = null;
  }
  /**
   * Method to set min and max hijiri engagements
   * @param hijiriBillDates
   */
  setHijiriBillDates(hijiriBillDates: GosiCalendar[] = []) {
    this.minDatehijiri = convertToStringDDMMYYYY(hijiriBillDates[0]?.hijiri);
    this.maxDateHijiri = convertToStringDDMMYYYY(hijiriBillDates[hijiriBillDates?.length - 1]?.hijiri);
  }

  selectBillDate(date: string | Date) {
    if (date) {
      if (this.dateValueFormat === CalendarTypeEnum.GREGORIAN) {
        this.allocationForm?.get('month')?.get('gregorian').patchValue(new Date(date), { emitEvent: false });
      } else
        this.allocationForm?.get('month')?.get('gregorian').patchValue(new Date(this.maxDateCal), { emitEvent: false });
    }
    if (this.dateValueFormat !== CalendarTypeEnum.GREGORIAN) {
      this.convertGregorianToHijiri(date, true);
    } else {
      if (this.maxDateHijiri) {
        this.allocationForm
          ?.get('month')
          ?.get('hijiri')
          .patchValue(convertToStringDDMMYYYY(this.maxDateHijiri).toString(), { emitEvent: false });
      }
    }
  }
}
