/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, HostListener, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { getErrorMsg, InputBaseComponent, LanguageEnum, LanguageToken } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsDatepickerConfig, BsDatepickerDirective, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, Subscription } from 'rxjs';

const typeMonth = 'month';

@Component({
  selector: 'gosi-input-month-dc',
  templateUrl: './input-month-dc.component.html',
  styleUrls: ['./input-month-dc.component.scss']
})
export class InputMonthDcComponent extends InputBaseComponent implements OnInit, OnDestroy {
  /** Input variables */
  @Input() minDate: string;
  @Input() maxDate: string;
  @Input() dateFormat = 'MMM, YYYY';
  @Input() disabled: boolean;

  /** Local variables */
  minMode: BsDatepickerViewMode = 'month';
  bsConfig: Partial<BsDatepickerConfig>;
  dateVal = null;
  subscription: Subscription;
  currentDate = null;
  engDateFormat = 'DD/MM/YYYY';
  arDateFormat = 'YYYY/MM/DD';
  currentLang = 'en';
  langEng = LanguageEnum.ENGLISH;

  /** Child Components */
  @ViewChild('dp') datePicker: BsDatepickerDirective;

  /**
   * Creates an instance of InputMonthComponent.
   * @memberof InputMonthComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.subscribe(lang => {
      this.currentLang = lang;
      this.setBsConfig();
    });
  }

  /** Method to initialize the  component. */
  ngOnInit() {
    super.ngOnInit();
    this.setBsConfig();
    this.subscription = this.control.valueChanges.subscribe((val: Date) => {
      let dateDiff = 1;
      if (val != null && this.dateVal != null) {
        dateDiff = val.valueOf() - this.dateVal.valueOf();
      }
      if (val != null && dateDiff !== 0) {
        this.dateVal = val;
        const date = moment(val);
        const startDate = date.clone().startOf('month');
        super.onBlur(startDate.toDate(), false);
      }
    });
  }

  setBsConfig() {
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
        dateInputFormat:
          this.dateFormat === this.engDateFormat
            ? this.currentLang === this.langEng
              ? this.dateFormat
              : this.arDateFormat
            : this.dateFormat
      }
    );
  }
  /** Method to handle key up event. */
  @HostListener('keyup', ['$event'])
  onKeyUpEvent(event) {
    this.currentDate = event.target.value;
  }

  /** Method to handle blur event. */
  onBlur(event) {
    if (this.control.errors && this.control.errors.bsDate) {
      if (this.control.errors.bsDate.maxDate || this.control.errors.bsDate.minDate) {
        this.datePicker.bsValue = void 0;
        event.target.value = this.currentDate;
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
    const error = getErrorMsg(control, this.invalidSelection, typeMonth);
    this.errorMsg.next(error);
  }

  /** Method to handle destory event. */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.subscription.unsubscribe();
  }
}
