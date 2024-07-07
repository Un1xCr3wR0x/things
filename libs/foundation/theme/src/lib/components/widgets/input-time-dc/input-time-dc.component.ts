/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { getErrorMsg, InputBaseComponent, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'gosi-input-time-dc',
  templateUrl: './input-time-dc.component.html',
  styleUrls: ['./input-time-dc.component.scss']
})
/**
 * This component is to handle input select fields.
 *
 * @export
 * @class InputTimeDcComponent
 * @extends {InputBaseComponent}
 */
export class InputTimeDcComponent extends InputBaseComponent implements OnChanges {
  @Input() hour: FormControl = null;
  @Input() minute: FormControl = null;
  /*Local Variables*/
  selectedHour = null;
  selectedMinute = null;
  hours = [];
  minutes = [];
  timepickerForm: FormGroup;
  selectedLang = 'en';
  /**
   * Creates an instance of InputTimeDcComponent.
   * @memberof InputTimeDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * This method is to set Hour.
   */
  selectHour(hour) {
    this.control.setValue(hour);
    this.selectedHour = hour;
  }
  /**
   * Validation for hour and minute
   */
  isRequired() {
    const control = this.hour;
    const controlMinute = this.minute;
    let hourValidator = null;
    let minuteValidator = null;
    if (control) {
      if (control) {
        hourValidator = control.validator({} as AbstractControl);
      }
      return hourValidator && hourValidator.required ? true : false;
    }
    if (controlMinute) {
      if (controlMinute) {
        minuteValidator = controlMinute.validator({} as AbstractControl);
      }
      return minuteValidator && minuteValidator.required ? true : false;
    }
  }

  /**
   * This method is to set Minute.
   */
  selectMinute(minute) {
    this.control.setValue(minute);
    this.selectedMinute = minute;
  }
  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputTimeDcComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }

  /**
   * This method is to handle the changes in inputs.
   *
   * @memberof InputTimeDcComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  /**
   * This method is to handle blur events.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  onBlurHour(e) {
    this.blur.emit(e);
    const controlHour = this.hour;
    if (controlHour) {
      this.setErrorMsgs(controlHour);
    }
  }
  /**
   * This method is to handle blur events.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  onBlurMinute(e) {
    this.blur.emit(e);
    const controlMinute = this.minute;
    if (controlMinute) {
      this.setErrorMsgs(controlMinute);
    }
  }
}
