/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { InputBaseComponent } from '@gosi-ui/core';
import { getErrorMsg } from '@gosi-ui/core';

/**
 * This is the reusable custom text area widget
 *
 * @export
 * @class InputTextAreaDcComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-input-text-area-dc',
  templateUrl: './input-text-area-dc.component.html',
  styleUrls: ['./input-text-area-dc.component.scss']
})
export class InputTextAreaDcComponent extends InputBaseComponent {
  //Input variables
  @Input() rowSize = 6; //For custom row size, 6 - default
  @Input() mandatory = false;

  /**
   * Creates an instance of InputTextAreaDcComponent
   * @memberof  InputTextAreaDcComponent
   *
   */
  constructor() {
    super();
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
