/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';
import { isBorderNumber } from '../utils/identifier';

/**
 * This method is to validate the BorderNo
 * @param control
 */
export function borderNoValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid = true;
  if (control && control.value) {
    const borderNo = control.value.toString();
    valid = isBorderNumber(borderNo);
  }

  return valid ? null : { invalidBorderNo: { valid: false, value: null } };
}
