import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export function compareValidator(compareControl: string, isEquals: boolean = false): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (control?.parent?.get(compareControl)?.value === control?.value)
      return isEquals ? { isMatch: { valid: false, value: null } } : null;
    else if (control?.parent?.get(compareControl)?.value !== control?.value)
      return !isEquals ? { misMatch: { valid: false, value: null } } : null;
  };
}
