import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentifierLengthEnum, lengthValidator } from '@gosi-ui/core';
import { NINOrIqamaOrBorderValidator } from '../validators/nin-or-iqama';

export class MOJSmartForm {
  fb: FormBuilder;
  form: FormGroup;

  constructor(fb) {
    this.fb = fb;
    this.form = fb.group({
      authType: fb.group({
        english: ['Attorney', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      }),
      authSource: fb.group({
        english: ['Ministry of Justice', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      }),
      // used as auth and custody number
      authNumber: fb.control(null, [Validators.required]),
      id: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            // NIN, Iqama, Border number have the same length = 10
            lengthValidator(IdentifierLengthEnum.NIN),
            Validators.maxLength(IdentifierLengthEnum.NIN),
            Validators.pattern('[0-9]+'),
            NINOrIqamaOrBorderValidator
          ]),
          updateOn: 'blur'
        }
      ],
      birthDate: fb.group({
        calendarType: fb.group({
          english: ['GREGORIAN', { validators: Validators.required }],
          arabic: [null],
          updateOn: 'blur'
        }),
        gregorian: fb.control(null, [Validators.required])
      })
    });
  }

  addBirthDate() {
    this.form.addControl(
      'birthDate',
      this.fb.group({
        calendarType: this.fb.group({
          english: ['GREGORIAN', { validators: Validators.required }],
          arabic: [null],
          updateOn: 'blur'
        }),
        gregorian: this.fb.control(null, [Validators.required])
      })
    );
  }

  removeBirthDate() {
    this.form.removeControl('birthDate');
  }

  get authType() {
    return this.form.get('authType');
  }
  get authSource() {
    return this.form.get('authSource');
  }
  get authNumber() {
    return this.form.get('authNumber');
  }
  get id() {
    return this.form.get('id');
  }
  get birthDate() {
    return this.form.get('birthDate');
  }
}
