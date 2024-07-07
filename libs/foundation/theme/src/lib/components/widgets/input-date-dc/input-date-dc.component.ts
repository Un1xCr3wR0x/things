/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  FieldError,
  InputBaseComponent,
  LanguageEnum,
  LanguageToken,
  convertToStringDDMMYYYY,
  getErrorMsg
} from '@gosi-ui/core';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
const typeDate = 'date';

/**
 * Component used to handle date fields.
 *
 * @export
 * @class InputDateDcComponent
 */
@Component({
  selector: 'gosi-input-date-dc',
  templateUrl: './input-date-dc.component.html',
  styleUrls: ['./input-date-dc.component.scss']
})
export class InputDateDcComponent extends InputBaseComponent implements OnChanges {
  @Input() minDate: string | Date = new Date(1900, 1, 1);
  @Input() maxDate: string;
  @Input() directionChange: boolean = true;

  @Output() changeEvent: EventEmitter<null> = new EventEmitter();
  @ViewChild('dp') datePicker: BsDatepickerDirective;
  @ViewChild('datePicker') datePickerRef: ElementRef;

  currentDate = null;
  selectedLang = 'en';
  inputmask = '00/00/0000';
  langEng = LanguageEnum.ENGLISH;
  langAr = LanguageEnum.ARABIC;
  datepipe: DatePipe;
  bsConfig: Partial<BsDatepickerConfig>;

  /**
   * Listener to handle tab key
   * @param event
   */
  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      if (this.datePickerRef.nativeElement.contains(event.target)) {
        this.datePicker.show();
        this.datePickerRef.nativeElement.focus();
      } else if (this.datePicker.isOpen) {
        this.datePicker.hide();
      }
    }
  }
  /**
   * Listener to handle component keyup
   * @param event
   */
  @HostListener('keyup', ['$event'])
  onKeyUpEvent(event) {
    this.currentDate = event.target.value;
  }
  /**
   * Listener to handle paste event
   * @param event
   */
  @HostListener('paste', ['$event'])
  onPasteEvent(event) {
    const clipboardData = event.clipboardData;
    if (/^[\/0-9]*$/.test(clipboardData.getData('text'))) this.currentDate = clipboardData.getData('text');
    else event.preventDefault();
  }
  /**
   * Creates an instance of InputDateDcComponent.
   * @memberof InputDateDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();

    this.language.subscribe(lang => {
      this.selectedLang = lang;
      this.setBSConfig();
      if (this.selectedLang === LanguageEnum.ENGLISH && !this.directionChange) {
        this.inputmask = '00/00/0000';
      } else {
        this.inputmask = '0000/00/00';
      }
    });
  }

  setBSConfig() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        dateInputFormat: this.selectedLang === LanguageEnum.ARABIC && this.directionChange ? 'YYYY/MM/DD' : 'DD/MM/YYYY'
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
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

  onBlur(event) {
    this.patternCheck(event);
    if (this.control.errors) {
      if (this.control.errors.bsDate) {
        if (this.control.errors.bsDate.maxDate) {
          this.datePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({
            maxDate: { controlValue: this.control.value, maxDateValue: this.maxDate },
            minDate: null
          });
        } else if (this.control.errors.bsDate.minDate) {
          this.datePicker.bsValue = void 0;
          event.target.value = 'Invalid date';
          this.control.setErrors({
            minDate: { controlValue: this.control.value, minDateValue: this.minDate },
            maxDate: null
          });
        }
      }
      event.target.value = event.target.value !== 'Invalid date' ? this.currentDate : this.currentDate;
    }
    super.onBlur(event.target.value);
  }

  onChange(event) {
    if (convertToStringDDMMYYYY(event) === convertToStringDDMMYYYY(this.control.value)) {
      this.changeEvent.emit();
    }
  }

  patternCheck(event) {
    const { value } = event.target;
    if (this.selectedLang === LanguageEnum.ARABIC && this.directionChange) {
      if ((value.length === 10 && !value.match('^[0-9]{4}[/][0-9]{2}[/][0-9]{2}$')) || value.length > 10) {
        event.target.value = 'Invalid date';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
    } else {
      if ((value.length === 10 && !value.match('^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$')) || value.length > 10) {
        event.target.value = 'Invalid date';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
    }
  }

  onInput(event) {
    const { data } = event;
    const { inputType } = event;
    const { value } = event.target;

    if (data && !data.match('^[0-9]|[/]$')) {
      event.target.value = value.replace(data, '');
    }
    if (this.selectedLang === LanguageEnum.ARABIC && this.directionChange) {
      if (value.length === 10 && !value.match('^[0-9]{4}[/][0-9]{2}[/][0-9]{2}$')) {
        event.target.value = '';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
    } else {
      if (value.length === 10 && !value.match('^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$')) {
        event.target.value = '';
        this.control.setErrors({
          bsDate: {
            invalid: 'Invalid Date'
          }
        });
      }
    }
    if (value && inputType === 'insertFromPaste' && !value.match('[0-9]|[/]+')) {
      event.target.value = null;
    }
  }
}
