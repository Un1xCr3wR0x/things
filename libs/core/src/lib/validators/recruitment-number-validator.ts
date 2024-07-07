/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';
import { checkSumValidation } from '../utils';

/**
 * This method is to validate the recruitment number
 * @param control
 */
export function recruitmentNumberValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid = true;
  if (control && control.value) {
    const recruitmentNo = control.value.toString();
    if (recruitmentNo.length === 10) {
      const digitOne = +recruitmentNo.substring(0, 1);
      valid = digitOne === 7;
    } else {
      valid = null;
    }
  }

  return valid ? null : { invalidRecruitment: { valid: false, value: null } };
}
