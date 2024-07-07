import { AbstractControl, ValidationErrors } from '@angular/forms';

export function authPurposeValidator(control: AbstractControl): ValidationErrors | null {
  return control.get('isRequestBenefitPurpose').value || control.get('isReceiveBenefitPurpose').value
    ? null
    : {
        required: { valid: false, value: null }
      };
}
