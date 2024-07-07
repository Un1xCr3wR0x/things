/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl } from '@angular/forms';

/**
 * This validator function is to make the drop down selection invalid
 * @param selectedValue
 */
export function wageValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid;
  if (control) {
    if (control.value === null || control.value === '0.00' || control.value === 0) {
      valid = false;
    } else {
      valid = true;
    }
  } else {
    valid = true;
  }

  return valid ? null : { inCorrectValue: { valid: false } };
}
