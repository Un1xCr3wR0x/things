/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';
import { isIqamaNumber } from '../utils/identifier';

/**
 * This method is to validate the Iqama
 * @param control
 */
export function iqamaValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid = true;
  if (control && control.value) {
    const iqama = control.value.toString();
    valid = isIqamaNumber(iqama);
  }

  return valid ? null : { invalidIqama: { valid: false, value: null } };
}
