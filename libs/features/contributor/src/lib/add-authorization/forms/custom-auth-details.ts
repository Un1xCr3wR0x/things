import { FormBuilder, Validators } from '@angular/forms';

export function createCustomAuthDetailForm(fb: FormBuilder) {
  return fb.group({
    countryOfIssue: fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null]
    }),
    authIssueDate: fb.control(null, [Validators.required]),
    authExpiryDate: fb.control(null, [])
  });
}
