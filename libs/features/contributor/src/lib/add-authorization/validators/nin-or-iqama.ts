import { FormControl } from '@angular/forms';
import { ninValidator, iqamaValidator, borderNoValidator } from '@gosi-ui/core';

export function NINOrIqamaOrBorderValidator(control: FormControl) {
  if (ninValidator(control) != null && iqamaValidator(control) != null && borderNoValidator(control) != null) {
    return { invalidNIN: { valid: false, value: null } };
  }
  return null;
}
