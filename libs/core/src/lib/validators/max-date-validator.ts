/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

/**
 * This validator function is to make the drop down selection invalid
 * @param maxDate
 */
export function maxDateValidator(maxDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (
      control?.value &&
      maxDate &&
      new Date(control.value) &&
      moment(new Date(control.value)).isAfter(maxDate, 'day')
    ) {
      return {
        maxDate: { controlValue: control.value, maxDateValue: maxDate }
      };
    } else {
      return null;
    }
  };
}
