/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';
import { isNIN } from '../utils/identifier';

/**
 * This method is to validate the NIN
 * @param control
 */
export function ninValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid = false;
  if (control && control.value) {
    const nin = control.value.toString();
    valid = isNIN(nin);
  }
  return valid ? null : { invalidNIN: { valid: false, value: null } };
}
