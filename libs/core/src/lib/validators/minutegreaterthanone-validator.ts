import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minuteGreaterThanOneValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const minute = control.value;
      if (minute && minute > 1) {
        return null; // valid
      }
      return {'minuteGreaterThanOne': true}; // invalid
    };
  }