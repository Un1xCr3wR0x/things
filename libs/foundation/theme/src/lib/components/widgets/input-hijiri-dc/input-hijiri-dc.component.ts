/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputBaseComponent, LanguageEnum, LanguageToken, LookupService, getErrorMsg, startOfDay } from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HijiriEngine } from './engine/hijiri.engine';
import { DateType } from './enums/date-type';
import { CalendarCellViewModel, DatepickerViewMode } from './models';
const typeDate = 'date';
const calendarStartDate = 1296;

/**
 * Component used to handle date fields.
 *
 * @export
 * @class InputDateDcComponent
 */
@Component({
  selector: 'gosi-input-hijiri-dc',
  templateUrl: './input-hijiri-dc.component.html',
  styleUrls: ['./input-hijiri-dc.component.scss']
})
export class InputHijiriDcComponent extends InputBaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() minDate;
  @Input() maxDate;
  @Input() isMonthPicker = false;
  @Input() placeholder;
  @Input() fromSelected;
  @Input() toSelected;
  @Input() fromDate;
  @Input() isDateConversion;
  @Input() hideOptionalLabel = false;

  @Output() changeEvent: EventEmitter<null> = new EventEmitter();

  viewMode: string;
  showContainer = false;
  monthControl = new FormControl();
  selectedLang = 'en';
  inputmask = '00/00/0000';
  @ViewChild('hijiriPicker', { static: false }) hijiriPicker: ElementRef;
  @ViewChild('hijiriContainer', { static: false }) hijiriContainer: ElementRef;
  @ViewChild('hijiriPickerIcon', { static: false }) hijiriPickerIcon: ElementRef;
  todaysDate: string;

  /**
   * Listener to handle outside click
   * @param event
   */
  @HostListener('document:mousedown', ['$event'])
  onClick(event) {
    if (this.hijiriPicker?.nativeElement.contains(event?.target)) {
      // this.hijiriEngine.setActiveDate(this.control.value);
      this.hijiriEngine.setMaxDate(this.maxDate);
      this.hijiriEngine.setMinDate(this.minDate);
      this.updateControl();
    }
  }
  /**
   * Listener to handle outside click
   * @param event
   */
  @HostListener('document:mouseup', ['$event'])
  onOutsideClick(event) {
    if (
      event.which === 1 &&
      !this.hijiriPicker?.nativeElement.contains(event?.target) &&
      !this.hijiriContainer?.nativeElement.contains(event?.target) &&
      !this.hijiriPickerIcon?.nativeElement.contains(event?.target)
    ) {
      this.hideContainer();
    }
  }
  /**
   * Listener to handle tab key
   * @param event
   */
  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      if (this.hijiriPicker?.nativeElement.contains(event.target)) {
        if (!this.showContainer) this.toggleContainer();
      } else {
        if (this.showContainer) this.hideContainer();
      }
    }
  }
  /**
   * Listener to handle paste event
   * @param event
   */
  @HostListener('paste', ['$event'])
  onPasteEvent(event) {
    const clipboardData = event.clipboardData;
    if (!/^[\/0-9]*$/.test(clipboardData.getData('text'))) event.preventDefault();
  }

  /**
   * Creates an instance of InputDateDcComponent.
   * @memberof InputDateDcComponent
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly hijiriEngine: HijiriEngine,
    readonly lookupService: LookupService
  ) {
    super();
    this.language.subscribe(lang => {
      this.selectedLang = lang;
      if (this.selectedLang === LanguageEnum.ENGLISH) {
        this.inputmask = '00/00/0000';
      } else {
        this.inputmask = '00/00/0000';
      }
    });
    this.hijiriEngine.setYears(calendarStartDate, calendarStartDate, 1500);
    this.hijiriEngine.getViewMode().subscribe(mode => {
      if (this.viewMode === DatepickerViewMode.Month && this.isMonthPicker) {
        hijiriEngine.updateMonth(0);
      }
      this.viewMode = mode;
    });
    this.hijiriEngine.setViewMode(DatepickerViewMode.Year);
    this.hijiriEngine.getSelectedDate().subscribe(res => {
      if (this.control && res.id === this.id) {
        if (this.isMonthPicker) this.monthControl.setValue(res.date);
        else this.control.setValue(res.date);
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getTodaysHijriDate(new Date());
    this.hijiriEngine.setIsMonthPicker(this.isMonthPicker, this.id);
    if (this.isMonthPicker) {
      this.monthControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          if (`01/${res}` !== this.control.value) this.control.setValue(`01/${res}`);
        } else this.control.setValue(null);
      });
      this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.monthControl.setErrors(this.control.errors);
      });
      this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((res: string) => {
        this.setMonthControlValue(res);
      });
    }
    this.setMaxDate();
  }
  setMaxDate() {
    if (this.maxDate) {
      const maxDateArr = this.maxDate.split('/');
      const year = parseInt(maxDateArr[2], 10);
      if (year > 1501) {
        this.getHijriDate(
          this.maxDate ? new Date(startOfDay(moment(this.maxDate, 'DD/MM/YYYY').toDate())) : new Date()
        );
      } else {
        const hideNavEndYear = this.hijiriEngine.getDateTypeValue(this.maxDate, DateType.YEAR);
        const hideNavStartYear = this.minDate
          ? this.hijiriEngine.getDateTypeValue(this.minDate, DateType.YEAR)
          : calendarStartDate;
        this.hijiriEngine.setYears(calendarStartDate, hideNavStartYear, hideNavEndYear);
      }
    } else {
      this.getHijriDate(this.maxDate ? new Date(startOfDay(moment(this.maxDate, 'DD/MM/YYYY').toDate())) : new Date());
    }
  }

  changeView(e) {
    this.hijiriEngine.setViewMode(e);
  }
  setMonthControlValue(value: string) {
    if (value && this.isMonthPicker) {
      const newDate = value.slice(3, value.length);
      if (this.monthControl.value !== newDate) {
        this.monthControl.setValue(newDate);
        this.hijiriEngine.setActiveDate(value);
      }
    }
  }

  onYearSelect(e: CalendarCellViewModel) {
    this.hijiriEngine.setMonths(e.label);
    this.hijiriEngine.setViewMode(DatepickerViewMode.Month);
  }

  onMonthSelect(e) {
    this.hijiriEngine.setDays(e);
    if (this.isMonthPicker) {
      this.hijiriEngine.setSelectedDate(e, this.id);
      this.toggleContainer();
    } else this.hijiriEngine.setViewMode(DatepickerViewMode.Day);
  }

  onDaySelect(e, id: string) {
    this.hijiriEngine.setSelectedDate(e, id);
    this.changeEvent.emit();
    this.toggleContainer();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    let startYear, endYear;
    if (changes.minDate && changes.minDate.currentValue) {
      this.hijiriEngine.setMinDate(changes.minDate.currentValue);
      startYear = this.hijiriEngine.getDateTypeValue(changes.minDate.currentValue, DateType.YEAR);
      this.hijiriEngine.setYears(startYear, startYear);
    }
    if (changes.maxDate && changes.maxDate.currentValue) {
      this.maxDate = changes.maxDate.currentValue;
      const maxDateArr = this.maxDate.split('/');
      const year = parseInt(maxDateArr[2], 10);
      const month = parseInt(maxDateArr[1], 10);
      const day = parseInt(maxDateArr[0], 10);
      if (year > 1501) {
        this.getHijriDate(
          this.maxDate ? new Date(startOfDay(moment(this.maxDate, 'DD/MM/YYYY').toDate())) : new Date()
        );
        setTimeout(() => {
          this.hijiriEngine.setMaxDate(this.maxDate);
          endYear = this.hijiriEngine.getDateTypeValue(this.maxDate, DateType.YEAR);
          this.hijiriEngine.setYears(startYear, startYear, endYear);
        }, 300);
      } else {
        const hideNavEndYear = this.hijiriEngine.getDateTypeValue(this.maxDate, DateType.YEAR);
        const hideNavStartYear = this.minDate
          ? this.hijiriEngine.getDateTypeValue(this.minDate, DateType.YEAR)
          : calendarStartDate;
        this.hijiriEngine.setYears(calendarStartDate, hideNavStartYear, hideNavEndYear);
        this.hijiriEngine.setMaxDate(this.maxDate);
        endYear = this.hijiriEngine.getDateTypeValue(this.maxDate, DateType.YEAR);
        this.hijiriEngine.setYears(startYear, startYear, endYear);
        this.maxDate = this.maxDate;
      }
    }
    if (changes.control && changes.control.currentValue) {
      this.setMonthControlValue(changes.control.currentValue.value);
    }
    if (changes.fromDate && changes.fromDate.currentValue) {
      this.fromDate = changes.fromDate.currentValue;
    }
    if (changes.control && changes.control.currentValue) {
      this.setMonthControlValue(changes.control.currentValue.value);
    }
  }
  /**
   * Method totoggle hijri container
   */
  toggleContainer() {
    // if(this.fromSelected){
    //   this.hijiriEngine.setMinDate('01/01/1318');
    //   this.hijiriEngine.setActiveDate(null);
    // }
    // if(this.toSelected){
    //   this.hijiriEngine.setMinDate(this.fromDate.value);
    // }
    this.hijiriPicker?.nativeElement.focus();
    this.showContainer = !this.showContainer;
    this.updateControl();
  }

  /**
   * Method to control values
   */
  updateControl() {
    if (this.showContainer) {
      this.hijiriEngine.setActiveDate(this.control.value);
      if (
        this.control &&
        this.control.value !== null &&
        this.control.value !== '' &&
        this.hijiriEngine.getActiveDate()
      ) {
        this.hijiriEngine.setCalendarValue(undefined, this.minDate, this.maxDate, this.id);
      } else {
        this.hijiriEngine.setActiveDate(null);
        this.hijiriEngine.setMaxDate(this.maxDate);
        this.hijiriEngine.setCurrentMonthView(
          calendarStartDate,
          this.maxDate ? this.maxDate : this.todaysDate,
          this.id
        );
        this.showContainer = true;
      }
    }
  }
  /**
   * Method to hide hijri container outside click
   */
  hideContainer() {
    this.showContainer = false;
    this.updateControl();
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.invalidSelection, typeDate);
    this.errorMsg.next(error);
  }
  onBlur(event) {
    if (
      !this.hijiriEngine.dateValidator(this.control.value) &&
      event.target.value !== null &&
      event.target.value !== ''
    ) {
      this.hijiriPicker.nativeElement.value = '';
      this.control.value = null;
      this.control.setErrors({ invalidHijiri: true });
    }
    this.monthControl.setErrors(this.control.errors);
    this.maxDateValidation(event);
    this.minDateValidation(event);
    super.onBlur(event);
    this.setActiveDate();
    this.changeEvent.emit();
  }

  onFocus(event) {
    if (event.target.value === 'Invalid date') {
      event.target.value = null;
    }
  }
  onKeydown(event) {
    if (event.key === 'Enter') {
      if (
        !this.hijiriEngine.dateValidator(this.control.value) &&
        event.target.value !== null &&
        event.target.value !== ''
      ) {
        this.hijiriPicker.nativeElement.value = '';
        this.control.value = null;
        this.control.setErrors({ invalidHijiri: true, invalid: true });
      }
      this.maxDateValidation(event);
      this.minDateValidation(event);
      super.onBlur(event);
      this.setActiveDate();
      if (this.showContainer) {
        this.showContainer = !this.showContainer;
      }
    }
  }

  /**
   * Method to set the Active Date if no errors
   */
  setActiveDate() {
    if (!this.validationError && this.control.value) {
      this.hijiriEngine.setActiveDate(this.control.value);
    }
  }

  /**
   * Method to check provided date is greater than the Max Date
   * @param event
   */
  minDateValidation(event) {
    if (this.minDate) {
      const minDateArr = this.minDate.split('/');
      const minSelectedYear = minDateArr[2];
      const minSelectedMonth = parseInt(minDateArr[1], null);
      const minDay = parseInt(minDateArr[0], null);
      // if(this.fromSelected){
      //   this.hijiriEngine.setMinDate('01/01/1318');
      // }
      // if(this.toSelected){
      //   this.hijiriEngine.setMinDate(this.fromDate.value);
      // }
      if (
        !this.hijiriEngine.minDateValidator(this.control.value) &&
        event.target.value !== null &&
        event.target.value !== ''
      ) {
        this.hijiriPicker.nativeElement.value = '';
        this.control.value = null;
        this.control.setErrors({
          minDate: {
            minDateValue: `${minSelectedMonth}-${minDay}-${minSelectedYear}`,
            isMonthPicker: this.isMonthPicker
          }
        });
      }
    }
  }
  /**
   * Method to check provided date is greater than the Max Date
   * @param event
   */
  maxDateValidation(event) {
    const maxDateArr = this.maxDate.split('/');
    const maxSelectedYear = maxDateArr[2];
    const maxSelectedMonth = parseInt(maxDateArr[1], null);
    const maxDay = parseInt(maxDateArr[0], null);
    if (
      !this.hijiriEngine.maxDateValidator(this.control.value) &&
      event.target.value !== null &&
      event.target.value !== ''
    ) {
      this.hijiriPicker.nativeElement.value = '';
      this.control.value = null;
      this.control.setErrors({
        maxDate: {
          maxDateValue: `${maxSelectedMonth}-${maxDay}-${maxSelectedYear}`,
          isMonthPicker: this.isMonthPicker
        }
      });
    }
  }
  /**
   * Method to get the Hijri Date for corresponding Gregorian Date.
   * @param gregorianDate
   */
  getHijriDate(gregorianDate: Date): void {
    this.lookupService.getHijriDate(gregorianDate).subscribe(response => {
      let maxDateArr = [];
      if (response?.hijiri) {
        maxDateArr = response?.hijiri.split('-');
        this.maxDate = `${maxDateArr[2]}/${maxDateArr[1]}/${maxDateArr[0]}`;
      }
      const hideNavEndYear = this.hijiriEngine.getDateTypeValue(this.maxDate, DateType.YEAR);
      const hideNavStartYear = this.minDate
        ? this.hijiriEngine.getDateTypeValue(this.minDate, DateType.YEAR)
        : calendarStartDate;
      this.hijiriEngine.setYears(calendarStartDate, hideNavStartYear, hideNavEndYear);
    });
  }

  validateMonthField() {
    return this.monthControl.invalid && (this.monthControl.dirty || this.monthControl.touched) ? true : false;
  }

  getHijriOfAnyDate(gregorianDate: Date): string {
    let hijiriDate;
    this.lookupService.getHijriDate(gregorianDate).subscribe(response => {
      let maxDateArr = [];
      maxDateArr = response.hijiri.split('-');
      hijiriDate = `${maxDateArr[2]}/${maxDateArr[1]}/${maxDateArr[0]}`;
    });
    return hijiriDate;
  }
  /**
   * Method to get the Hijri Date for corresponding Gregorian Date.
   * @param gregorianDate
   */
  getTodaysHijriDate(gregorianDate: Date): void {
    this.lookupService.getHijriDate(gregorianDate).subscribe(response => {
      let maxDateArr = [];
      maxDateArr = response.hijiri.split('-');
      this.todaysDate = `${maxDateArr[2]}/${maxDateArr[1]}/${maxDateArr[0]}`;
    });
  }
  ngOnDestroy() {
    this.hijiriEngine.removeContext(this.id);
  }
}
