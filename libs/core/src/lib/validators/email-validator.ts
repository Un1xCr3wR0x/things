/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';

/**
 * This method is to validate the NIN
 * @param control
 */
export function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  let valid = true;
  const emailPattern = new RegExp(/^[\w-\.]+@(?!gosi.gov.sa)(?!-)([\w-]+\.)+[\w-]{2,32}$/);
  if (control.value && control.value.match(emailPattern) == null) {
    valid = false;
  }

  return valid ? null : { email: true };
}
