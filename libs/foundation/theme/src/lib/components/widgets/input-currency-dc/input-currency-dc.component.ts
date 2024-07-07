/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldError, GccCountryCode, InputBaseComponent, getErrorMsg } from '@gosi-ui/core';

const typeNumber = 'number';

/**
 * This component is to handle input currency fields.
 *
 * @export
 * @class InputCurrencyDcComponent
 * @extends {InputBaseComponent}
 */
@Component({
  selector: 'gosi-input-currency-dc',
  templateUrl: './input-currency-dc.component.html',
  styleUrls: ['./input-currency-dc.component.scss']
})
export class InputCurrencyDcComponent extends InputBaseComponent {
  @Input() separatorLimit: number = null;
  @Input() countryCode: GccCountryCode;
  @Input() ThreeDecimal = false;

  @Output() keyUp: EventEmitter<null> = new EventEmitter();
  @Output() totalWageCalc = new EventEmitter();
  @Output() changeEvent: EventEmitter<null> = new EventEmitter();
  customPatterns = '';

  /**
   * Creates an instance of InputCurrencyDcComponent.
   * @memberof InputCurrencyDcComponent
   */
  constructor() {
    super();
  }

  onKeyUp(e) {
    super.onKeyUp(e);
  }

  onBlur(e) {
    if (this.control.valid) {
      //only if control is valid
      if (e.target.value !== '' && !isNaN(this.control.value)) {
        if (!this.ThreeDecimal) {
          this.control.setValue(parseFloat(this.control.value).toFixed(2));
        } else {
          this.control.setValue(parseFloat(this.control.value).toFixed(3));
        }
      } else {
        this.control.setValue(parseFloat('0').toFixed(2));
      }
    }
    super.onBlur(e);
  }

  onFocus(e) {
    if (e.target.value === '0.00') {
      e.target.value = '';
    }
  }

  /**
   * This method is to set error messages.
   *
   * @param {any} control
   * @memberof InputBaseComponent
   */
  setErrorMsgs(control) {
    const error: FieldError = getErrorMsg(control, this.invalidSelection, typeNumber);
    this.errorMsg.next(error);
  }

  /** Method to handle change in control value */
  onChange(event) {
    if (typeof event === 'string' && event !== '' && event !== '0.00') {
      this.changeEvent.emit();
    }
  }
}
