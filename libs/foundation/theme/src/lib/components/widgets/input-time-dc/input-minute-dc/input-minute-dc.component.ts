import { Component, OnInit, Input } from '@angular/core';
import { InputBaseComponent } from '@gosi-ui/core';
import { getErrorMsg } from '@gosi-ui/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'gosi-input-minute-dc',
  templateUrl: './input-minute-dc.component.html',
  styleUrls: ['./input-minute-dc.component.scss']
})
export class InputMinuteDcComponent extends InputBaseComponent implements OnInit {
  constructor() {
    super();
  }
  minutes = [];
  @Input() minute: FormControl = null;
  ngOnInit() {
    // this.minute.setValue('');
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.minutes.push('0' + i);
      }
      if (i >= 10 && i < 24) {
        this.minutes.push(i);
      }
      if (i >= 24) {
        this.minutes.push(i);
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
   * Validating the minute dropdown
   */
  validateMinuteField() {
    const control = this.minute;
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
  onBlurMinute(e) {
    this.blur.emit(e);
    const control = this.minute;
    if (control) {
      this.setErrorMsgs(control);
    }
  }
}
