/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import moment from 'moment-timezone';
import { AbstractControl } from '@angular/forms';

/**
 * This method is to validate the user input date
 * @param control
 */
export function dateFormatValidator(control: AbstractControl): { [key: string]: object } | null {
  const valid = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(moment(control.value).format('YYYY-MM-DD'));
  return valid ? null : { invalidNumber: { valid: false, value: null } };
}
