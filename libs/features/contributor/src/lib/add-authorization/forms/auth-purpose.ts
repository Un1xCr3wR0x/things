import { FormBuilder } from '@angular/forms';
import { authPurposeValidator } from '../validators';

export function createAuthPurposeForm(fb: FormBuilder) {
  return fb.group(
    {
      isRequestBenefitPurpose: fb.control(true, []),
      isReceiveBenefitPurpose: fb.control(true, [])
    },
    { validators: authPurposeValidator }
  );
}
