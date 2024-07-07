/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FieldError, getErrorMsg, InputBaseComponent, LanguageEnum, LanguageToken } from '@gosi-ui/core';
import { BsDatepickerConfig, BsDatepickerDirective, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
const typeDate = 'date';

/**
 * Component used to handle date fields.
 *
 * @export
 * @class InputDateDcComponent
 */

@Component({
  selector: 'gosi-input-daterange-dc',
  templateUrl: './input-daterange-dc.component.html',
  styleUrls: ['./input-daterange-dc.component.scss']
})
export class InputDaterangeDcComponent extends InputBaseComponent implements OnChanges, OnInit {
  @Input() minDate: string | Date = new Date(1900, 1, 1);
  @Input() maxDate: string;
  @Input() monthPicker = false;
  @Input() monthPickerPlaceholder: string;
  @Input() isFilter = false;
  @Input() showReset = false;
  @Input() arabicDateFormatChange = false;

  @ViewChild('dp') dateRangePicker: BsDatepickerDirective;

  currentDate = null;
  selectedLang = 'en';
  datepipe: DatePipe;
  bsConfig: Partial<BsDatepickerConfig>;
  minMode: BsDatepickerViewMode;
  rangeInputFormat = 'DD/MM/YYYY';
  dateInputFormat = 'DD/MM/YYYY';
  arDateFormat = 'YYYY/MM/DD';
  langEng = LanguageEnum.ENGLISH;
  @Output() reset = new EventEmitter<null>();
  showClearButton: boolean;
  @Output() clearClicked: EventEmitter<boolean> = new EventEmitter();
  resetClicked: boolean = false;
  /**
   * Creates an instance of InputDaterangeDcComponent.
   * @memberof InputDaterangeDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();

    this.language.subscribe(lang => {
      this.selectedLang = lang;
      this.setBsConfig();
    });
  }
  ngOnInit() {
    super.ngOnInit();
    if (this.monthPicker === true) {
      this.minMode = 'month';
      this.rangeInputFormat = 'MM/YYYY';
      this.dateInputFormat = 'MM/YYYY';
      if (this.arabicDateFormatChange) {
        this.arDateFormat = 'YYYY/MM';
      }
    }
    this.setBsConfig();
  }

  setBsConfig() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        rangeInputFormat: this.selectedLang === LanguageEnum.ENGLISH ? this.rangeInputFormat : this.arDateFormat,
        dateInputFormat: this.selectedLang === LanguageEnum.ENGLISH ? this.dateInputFormat : this.arDateFormat,
        displayMonths: 1,
        minMode: this.minMode
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes?.placement?.currentValue) {
    }
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error: FieldError = getErrorMsg(control, this.invalidSelection, typeDate);
    this.errorMsg.next(error);
  }
  @HostListener('keyup', ['$event'])
  onChangeEvent(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.currentDate = value;
    if (value === null || value === '') {
      this.dateRangePicker.bsValue = void 0;
    }
  }
  @HostListener('paste', ['$event'])
  onPasteEvent(event) {
    const clipboardData = event.clipboardData;
    if (/^[\/0-9- ]*$/.test(clipboardData.getData('text'))) this.currentDate = clipboardData.getData('text');
    else event.preventDefault();
  }
  patternCheck(event) {
    const value = this.currentDate;
    if (this.selectedLang === LanguageEnum.ARABIC && this.arabicDateFormatChange) {
      if (
        this.monthPicker === true &&
        value !== null &&
        value.match('([0-9]{4}[/][0-9]{2}[ ][-][ ][0-9]{4}[/][0-9]{2})+') === null &&
        this.control.errors !== null
      ) {
        this.dateRangePicker.bsValue = void 0;
        event.target.value = 'Invalid date';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
      if (
        this.monthPicker === false &&
        value !== null &&
        value.match('([0-9]{4}[/][0-9]{2}[/][0-9]{2}[ ][-][ ][0-9]{4}[/][0-9]{2}[/][0-9]{2})+') === null &&
        this.control.errors !== null
      ) {
        this.dateRangePicker.bsValue = void 0;
        event.target.value = 'Invalid date';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
    } else {
      if (
        this.monthPicker === true &&
        value !== null &&
        value.match('([0-9]{2}[/][0-9]{4}[ ][-][ ][0-9]{2}[/][0-9]{4})+') === null &&
        this.control.errors !== null
      ) {
        this.dateRangePicker.bsValue = void 0;
        event.target.value = 'Invalid date';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
      if (
        this.monthPicker === false &&
        value !== null &&
        value.match('([0-9]{2}[/][0-9]{2}[/][0-9]{4}[ ][-][ ][0-9]{2}[/][0-9]{2}[/][0-9]{4})+') === null &&
        this.control.errors !== null
      ) {
        this.dateRangePicker.bsValue = void 0;
        event.target.value = 'Invalid date';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
    }
  }
  enableClearButton(event) {
    if (event) {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
  }
  onBlur(event) {
    this.patternCheck(event);
    if (this.monthPicker === true) {
      if (this.control.value && this.control.value.length !== 2) {
        this.control.setValue(null);
        this.dateRangePicker.bsValue = void 0;
        this.control.setErrors({ bsDate: { invalid: true } });
      }
    }
    if (this.control.value && this.currentDate) {
      const dateSplit = this.currentDate.split(' - ', 2);
      const toDate = new Date();
      if (dateSplit[0] != null && dateSplit[1] != null && dateSplit[0].includes('/') && dateSplit[1].includes('/')) {
        const splittedDate1 =
          this.selectedLang === LanguageEnum.ARABIC && this.arabicDateFormatChange
            ? dateSplit[0].split('/', 3).reverse()
            : dateSplit[0].split('/', 3);
        const splittedDate2 =
          this.selectedLang === LanguageEnum.ARABIC && this.arabicDateFormatChange
            ? dateSplit[1].split('/', 3).reverse()
            : dateSplit[1].split('/', 3);
        const rearrangeDate1 = splittedDate1[1] + '/' + splittedDate1[0] + '/' + splittedDate1[2];
        const rearrangeDate2 = splittedDate2[1] + '/' + splittedDate2[0] + '/' + splittedDate2[2];
        const firstDate = new Date(rearrangeDate1);
        const secondDate = new Date(rearrangeDate2);

        if (this.monthPicker === true) {
          this.monthPickerValidation(splittedDate1, splittedDate2, event, dateSplit);
        }
        if (this.monthPicker === false) {
          if (this.selectedLang === LanguageEnum.ARABIC && this.arabicDateFormatChange) {
            const currentDateSplit = this.currentDate.split(' - ', 2);
            const currentDateSplit1 = currentDateSplit[0].split('/', 3);
            const currentDateSplit2 = currentDateSplit[1].split('/', 3);
            const currentDate1 = currentDateSplit1.reverse();
            const currentDate2 = currentDateSplit2.reverse();
            const rearrangeCurrentDate1 = currentDate1[1] + '/' + currentDate1[0] + '/' + currentDate1[2];
            const rearrangeCurrentDate2 = currentDate2[1] + '/' + currentDate2[0] + '/' + currentDate2[2];
            const maximumDate = new Date(this.maxDate);
            const minimumDate = new Date(this.minDate);
            const upperDate = new Date(rearrangeCurrentDate1);
            const lowerDate = new Date(rearrangeCurrentDate2);
            if (upperDate > maximumDate || lowerDate > maximumDate) {
              this.dateRangePicker.bsValue = void 0;
              event.target.value = 'Invalid date';
              this.control.setErrors({
                maxDate: { controlValue: this.control.value, maxDateValue: this.maxDate },
                minDate: null
              });
              this.dateRangePicker.bsValue = void 0;
            } else if (upperDate < minimumDate || lowerDate < minimumDate) {
              this.dateRangePicker.bsValue = void 0;
              event.target.value = 'Invalid date';
              this.control.setErrors({
                minDate: { controlValue: this.control.value, minDateValue: this.minDate },
                maxDate: null
              });
            } else if (firstDate > secondDate && toDate >= firstDate && toDate >= secondDate) {
              event.target.value = null;
              this.dateRangePicker.bsValue = void 0;
              this.control.setErrors({ bsDate: { invalid: true } });
            }
          } else {
            const currentDateSplit = this.currentDate.split(' - ', 2);
            const currentDate1 = currentDateSplit[0].split('/', 3);
            const currentDate2 = currentDateSplit[1].split('/', 3);
            const rearrangeCurrentDate1 = currentDate1[1] + '/' + currentDate1[0] + '/' + currentDate1[2];
            const rearrangeCurrentDate2 = currentDate2[1] + '/' + currentDate2[0] + '/' + currentDate2[2];
            const maximumDate = new Date(this.maxDate);
            const minimumDate = new Date(this.minDate);
            const upperDate = new Date(rearrangeCurrentDate1);
            const lowerDate = new Date(rearrangeCurrentDate2);
            if (upperDate > maximumDate || lowerDate > maximumDate) {
              this.dateRangePicker.bsValue = void 0;
              event.target.value = 'Invalid date';
              this.control.setErrors({
                maxDate: { controlValue: this.control.value, maxDateValue: this.maxDate },
                minDate: null
              });
              this.dateRangePicker.bsValue = void 0;
            } else if (upperDate < minimumDate || lowerDate < minimumDate) {
              this.dateRangePicker.bsValue = void 0;
              event.target.value = 'Invalid date';
              this.control.setErrors({
                minDate: { controlValue: this.control.value, minDateValue: this.minDate },
                maxDate: null
              });
            } else if (firstDate > secondDate && toDate >= firstDate && toDate >= secondDate) {
              event.target.value = null;
              this.dateRangePicker.bsValue = void 0;
              this.control.setErrors({ bsDate: { invalid: true } });
            }
          }
        }
      }
    }
    this.errorCheck(event);
    super.onBlur(event.target.value);
  }
  errorCheck(event) {
    if (this.control.errors?.length > 0 && this.control.errors[0]) {
      if (this.control.errors[0].bsDate) {
        if (this.control.errors[0].bsDate.maxDate) {
          this.dateRangePicker.bsValue = void 0;
          this.control.setErrors({
            maxDate: { controlValue: this.control.value, maxDateValue: this.maxDate },
            minDate: null
          });
        }
      } else if (this.control.errors[0].bsDate.minDate) {
        this.dateRangePicker.bsValue = void 0;
        this.control.setErrors({
          minDate: { controlValue: this.control.value, minDateValue: this.minDate },
          maxDate: null
        });
      }
    }
    if (this.control.errors !== null) {
      if (event.target.value === 'Invalid date') {
        event.target.value = this.currentDate;
        this.dateRangePicker.bsValue = void 0;
      } else event.target.value = this.currentDate;
    }
  }

  onInput(event) {
    const { data } = event;
    const { inputType } = event;
    const { value } = event.target;
    if (data && !data.match('^[0-9 ]|[/]|[-]$')) {
      event.target.value = value.replace(data, '');
      // this.showClearButton = false;
    }
    if (value && inputType === 'insertFromPaste' && !value.match('^[0-9 ]|[/]|[-]$')) {
      event.target.value = null;
      // this.showClearButton = false;
    }
  }
  monthPickerValidation(splittedDate1, splittedDate2, event, dateSplit) {
    let rearrangeMonthDate1;
    let rearrangeMonthDate2;
    if (this.selectedLang === LanguageEnum.ARABIC && this.arabicDateFormatChange) {
      rearrangeMonthDate1 = splittedDate1[0] + '/' + splittedDate1[1] + '/01';
      rearrangeMonthDate2 = splittedDate2[0] + '/' + splittedDate2[1] + '/01';
    } else {
      rearrangeMonthDate1 = splittedDate1[0] + '/01/' + splittedDate1[1];
      rearrangeMonthDate2 = splittedDate2[0] + '/01/' + splittedDate2[1];
    }
    const monthDate1 = new Date(rearrangeMonthDate1);
    const monthDate2 = new Date(rearrangeMonthDate2);
    const maximumDate = new Date(this.maxDate);
    const minimumDate = new Date(this.minDate);
    if (monthDate2 > maximumDate || monthDate1 > maximumDate) {
      this.dateRangePicker.bsValue = void 0;
      event.target.value = 'Invalid date';
      this.control.setErrors({
        maxDate: { controlValue: this.control.value, maxDateValue: this.maxDate },
        minDate: null
      });
    } else if (monthDate2 < minimumDate || monthDate1 < minimumDate) {
      this.dateRangePicker.bsValue = void 0;
      event.target.value = 'Invalid date';
      this.control.setErrors({
        minDate: { controlValue: this.control.value, minDateValue: this.minDate },
        maxDate: null
      });
    } else {
      if (this.selectedLang === LanguageEnum.ARABIC && this.arabicDateFormatChange) {
        if (splittedDate1[0] > splittedDate2[0]) {
          this.dateRangePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({ bsDate: { invalid: true } });
        }
        if (splittedDate1[0] === splittedDate2[0] && this.control.value.length === 2) {
          if (splittedDate1[1] > splittedDate2[1]) {
            this.dateRangePicker.bsValue = void 0;
            event.target.value = 'Invalid date';
            this.control.setErrors({ bsDate: { invalid: true } });
          }
        }
        if (splittedDate1[2] !== undefined || splittedDate2[2] !== undefined) {
          this.dateRangePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({ bsDate: { invalid: true } });
        }
        if (!dateSplit[0].includes('/') || !dateSplit[1].includes('/')) {
          this.dateRangePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({ bsDate: { invalid: true } });
        }
      } else {
        if (splittedDate1[1] > splittedDate2[1]) {
          this.dateRangePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({ bsDate: { invalid: true } });
        }
        if (splittedDate1[1] === splittedDate2[1] && this.control.value.length === 2) {
          if (splittedDate1[0] > splittedDate2[0]) {
            this.dateRangePicker.bsValue = void 0;
            event.target.value = 'Invalid date';
            this.control.setErrors({ bsDate: { invalid: true } });
          }
        }
        if (splittedDate1[2] !== undefined || splittedDate2[2] !== undefined) {
          this.dateRangePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({ bsDate: { invalid: true } });
        }
        if (!dateSplit[0].includes('/') || !dateSplit[1].includes('/')) {
          this.dateRangePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({ bsDate: { invalid: true } });
        }
      }
    }
  }

  resetFilter() {
    this.resetClicked = true;
    this.showClearButton = false;
    this.clearClicked.emit(this.resetClicked);
    this.reset.emit();
  }
}
