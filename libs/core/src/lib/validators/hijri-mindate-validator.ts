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
export function hijriMinDateValidator(hijriMinDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (control?.value && hijriMinDate && new Date(control.value)) {
      if (moment(new Date(control.value)).isBefore(hijriMinDate, 'day')) {
        return {
          hijriMinDate: { controlValue: control.value, minDateValue: hijriMinDate }
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}
