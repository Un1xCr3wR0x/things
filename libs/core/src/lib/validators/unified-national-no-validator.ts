/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';
import { isUnifiedNationalNumber } from '../utils/identifier';

/**
 * This method is to validate the unified number
 * @param control
 */
export function unifiedNationalNumberValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid = true;
  if (control && control.value) {
    const unifiedNo = control.value.toString();
    valid = isUnifiedNationalNumber(unifiedNo);
  }
  return valid ? null : { invalidUnifiedNo: { valid: false, value: null } };
}
