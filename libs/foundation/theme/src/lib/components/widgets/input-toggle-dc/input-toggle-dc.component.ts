/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { InputBaseComponent } from '@gosi-ui/core';
import { getErrorMsg } from '@gosi-ui/core';

@Component({
  selector: 'gosi-input-toggle-dc',
  templateUrl: './input-toggle-dc.component.html',
  styleUrls: ['./input-toggle-dc.component.scss']
})
export class InputToggleDcComponent extends InputBaseComponent implements OnInit {
  @Output() changeEvent: EventEmitter<boolean> = new EventEmitter();
  constructor() {
    super();
  }

  /**
   * This method is to set the control value
   * @param val
   */
  changeItem(val) {
    if (val) {
      this.control.setValue(val.target.checked);
      this.changeEvent.emit(val.target.checked);
    }
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.label, this.invalidSelection);
    this.errorMsg.next(error);
  }
}
