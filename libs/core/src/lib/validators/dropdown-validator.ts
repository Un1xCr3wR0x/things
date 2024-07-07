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
export function dropdownValidator(selectedValue: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value !== undefined) {
      if (control.value === selectedValue) {
        return { invalidSelection: true };
      } else {
        return null;
      }
    }
  };
}
