import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export const personalDetailsForm = (): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    name: fb.group({
      arabic: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      english: null
    }),
    englishName: fb.group({
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

// export const getEducationForm = (): FormGroup => {
//   const fb = new FormBuilder();
//   return fb.group({
//     education: fb.group({
//       english: [
//         null,
//         {
//           validators: Validators.compose([Validators.required]),
//           updateOn: 'blur'
//         }
//       ],
//       arabic: null
//     }),
//     specialization: fb.group({
//       english: [
//         null,
//         {
//           validators: Validators.compose([Validators.required]),
//           updateOn: 'blur'
//         }
//       ],
//       arabic: null
//     })
//   });
// };
