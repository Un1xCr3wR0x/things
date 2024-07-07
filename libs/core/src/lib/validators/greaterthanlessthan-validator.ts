/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * This validator function is to check less than greater than
 * equaltoZero param is set such a way that if the field dont want 0 then make the param as true
 * @param selectedValue
 */
export function greaterThanLessThanValidator(
  greaterThan: number,
  lessThan: number,
  equalToZero: boolean = false
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (equalToZero && control.value === 0) {
      return {
        zeroValidator: { controlValue: control.value, greaterThanValue: greaterThan }
      };
    } else if (control.value < greaterThan) {
      return {
        greaterThan: { controlValue: control.value, greaterThanValue: greaterThan }
      };
    } else if (control.value > lessThan) {
      return {
        lessThan: { controlValue: control.value, lessThanValue: lessThan }
      };
    } else {
      return null;
    }
  };
}
