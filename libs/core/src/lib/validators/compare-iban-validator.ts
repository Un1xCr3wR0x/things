import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export function compareIbanValidator(compareControl: string, isEquals: boolean = false): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    if (control?.parent?.get(compareControl)?.value === control?.value) {
      return isEquals ? { ibanMisMatch: { valid: false, value: null } } : null;
    } else if (control?.parent?.get(compareControl)?.value !== control?.value)
      return !isEquals ? { ibanMisMatch: { valid: false, value: null } } : null;
  };
}
