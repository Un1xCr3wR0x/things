/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lengthValidator, recruitmentNumberValidator, unifiedNationalNumberValidator } from '@gosi-ui/core';
import { EstablishmentConstants, NavigationIndicatorEnum } from '../../../shared';

export const createChangeIdentifierDetailsForm = (): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    license: fb.group({
      expiryDate: fb.group({
        gregorian: [null, { updateOn: 'blur' }],
        hijiri: ['']
      }),
      issueDate: fb.group({
        gregorian: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      issuingAuthorityCode: fb.group({
        arabic: [],
        english: [
          null,
          {
            updateOn: 'blur'
          }
        ]
      }),
      number: [
        null,
        {
          validators: Validators.compose([Validators.maxLength(EstablishmentConstants.LICENSE_MAX_LENGTH)]),
          updateOn: 'blur'
        }
      ]
    }),
    crn: fb.group({
      number: [
        null,
        {
          validators: Validators.compose([lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]),
          updateOn: 'blur'
        }
      ],
      issueDate: fb.group({
        gregorian: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      expiryDate: fb.group({
        gregorian: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      mciVerified: false
    }),
    recruitmentNo: [
      null,
      {
        validators: Validators.compose([
          lengthValidator(EstablishmentConstants.RECRUITMENT_MAX_LENGTH),
          recruitmentNumberValidator
        ]),
        updateOn: 'blur'
      }
    ],
    departmentNumber: [
      null,
      {
        validators: Validators.compose([Validators.required,Validators.pattern('[0-9a-zA-Z]+')]),
        updateOn: 'blur'
      }
    ],
    unifiedNationalNumber: [
      null,
      {
        validators: Validators.compose([
          lengthValidator(EstablishmentConstants.UNIFIED_NATIONAL_NO_LENGTH),
          unifiedNationalNumberValidator
        ]),
        updateOn: 'blur'
      }
    ],
    navigationIndicator: NavigationIndicatorEnum.CSR_CHANGE_IDENTIFIER_DETAILS_SUBMIT,
    comments: ''
  });
};
