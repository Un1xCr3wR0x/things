/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getErrorMsg, InputBaseComponent } from '@gosi-ui/core';
import { LegalEntitiesEnum } from '@gosi-ui/features/contributor';

@Component({
  selector: 'cnt-employment-status-switch-dc',
  templateUrl: './employment-status-switch-dc.component.html',
  styleUrls: ['./employment-status-switch-dc.component.scss']
})
export class EmploymentStatusSwitchDcComponent extends InputBaseComponent {
  /**Input variables */
  @Input() activeLabel: string;
  @Input() inActiveLabel: string;
  @Input() isToggleTypeDanger = false;
  @Input() isContract: boolean;

  /**Output event emmitter */
  @Output() changeEvent: EventEmitter<boolean> = new EventEmitter();

  /**
   * This method is used to initialize EmploymentStatusSwitchDcComponent
   */
  constructor() {
    super();
  }

  /**
   * Method to set value on change is available
   */
  changeItem1(value) {
    if (value) {
      this.control.setValue(value.target.checked);
      this.changeEvent.emit(value.target.checked);
    }
  }
  /**
   * Method to set value on change skip contract
   */

  changeItem2(value) {
    if (value) {
      this.control.setValue(value.target.checked);
      this.changeEvent.emit(value.target.checked);
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
