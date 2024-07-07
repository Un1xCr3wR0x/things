/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstablishmentConstants } from '../../constants';
import { OrganisationTypeEnum } from '../../enums';

export const createEstablishmentDetailsForm = (orgType: string): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    name: fb.group({
      arabic: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            Validators.maxLength(EstablishmentConstants.EST_NAME_ARABIC_MAX_LENGTH)
          ]),
          updateOn: 'blur'
        }
      ],
      english: [
        null,
        {
          validators: Validators.compose([Validators.maxLength(EstablishmentConstants.EST_NAME_ENGLISH_MAX_LENGTH)]),
          updateOn: 'blur'
        }
      ]
    }),
    legalEntity: fb.group({
      english: [null, Validators.required],
      arabic: []
    }),
    lawType: fb.group({
      english: [
        null,
        orgType === OrganisationTypeEnum.GOVERNMENT || orgType === OrganisationTypeEnum.GCC ? Validators.required : null
      ],
      arabic: []
    }),
    departmentNumber: [
      null,
      {
        validators: Validators.compose([Validators.pattern('[0-9a-zA-Z]+')]),
        updateOn: 'blur'
      }
    ],

    startDate: fb.group({
      gregorian: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      hijiri: ['']
    }),

    nationalityCode: fb.group({
      arabic: [],
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ]
    }),
    activityType: fb.group({
      arabic: [],
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ]
    })
  });
};
