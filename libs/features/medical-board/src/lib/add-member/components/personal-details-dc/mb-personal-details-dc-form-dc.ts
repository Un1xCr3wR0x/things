/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentifierLengthEnum, IdentityTypeEnum, iqamaValidator, lengthValidator, ninValidator } from '@gosi-ui/core';

export const MbPersonalDetailsForm = (): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    newNin: [
      null,
      {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          lengthValidator(IdentifierLengthEnum.NIN),
          ninValidator
        ]),
        updateOn: 'blur'
      }
    ],
    iqamaNo: [
      null,
      {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]+'),
          lengthValidator(IdentifierLengthEnum.IQAMA),
          iqamaValidator
        ]),
        updateOn: 'blur'
      }
    ],
    passportNo: [
      null,
      {
        validators: Validators.compose([
          Validators.pattern('[a-zA-Z0-9]+$'),
          Validators.required,
          Validators.maxLength(IdentifierLengthEnum.PASSPORT)
        ]),
        updateOn: 'blur'
      }
    ],
    id: [
      null,
      {
        validators: Validators.compose([Validators.pattern('[0-9]+'), Validators.required]),
        updateOn: 'blur'
      }
    ],
    nationality: fb.group({
      english: [null, Validators.required],
      arabic: []
    }),
    birthDate: fb.group({
      gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
      hijiri: ''
    }),
    idType: IdentityTypeEnum.NIN
  });
};
