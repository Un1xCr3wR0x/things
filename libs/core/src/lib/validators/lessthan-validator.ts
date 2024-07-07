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
export function lessThanValidator(lessThan: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (control.value > lessThan) {
      return {
        lessThan: { controlValue: control.value, lessThanValue: lessThan }
      };
    } else {
      return null;
    }
  };
}
