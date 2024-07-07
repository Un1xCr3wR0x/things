/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';

import { InputBaseComponent } from '@gosi-ui/core';
import { getErrorMsg } from '@gosi-ui/core';

const typeNumber = 'number';

/**
 * This component is to handle input text fields.
 *
 * @export
 * @class InputNumberComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-input-number-dc',
  templateUrl: './input-number-dc.component.html',
  styleUrls: ['./input-number-dc.component.scss']
})
export class InputNumberDcComponent extends InputBaseComponent implements OnChanges {
  @Output() keyUp: EventEmitter<null> = new EventEmitter();
  @Input() validationChanged: boolean;
  @Output() changeEvent: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of InputNumberDcComponent.
   * @memberof InputNumberDcComponent
   */
  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.validationChanged) {
      this.setErrorMsgs(this.control);
    }
  }

  onKeyUp(e) {
    super.onKeyUp(e);
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error = getErrorMsg(control, this.invalidSelection, typeNumber);
    this.errorMsg.next(error);
  }

  /** Method to handle change in control value */
  onChange(event) {
    if (typeof event === 'string') {
      this.changeEvent.emit();
    }
  }
}
