/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * This validator function is to validate length of the form control
 * Usage If min and max same provide only one value as parameter
 * If different use provide separate values
 * @param maxDate
 */
export function lengthValidator(minLength: number, maxLength?: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    let valid = false;
    if (control && control.value) {
      const controlValue = control.value.toString();

      /** Min ad Max same */
      if ((minLength && !maxLength) || minLength === maxLength) {
        if (control && controlValue && (controlValue.length < minLength || controlValue.length > minLength)) {
          valid = false;
        } else {
          valid = true;
        }
        return valid ? null : { preciseLength: { length: minLength } };
      } else {
        /** Min ad Max different */
        if (controlValue && (controlValue.length < minLength || controlValue.length > maxLength)) {
          valid = false;
        } else {
          valid = true;
        }
        return valid ? null : { invalidLength: { min: minLength, max: maxLength } };
      }
    }
  };
}
