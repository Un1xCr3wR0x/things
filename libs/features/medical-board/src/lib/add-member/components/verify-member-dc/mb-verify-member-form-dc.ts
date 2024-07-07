/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentifierLengthEnum, IdentityTypeEnum, iqamaValidator, lengthValidator, ninValidator } from '@gosi-ui/core';

export const MbMemberForm = (): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    iqamaNo: [
      null,
      {
        validators: Validators.compose([
          Validators.pattern('[0-9]+'),
          lengthValidator(IdentifierLengthEnum.IQAMA),
          iqamaValidator
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
    birthDate: fb.group({
      gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
      hijiri: ''
    }),
    passportNo: [
      null,
      {
        validators: Validators.compose([
          Validators.pattern('[a-zA-Z0-9]+$'),
          Validators.maxLength(IdentifierLengthEnum.PASSPORT)
        ]),
        updateOn: 'blur'
      }
    ],
    nationality: fb.group({
      english: [null, Validators.required],
      arabic: []
    }),
    idType: IdentityTypeEnum.NIN
  });
};
