/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeToken,
  CalendarService,
  CalendarTypeEnum,
  GosiCalendar,
  LanguageToken,
  LookupService,
  LovList,
  OccupationList,
  addMonths,
  convertToHijriFormat,
  endOfMonth,
  hijiriToJSON,
  startOfDay,
  startOfMonth,
  subtractDays
} from '@gosi-ui/core';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  CoveragePeriodWrapper,
  EngagementPeriod,
  Establishment,
  ModifyCoverage,
  ModifyEngagementPeriod,
  PeriodChangeDetails,
  SystemParameter
} from '../../../shared';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'cnt-period-details-dc',
  templateUrl: './period-details-dc.component.html',
  styleUrls: ['./period-details-dc.component.scss']
})
export class PeriodDetailsDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  /** Local variables. */
  selectedPeriod: EngagementPeriod;
  isPeriodSplit = false;
  periods: EngagementPeriod[] = [];
  showWarning = false;
  nextPeriod: EngagementPeriod; // The next period to be made selected in calendar and grid.
  activeStartDate: Date; // Selected periods start date.
  enableCalendarView = true;
  activePeriodIndex: number;
  modifyCoveragePeriod: ModifyEngagementPeriod = new ModifyEngagementPeriod();
  tempCoverageModify: ModifyCoverage = new ModifyCoverage();
  coverageEdited = false;
  isFound = false;
  modalRef: BsModalRef;
  dateForm: FormGroup;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  maxHijiriDate = '13/04/1439';
  maxEndDateForHijiri = new Date('2017-12-31');
  minHijiriDate: string;
  minGregorianDate: Date;
  maxGregorianDate: Date;
  lang = 'en';
  startYear: number;
  endYear: number;
  startMonthLabel: GosiCalendar;
  endMonthLabel: GosiCalendar;
  isPeriodActive = false;
  splitStartdate: Date;
  splittedPeriods: EngagementPeriod[] = [];
  currentDateHijiri: string;
  joiningDateG: Date;
  disableSplit: boolean = false;
  showMandatoryErr: boolean = false;

  /** Input variables. */
  @Input() engagementPeriods: EngagementPeriod[];
  @Input() occupationList: OccupationList;
  @Input() yesOrNoList: LovList;
  @Input() isWageVerified: boolean;
  @Input() parentForm: FormGroup;
  @Input() systemParameter: SystemParameter;
  @Input() editMode: boolean;
  @Input() changesInPeriod: PeriodChangeDetails[];
  @Input() disableCalendar = false;
  @Input() isSaudiPerson: boolean;
  @Input() isProactive: boolean;
  @Input() isGccEstblishment: boolean;
  @Input() newCoverages: LovList;
  @Input() reasonForChange: LovList;
  @Input() joiningDate: Date;
  @Input() coveragePeriod: CoveragePeriodWrapper;
  @Input() modifyCoverage: boolean;
  @Input() tempModifyCoveragePeriod: ModifyCoverage;
  @Input() isPrevious: boolean;
  @Input() isHijiri: boolean;
  @Input() formSubmissionDate: Date;
  @Input() checkPrivate: boolean;
  @Input() isAppPublic: boolean;
  @Input() ppaIndicator: boolean;
  @Input() wageDetails: any;
  @Input() establishment: Establishment;

  /** Output variables. */
  @Output() verifyWage = new EventEmitter();
  @Output() deletePeriod: EventEmitter<Date> = new EventEmitter();
  @Output() periodEdit: EventEmitter<boolean> = new EventEmitter();
  @Output() modifyCoverageValue: EventEmitter<boolean> = new EventEmitter();
  @Output() modifyCoverageDateValue: EventEmitter<object> = new EventEmitter();
  @Output() saveModifyCoverage: EventEmitter<ModifyCoverage> = new EventEmitter();

  @ViewChild('periodSplitModal', { static: true })
  periodSplitModal: TemplateRef<HTMLElement>;
  currentDateGreg: Date;

  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly calendarService: CalendarService,
    fb: FormBuilder,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb);
    this.disableOrEnableCalendar();
  }

  /** Initialises the component. */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.calendarService.getSystemRunDate().subscribe(res => {
      this.currentDateHijiri = res?.hijiri;
      this.currentDateGreg = res?.gregorian;
    });
    // forms for handling hijri and gregorian calender
    this.dateForm = this.createDateTypeForm();
    this.dateForm
      .get('splitDate.gregorian')
      .valueChanges.pipe(
        filter(() => this.dateForm.get('splitDate.gregorian').valid),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.checkingSplitDate(this.dateForm.get('splitDate.gregorian').value);
      });
    // this.dateForm
    //   .get('splitDate.hijiri')
    //   .valueChanges.pipe(
    //     filter(() => this.dateForm.get('splitDate.hijiri').valid),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(() => {
    //     this.checkingSplitDate(this.dateForm.get('splitDate.hijiri').value);
    //   });
  }

  /**
   * Method to handle the changes in the input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementPeriods && changes.engagementPeriods.currentValue) {
      this.selectPeriodForView();
    }
    if (changes.coveragePeriod && changes.coveragePeriod.currentValue) {
      this.coveragePeriod = this.coveragePeriod;
    }
    if (changes.isWageVerified && changes.isWageVerified.currentValue === true) {
      this.activePeriodIndex = null;
      this.showWarning = false;
    }

    if (changes.editMode || changes.disableCalendar) {
      this.disableOrEnableCalendar();
    }
    if (changes.tempModifyCoveragePeriod && changes.tempModifyCoveragePeriod.currentValue) {
      if (this.isPrevious) this.tempCoverageModify = this.tempModifyCoveragePeriod;
    }
    if(changes && changes.isSaudiPerson){
      this.isSaudiPerson=changes.isSaudiPerson.currentValue;
    }
    if(changes && changes.isProactive){
      this.isProactive=changes.isProactive.currentValue;
    }
    // this.checkPeriod();
  }

  checkPeriod() {
    let flag = false;
    const maxLimit = moment(this.systemParameter.CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE).toDate();
    if (moment(this.selectedPeriod.startDate.gregorian).isBefore(maxLimit, 'day')) {
      flag = true;
      this.enableCalendarView = false;
    }

    //console.log(flag);
  }

  /** Method to enable and disable calendar  */
  disableOrEnableCalendar(): void {
    // this.enableCalendarView =
    //   this.appToken === ApplicationTypeEnum.PUBLIC
    //     ? false
    //     : this.editMode
    //     ? false
    //     : this.disableCalendar
    //     ? false
    //     : true;

    this.enableCalendarView = this.editMode ? false : this.disableCalendar ? false : true;
  }
  /** Method to select the period from period list. */
  selectPeriodForView() {
    if (!this.selectedPeriod) {
      this.selectedPeriod = JSON.parse(JSON.stringify(this.engagementPeriods[0]));
      this.nextPeriod = JSON.parse(JSON.stringify(this.engagementPeriods[0]));
      this.activeStartDate = this.selectedPeriod.startDate.gregorian;
    } else {
      const index = this.identifyIndexOfSelectedPeriod(this.engagementPeriods, this.nextPeriod.startDate.gregorian);
      this.selectedPeriod = JSON.parse(JSON.stringify(this.engagementPeriods[index]));
      this.activeStartDate = new Date(this.selectedPeriod.startDate.gregorian);
    }
    this.periods = [...this.createPeriodList(this.selectedPeriod.id)];
    this.isPeriodSplit = this.periods.length > 1 ? true : false;
  }

  /** Method to identify the index of selected period. */
  identifyIndexOfSelectedPeriod(periods: EngagementPeriod[], startDate: Date) {
    let index = 0;
    periods.forEach((period, i) => {
      if (moment(period.startDate.gregorian).isSame(startDate)) {
        index = i;
      }
    });
    return index;
  }

  /**
   * Method to handle period change.
   * @param index index of period record.
   */
  periodChanged(index: number) {
    this.selectedPeriod = JSON.parse(JSON.stringify(this.engagementPeriods[index]));
    this.nextPeriod = JSON.parse(JSON.stringify(this.engagementPeriods[index]));
    this.periods = [...this.createPeriodList(this.selectedPeriod.id)];
    this.isPeriodSplit = this.periods.length > 1 ? true : false;
    this.activePeriodIndex = undefined;
  }

  // Method to emit verify Wage details
  verifyWageDetails(identifier: number) {
    this.disableSplit = false;
    this.nextPeriod = JSON.parse(JSON.stringify(this.periods[identifier]));
    this.verifyWage.emit({ periods: this.periods, updatedPeriod: this.periods[identifier] });
  }

  /** Method to split the period if start date of period is beyond limit. */
  splitSelectedPeriod(index: number) {
    this.isPeriodSplit = true;
    const newStartDate = startOfDay(this.systemParameter.CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE);
    const newEndDate = startOfDay(subtractDays(this.systemParameter.CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE, 1));
    const periods: EngagementPeriod[] = [];
    const period1: EngagementPeriod = JSON.parse(JSON.stringify(this.periods[index]));
    const period2: EngagementPeriod = JSON.parse(JSON.stringify(this.periods[index]));
    period2.endDate.gregorian = newEndDate;
    period1.startDate.gregorian = newStartDate;
    period1.isSplit = true;
    periods.push(period1);
    periods.push(period2);
    this.periods = [...this.addSplitPeriodsToPeriodList(periods)];
    this.activePeriodIndex = this.identifyIndexOfSelectedPeriod(this.periods, periods[0].startDate.gregorian);
    this.periodEdit.emit(true);
    // this.selectedPeriod = this.periods[index + 1];
  }

  /**
   * Method to handle period split on calendar widget.
   * @param periods splitted periods
   */
  handleCalendarSplit(periods: EngagementPeriod[]) {
    if (periods.length > 1) {
      this.isPeriodSplit = true;
      this.showWarning = true;
      this.periodEdit.emit(true);
      this.periods = [...this.addSplitPeriodsToPeriodList(periods)];
      this.activePeriodIndex = this.identifyIndexOfSelectedPeriod(this.periods, periods[0].startDate.gregorian);
    }
  }

  /**
   * Method to handle deleting split period.
   * @param index index
   */
  deleteSplitPeriod(index: number) {
    const periods = JSON.parse(JSON.stringify(this.periods));
    const discardedPeriod: EngagementPeriod = periods[index];
    if (index === 0) {
      if (discardedPeriod.endDate) {
        periods[index + 1].endDate.gregorian = endOfMonth(discardedPeriod.endDate.gregorian);
        if (this.checkPrivate) {
          periods[index + 1].endDate.gregorian = discardedPeriod.endDate.gregorian;
          periods[index + 1].endDate.hijiri = discardedPeriod.endDate.hijiri;
        }
      } else periods[index + 1].endDate = undefined;
    } else {
      periods[index + 1].endDate.gregorian = endOfMonth(discardedPeriod.startDate.gregorian);
      if (this.checkPrivate) periods[index + 1].endDate.hijiri = discardedPeriod.startDate.hijiri;
    }
    periods.splice(index, 1);
    this.periods = periods;
    if (discardedPeriod.wageDetailsUpdated) this.deletePeriod.emit(discardedPeriod.startDate.gregorian);
    this.selectedPeriod = JSON.parse(JSON.stringify(this.periods[index]));
    this.nextPeriod = JSON.parse(JSON.stringify(this.selectedPeriod));
    this.showWarning = false;
    this.disableSplit = false;
  }

  /**
   * Method to create splitted period list.
   * @param periodId period Id
   */
  createPeriodList(periodId: number) {
    const periods = JSON.parse(JSON.stringify(this.engagementPeriods));
    return periods.filter(item => item.id === periodId);
  }

  /**
   * Method to add newly splitted periods to period list.
   * @param periods splitted periods
   */
  addSplitPeriodsToPeriodList(periods: EngagementPeriod[]) {
    const newPeriods: EngagementPeriod[] = [];
    const startDate = periods.reverse()[0].startDate.gregorian;
    let isFound = false;
    this.createPeriodList(periods[0].id).forEach(period => {
      if (moment(startDate).isSame(period.startDate.gregorian) && !isFound) {
        isFound = true;
        periods.reverse().forEach(item => {
          newPeriods.push(item);
        });
      } else {
        newPeriods.push(period);
      }
    });
    return newPeriods;
  }

  /**
   * Handle selection on editing the wage.
   * @param index index
   */
  handleSelectionOnEdit(index: number) {
    this.activePeriodIndex = index;
    this.periodEdit.emit(true);
    if (!moment(this.selectedPeriod.startDate.gregorian).isSame(this.periods[index].startDate.gregorian)) {
      this.selectedPeriod = JSON.parse(JSON.stringify(this.periods[index]));
      this.activeStartDate = this.selectedPeriod.startDate.gregorian;
    }
  }

  /** Method to handle period edit cancel. */
  cancelPeriodEdit() {
    this.disableSplit = false;
    this.activePeriodIndex = null;
    this.periodEdit.emit(false);
  }
  modifyCoverages(res) {
    if (this.parentForm.get('modifiedCoverage').get('modifyCoverages').value === false) this.periodEdit.emit(false);
    else {
      this.periodEdit.emit(true);
      this.modifyCoverageValue.emit(res);
    }
  }

  modifyCoverageDate(res) {
    this.modifyCoverageDateValue.emit(res);
  }

  modifycoverageEdit(res) {
    if (this.parentForm.get('modifiedCoverage').valid) {
      this.coverageEdited = res;
      this.isFound = false;
      if (this.tempCoverageModify.engagementPeriods.length === 0) {
        this.tempCoverageModify.engagementPeriods.push(this.addCoverageValue());
        this.isFound = true;
      } else {
        this.tempCoverageModify.engagementPeriods.forEach(res => {
          if (moment(res.engagementWageCoverageId).isSame(this.selectedPeriod.id)) {
            this.addCoverageValue(res);
            this.isFound = true;
          }
        });
      }
      if (!this.isFound) this.tempCoverageModify.engagementPeriods.push(this.addCoverageValue());
      this.periodEdit.emit(false);
    } else this.periodEdit.emit(true);
    this.saveModifyCoverage.emit(this.tempCoverageModify);
  }
  addCoverageValue(value?) {
    let temp: ModifyEngagementPeriod = new ModifyEngagementPeriod();
    if (value) temp = value;
    // let temp: ModifyEngagementPeriod = new ModifyEngagementPeriod();
    temp.coverages = this.parentForm.get('modifiedCoverage').get('modifyCoverage').get('coverages').value;
    temp.engagementWageCoverageId = this.selectedPeriod.id;
    temp.endDate = this.selectedPeriod.endDate;
    temp.startDate = this.selectedPeriod.startDate;
    temp.reasonForCoverageModification = this.parentForm
      .get('modifiedCoverage')
      .get('modifyCoverage')
      .get('reasonForChange').value;
    temp.modified = true;
    this.modifyCoveragePeriod = temp;
    return this.modifyCoveragePeriod;
  }

  /** Method to show a confirmation popup for reseting the form. */
  showModals(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  showTemplate() {
    this.dateForm.get('splitDate.gregorian').reset();
    this.dateForm.get('splitDate.hijiri').reset();
    if (this.selectedPeriod.startDate.entryFormat === this.typeHijira) {
      this.dateForm.get('dateFormat.english').setValue(this.typeHijira);
      this.dateForm.get('splitDate.hijiri').setValidators([Validators.required]);
      this.dateForm.get('splitDate.gregorian').clearValidators();
    } else {
      this.dateForm.get('dateFormat.english').setValue(this.typeGregorian);
      this.dateForm.get('splitDate.gregorian').setValidators([Validators.required]);
      this.dateForm.get('splitDate.hijiri').clearValidators();
    }
    this.dateForm.get('splitDate.hijiri').updateValueAndValidity();
    this.dateForm.get('splitDate.gregorian').updateValueAndValidity();
    // this.startMonthLabel =
    //   Object.values(MonthYearLabel)[moment(this.selectedPeriod.startDate.gregorian).toDate().getMonth()];
    this.startMonthLabel = this.selectedPeriod.startDate;
    this.startYear = moment(this.selectedPeriod.startDate.gregorian).toDate().getFullYear();
    this.minGregorianDate =
      this.ppaIndicator &&
      new Date(this.selectedPeriod.startDate.gregorian) < this.systemParameter.PPA_CALENDAR_SHIFT_DATE &&
      this.selectedPeriod.startDate.entryFormat === this.typeGregorian
        ? startOfMonth(addMonths(moment(this.systemParameter.PPA_CALENDAR_SHIFT_DATE).toDate(), 0))
        : startOfMonth(addMonths(moment(this.selectedPeriod.startDate.gregorian).toDate(), 1));
    this.setMinOrMaxhijiriDate(this.minGregorianDate, true);
    if (this.selectedPeriod.endDate && this.selectedPeriod.endDate.gregorian) {
      this.isPeriodActive = false;
      // this.endMonthLabel =
      //   Object.values(MonthYearLabel)[moment(this.selectedPeriod.endDate.gregorian).toDate().getMonth()];
      this.endMonthLabel = this.selectedPeriod.endDate;
      this.endYear = moment(this.selectedPeriod.endDate.gregorian).toDate().getFullYear();
      this.maxGregorianDate = moment(this.selectedPeriod.endDate.gregorian).toDate();
      if (
        (!this.ppaIndicator && this.maxGregorianDate <= this.maxEndDateForHijiri) ||
        (this.ppaIndicator && this.maxGregorianDate <= this.systemParameter.PPA_CALENDAR_SHIFT_DATE)
      ) {
        this.setMinOrMaxhijiriDate(this.maxGregorianDate, false);
      } else {
        this.maxHijiriDate = this.ppaIndicator
          ? moment(this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA).isAfter(moment(this.currentDateGreg))
            ? convertToHijriFormat(this.currentDateHijiri)
            : this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA
          : '13/04/1439';
      }
    } else {
      this.isPeriodActive = true;
      this.maxGregorianDate = new Date();

      this.maxHijiriDate = this.ppaIndicator
        ? moment(this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA).isAfter(moment(this.currentDateGreg))
          ? convertToHijriFormat(this.currentDateHijiri)
          : this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA
        : this.maxHijiriDate; //'13/04/1439';
    }
    /** split required only when there is 2 months difference  */
    if (this.selectedPeriod?.startDate?.entryFormat === this.typeHijira) {
      let hijiriSplitCheck = this.hijriSameMonthCheck(
        this.selectedPeriod?.startDate?.hijiri,
        this.selectedPeriod?.endDate?.hijiri ? this.selectedPeriod?.endDate?.hijiri : this.currentDateHijiri
      );
      if (!hijiriSplitCheck) this.showModals(this.periodSplitModal);
    } else if (this.maxGregorianDate >= this.minGregorianDate) this.showModals(this.periodSplitModal);
  }

  hijriSameMonthCheck(startDate, endDate) {
    if (endDate === null || endDate === undefined) return false;
    let splitType1 = this.splitType(startDate);
    const dateArr1 = startDate?.split(splitType1);
    let year1, month1;
    if (splitType1 === '/') {
      month1 = dateArr1[1].padStart(2, '0');
      year1 = dateArr1[2];
    } else if (splitType1 === '-') {
      year1 = dateArr1[0];
      month1 = dateArr1[1].padStart(2, '0');
    }
    const dateArr2 = endDate?.split(splitType1);
    let year2, month2;
    if (splitType1 === '/') {
      month2 = dateArr2[1].padStart(2, '0');
      year2 = dateArr2[2];
    } else if (splitType1 === '-') {
      year2 = dateArr2[0];
      month2 = dateArr2[1].padStart(2, '0');
    }
    if (month1 == month2 && year1 == year2) return true;
    else return false;
  }

  splitType(date) {
    let splitType: '/' | '-';
    if (date.includes('/')) {
      splitType = '/';
    } else if (date.includes('-')) {
      splitType = '-';
    }
    return splitType;
  }

  decline() {
    this.hideModal();
  }

  confirm() {
    if (this.dateForm.valid) {
      this.calendarSplit(this.splittedPeriods);
      this.disableSplit = true;
      this.hideModal();
    } else {
      this.showMandatoryErr = true;
    }
  }
  onHijiriDateChange() {
    const formData = this.dateForm.get('splitDate')?.get('hijiri');
    if (formData.valid && formData.value) this.checkingSplitDate(formData.value);
  }

  checkingSplitDate(startDate) {
    // if(this.dateForm.get('dateFormat.english').value === this.typeHijira){  //flag true for hijiri
    if (this.selectedPeriod.startDate.entryFormat === this.typeHijira) {
      this.dateForm.get('splitDate.hijiri').setValidators([Validators.required]);
      this.dateForm.get('splitDate.gregorian').clearValidators();

      this.calendarService
        .getGregorianDate(hijiriToJSON(this.dateForm.get('splitDate.hijiri').value))
        .subscribe(res => {
          this.joiningDateG = res.gregorian;
          startDate = moment(this.joiningDateG).toDate();
          this.checkSplitDate(startDate);
        });
    } else {
      this.dateForm.get('splitDate.gregorian').setValidators([Validators.required]);
      this.dateForm.get('splitDate.hijiri').clearValidators();
      this.joiningDateG = startDate;
      this.checkSplitDate(startDate);
    }
    this.dateForm.get('splitDate.hijiri').updateValueAndValidity();
    this.dateForm.get('splitDate.gregorian').updateValueAndValidity();
  }

  checkSplitDate(startDate) {
    this.splittedPeriods = [];
    const period1: EngagementPeriod = JSON.parse(JSON.stringify(this.selectedPeriod));
    const period2: EngagementPeriod = JSON.parse(JSON.stringify(this.selectedPeriod));
    if (period1.endDate) {
      period1.endDate.gregorian = startOfDay(subtractDays(startDate, 1));
      this.lookupService.getHijriDate(period1.endDate.gregorian).subscribe(res => {
        period1.endDate.hijiri = res.hijiri;
        period2.startDate.gregorian = startOfDay(startDate);
        this.lookupService.getHijriDate(period2.startDate.gregorian).subscribe(res => {
          // period2.startDate.hijiri = hijiriToJSON(this.dateForm.get('splitDate.hijiri').value);
          period2.startDate.hijiri = res.hijiri;
          if (this.dateForm.get('splitDate.hijiri').value) period2.startDate.entryFormat = this.typeHijira;
          period2.wageDetailsUpdated = undefined;
          period2.isSplit = true;
          this.splittedPeriods.push(period2);
          this.splittedPeriods.push(period1);
        });
      });
    } else {
      const endDate = new GosiCalendar();
      endDate.gregorian = startOfDay(subtractDays(startDate, 1));
      period1.endDate = endDate;
      this.lookupService.getHijriDate(period1.endDate.gregorian).subscribe(res => {
        period1.endDate.hijiri = res.hijiri;
        period2.startDate.gregorian = startOfDay(startDate);
        this.lookupService.getHijriDate(period2.startDate.gregorian).subscribe(res => {
          // period2.startDate.hijiri = hijiriToJSON(this.dateForm.get('splitDate.hijiri').value);
          period2.startDate.hijiri = res.hijiri;
          if (this.dateForm.get('splitDate.hijiri').value) period2.startDate.entryFormat = this.typeHijira;
          period2.wageDetailsUpdated = undefined;
          period2.isSplit = true;
          this.splittedPeriods.push(period2);
          this.splittedPeriods.push(period1);
        });
      });
    }
    // period2.startDate.gregorian = startOfDay(startDate);
    // period2.startDate.hijiri = hijiriToJSON(this.dateForm.get('splitDate.hijiri').value);
    // if(this.dateForm.get('splitDate.hijiri').value)
    //     period2.startDate.entryFormat=this.typeHijira;
    // period2.wageDetailsUpdated = undefined;
    // period2.isSplit = true;
    // this.splittedPeriods.push(period2);
    // this.splittedPeriods.push(period1);
  }

  calendarSplit(periods: EngagementPeriod[]) {
    if (periods.length > 1) {
      this.isPeriodSplit = true;
      this.showWarning = true;
      this.periodEdit.emit(true);
      this.periods = [...this.addSplitPeriodsToPeriodList(periods)];
      this.activePeriodIndex = this.identifyIndexOfSelectedPeriod(this.periods, periods[0].startDate.gregorian);
    }
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }

  createDateTypeForm() {
    return this.fb.group({
      dateFormat: this.fb.group({
        english: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [this.typeHijira, { validators: Validators.required, updateOn: 'blur' }]
      }),
      splitDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: [null],
        entryFormat: [null]
      })
    });
  }
  /** Method to switch calendar type */
  switchCalendarType(type) {
    this.dateForm.get('dateFormat.english').setValue(type);
    this.dateForm.get('splitDate.entryFormat').setValue(type);
  }

  // set minhijiri date
  setMinOrMaxhijiriDate(gregorianDate, flag) {
    this.lookupService.getHijriDate(gregorianDate).subscribe(res => {
      flag
        ? (this.minHijiriDate = this.hijriSameMonthCheck(res.hijiri, this.selectedPeriod.startDate.hijiri)
            ? this.setStartOfNextHijiriMonth(res.hijiri)
            : this.startMonthHijiri(res.hijiri))
        : (this.maxHijiriDate = convertToHijriFormat(res.hijiri));
    });
  }

  startMonthHijiri(date) {
    const dateArr = date.split('-');
    let year, month, day;
    year = dateArr[0];
    month = dateArr[1].padStart(2, '0');
    let tday = '1';
    day = tday.padStart(2, '0');
    return day + '/' + month + '/' + year;
  }

  setStartOfNextHijiriMonth(date) {
    const dateArr = date.split('-');
    let year, month, day;
    year = parseInt(dateArr[0], null);
    month = parseInt(dateArr[1], null) + 1;
    if (month == 13) {
      month = 1;
      year = year + 1;
    }
    let tday = '1';
    day = tday.padStart(2, '0');
    month = month.toString().padStart(2, '0');
    return day + '/' + month + '/' + year;
  }
}
