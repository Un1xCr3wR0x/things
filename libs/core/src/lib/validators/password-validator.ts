/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';

/**
 * This method is to validate the Password
 * @param control
 */
export function passwordValidator(control: AbstractControl): { [key: string]: object } | null {
  if (control && control.value && control.value.length > 8) {
    const password = control.value.toString();
    if (!new RegExp('^([A-Za-z]{1})').test(password)) {
      return { alphabetFirst: { valid: false, value: null } };
    } else if (!new RegExp('[A-Z]').test(password)) {
      return { passwordUpperCase: { valid: false, value: null } };
    } else if (!new RegExp('[a-z]').test(password)) {
      return { passwordLowerCase: { valid: false, value: null } };
    } else if (!new RegExp('[0-9]').test(password)) {
      return { passwordNumeric: { valid: false, value: null } };
    } else if (!new RegExp('[!@#$%^&]').test(password)) {
      return { passwordSpecial: { valid: false, value: null } };
    } else return null;
  }
  return null;
}
