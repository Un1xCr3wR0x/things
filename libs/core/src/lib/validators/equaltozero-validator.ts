/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * This validator function is to make the drop down selection invalid
 * @param selectedValue
 */
export function equaltozeroValidator(greaterThan: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (greaterThan === 0 && control.value > greaterThan) {
      return {
        zeroMinValidator: { controlValue: control.value, greaterThanValue: greaterThan }
      };
    } else {
      return null;
    }
  };
}
