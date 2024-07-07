/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * This validator function is to restrict negative balance amount
 * @param selectedValue
 */
export function balanceAmountValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: object } | null => {
    return {
      balanceAmountNegative: { controlValue: control.value, valid: true }
    };
  };
}
