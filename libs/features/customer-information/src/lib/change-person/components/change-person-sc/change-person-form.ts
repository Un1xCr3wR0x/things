import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export const getEducationForm = (): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    education: fb.group({
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      arabic: null
    }),
    specialization: fb.group({
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      arabic: null
    })
  });
};
