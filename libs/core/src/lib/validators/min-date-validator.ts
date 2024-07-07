/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, ValidatorFn } from '@angular/forms';
import moment from 'moment';

/**
 * This validator function is to make the drop down selection invalid
 * @param selectedValue
 */
export function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (control?.value && minDate && new Date(control.value)) {
      if (moment(new Date(control.value)).isBefore(minDate, 'day')) {
        return {
          minDate: { controlValue: control.value, minDateValue: minDate }
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}
