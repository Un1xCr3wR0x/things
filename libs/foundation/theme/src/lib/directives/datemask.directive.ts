/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * This is a directive to convert the date value to preferred format
 *
 * @export
 * @class DateMaskDirective
 *
 */
@Directive({
  selector: '[gosiDateMask]'
})
export class DateMaskDirective {
  /**
   * Creates an instance of  DateMaskDirective
   * @param ngControl
   * @memberof  DateMaskDirective
   */
  constructor(public ngControl: NgControl) {}

  @HostListener('keyup', ['$event'])
  keydownBackspace(event) {
    if (event.key === 'Backspace') {
      this.onInputChange(event.target.value, true);
    } else {
      this.onInputChange(event.target.value, false);
    }
  }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal.replace(/^(\d{0,2})/, '$1/');
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1/$2');
    } else if (newVal.length <= 8) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');
    } else {
      newVal = newVal.substring(0, 8);
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
