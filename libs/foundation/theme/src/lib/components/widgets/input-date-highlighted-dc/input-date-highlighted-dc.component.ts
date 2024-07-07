import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { faAd } from '@fortawesome/free-solid-svg-icons';
import { LanguageEnum, LanguageToken, FieldError, getErrorMsg, convertToStringDDMMYYYY } from '@gosi-ui/core';
import { InputBaseComponent } from '@gosi-ui/core/lib/base/input-base.component';
import { DatepickerDateCustomClasses, BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';

const typeDate = 'date';
interface BsDatePickerStoreData {
  view: BsDatePickerStoreView;
}
interface BsDatePickerStoreView {
  date: Date;
  mode: keyof { day; month; year };
}
interface IDateRange {
  label?: string;
  dayVariance?: number;
}

@Component({
  selector: 'gosi-input-date-highlighted-dc',
  templateUrl: './input-date-highlighted-dc.component.html',
  styleUrls: ['./input-date-highlighted-dc.component.scss']
})
export class InputDateHighlightedDcComponent extends InputBaseComponent implements OnInit {
  dateCustomClasses: DatepickerDateCustomClasses[] = [];

  @Input() minDate: string | Date = new Date(1900, 1, 1);
  @Input() maxDate: string;
  @Input() availableArray: Date[];
  @Input() unavailableArray: Date[];
  @Input() resetTime = false;

  @Output() changeEvent: EventEmitter<Date> = new EventEmitter();
  @Output() changedDate: EventEmitter<Date> = new EventEmitter();
  @ViewChild('dp') datePicker: BsDatepickerDirective;
  @ViewChild('datePicker') datePickerRef: ElementRef;
  @ViewChild('shortcutsList') shortcutsList: ElementRef;

  shortcuts: IDateRange[] = [
    {
      label: '.  ',
      dayVariance: 2
    },
    {
      label: 'Available    ',
      dayVariance: 3
    },
    {
      label: '.',
      dayVariance: 4
    },
    {
      label: '.  ',
      dayVariance: 4
    },
    {
      label: 'Fully Allocated',
      dayVariance: 4
    }
  ];

  shortcutsAr: IDateRange[] = [
    {
      label: '.  ',
      dayVariance: 2
    },
    {
      label: 'متاح    ',
      dayVariance: 3
    },
    {
      label: '.',
      dayVariance: 4
    },
    {
      label: '.  ',
      dayVariance: 4
    },
    {
      label: 'مخصصة بالكامل',
      dayVariance: 4
    }
  ];

  currentDate = null;
  selectedLang = 'en';
  langEng = LanguageEnum.ENGLISH;
  datepipe: DatePipe;
  bsConfig: Partial<BsDatepickerConfig>;
  lastKnownViewDate: Date = undefined;
  setEvent: boolean;
  count: number;
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
   * @memberof InputDateHighlightedDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();

    this.language.subscribe(lang => {
      this.selectedLang = lang;
      this.setBSConfig();
    });
  }

  onOpenCalendar(container) {
    setTimeout(() => {
      this._moveShortcutsListWithDocument();
    }, 0);

    this.setEvent = true;
    const store = container._store.source as BehaviorSubject<BsDatePickerStoreData>;
    store.subscribe(data => {
      const date = data.view.date as Date;
      if (data.view.mode === 'month') {
        this.lastKnownViewDate = undefined;
      }
      if (!this.lastKnownViewDate || this.lastKnownViewDate.toDateString() !== date.toDateString()) {
        if (data.view.mode === 'day') {
          if (!this.setEvent) {
            this._moveShortcutsListWithDocument();
            setTimeout(() => {
              this._moveShortcutsListWithDocument();
            }, 0);
          }

          this.lastKnownViewDate = date;
          this.availableArray = [];
          this.unavailableArray = [];
          this.changedDate.emit(date);
        }
      }
    });
  }
  private _moveShortcutsListWithDocument() {
    const calendar = document.getElementsByClassName('bs-datepicker-body')[0];
    const shortcutList = document.createElement('div');
    shortcutList.classList.add('inserted-div');
    calendar.appendChild(shortcutList);
    if (this.selectedLang === 'en') {
      if (this.shortcuts) {
        this.shortcuts.forEach((shortcut, index) => {
          let listItem = document.createElement('span');
          listItem.setAttribute('id', `listItem${index}`);
          shortcutList.appendChild(listItem);
          const listItemElement = document.getElementById(`listItem${index}`);
          if (!!listItemElement && !!shortcut.label) {
            listItemElement.innerText = shortcut.label;
          }
        });
      }
    } else {
      if (this.shortcutsAr) {
        this.shortcutsAr.forEach((shortcut, index) => {
          let listItem = document.createElement('span');
          listItem.setAttribute('id', `listItem${index}`);
          shortcutList.appendChild(listItem);
          const listItemElement = document.getElementById(`listItem${index}`);
          if (!!listItemElement && !!shortcut.label) {
            listItemElement.innerText = shortcut.label;
          }
        });
      }
    }
    calendar.appendChild(shortcutList);

    this.setEvent = false;
  }

  setBSConfig() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        dateInputFormat: this.selectedLang === LanguageEnum.ENGLISH ? 'DD/MM/YYYY' : 'YYYY/MM/DD'
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes && (changes.availableArray?.currentValue || changes.unavailableArray?.currentValue)) {
      this.availableArray = changes.availableArray.currentValue;
      this.unavailableArray = changes.unavailableArray.currentValue;
      this.dateCustomClasses = [];
      if (this.availableArray.length || this.unavailableArray.length) {
        this.setDate();
      }
    }
    if (changes.resetTime) {
      this.resetTime = changes.resetTime.currentValue;
      if (this.resetTime) {
        this.lastKnownViewDate = undefined;
        this.resetTime = false;
      }
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
  setDate() {
    this.availableArray?.forEach(data => {
      this.dateCustomClasses.push({ date: data, classes: ['bg-primary', 'text-light', 'mb-1'] });
    });
    this.unavailableArray?.forEach(data => {
      this.dateCustomClasses.push({ date: data, classes: ['bg-danger', 'text-light', 'mb-1'] });
    });
  }

  onBlur(event) {
    this.setBSConfig();
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
      this.changeEvent.emit(event);
    }
  }

  patternCheck(event) {
    const { value } = event.target;
    const dateRegexEnglish = '^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$';
    const dateRegexArabic = '^[0-9]{4}[/][0-9]{2}[/][0-9]{2}$';
    if (
      value.length === 10 &&
      !value.match(this.selectedLang === LanguageEnum.ENGLISH ? dateRegexEnglish : dateRegexArabic)
    ) {
      event.target.value = 'Invalid date';
      this.control.setErrors({
        bsDate: {
          invalid: 'Invalid Date'
        }
      });
    }
  }
  setD;

  onInput(event) {
    const { data } = event;
    const { inputType } = event;
    const { value } = event.target;

    if (data && !data.match('^[0-9]|[/]$')) {
      event.target.value = value.replace(data, '');
    }
    if (value && inputType === 'insertFromPaste' && !value.match('[0-9]|[/]+')) {
      event.target.value = null;
    }
  }
}
