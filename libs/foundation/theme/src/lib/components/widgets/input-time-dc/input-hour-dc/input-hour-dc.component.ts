/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getErrorMsg, InputBaseComponent } from '@gosi-ui/core';

@Component({
  selector: 'gosi-input-hour-dc',
  templateUrl: './input-hour-dc.component.html',
  styleUrls: ['./input-hour-dc.component.scss']
})
export class InputHourDcComponent extends InputBaseComponent implements OnInit {
  constructor() {
    super();
  }
  hours = [];
  @Input() hour: FormControl;
  ngOnInit() {
    // this.minute.setValue('');
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.hours.push('0' + i);
      }
      if (i >= 10 && i < 24) {
        this.hours.push(i);
      }
    }
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
   * Validate the Hour Field
   */
  validateHourField() {
    const control = this.hour;
    if (control) {
      return control.invalid && (control.dirty || control.touched) ? true : false;
    }
  }
  /**
   * This method is to handle blur events.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  onBlurHour(e) {
    this.blur.emit(e);
    const control = this.hour;
    if (control) {
      this.setErrorMsgs(control);
    }
  }
}
