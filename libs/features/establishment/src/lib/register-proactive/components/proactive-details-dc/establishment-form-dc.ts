/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  lengthValidator,
  maxDateValidator,
  minDateValidator,
  recruitmentNumberValidator,
  updateValidation
} from '@gosi-ui/core';
import { getCrnControls } from '../../../change-establishment/components/change-identifier-details-sc/change-identifier-helper';
import { EstablishmentConstants } from '../../../shared';

export enum constants {
  CRN = 'crn',
  LegalEntity = 'legalEntity',
  License = 'license',
  IssueDate = 'issueDate',
  ExpiryDate = 'expiryDate',
  Gregorian = 'gregorian',
  IssuingAuthCode = 'issuingAuthorityCode',
  English = 'english',
  Number = 'number',
  Hijiri = 'hijiri'
}

/**
 * This method is to create establishment details form
 */
export const createEstablishmentForm = isCrnRequired => {
  const fb = new FormBuilder();
  return fb.group({
    crn: fb.group({
      issueDate: fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose(isCrnRequired ? [Validators.required] : []),
            updateOn: 'blur'
          }
        ],
        hijiri: [null]
      }),
      expiryDate: fb.group({
        gregorian: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        hijiri: [null]
      }),
      number: [
        null,
        {
          validators: Validators.compose(
            isCrnRequired
              ? [Validators.required, lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]
              : [lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]
          ),
          updateOn: 'blur'
        }
      ]
    }),
    unifiedNationalNumber: [
      null,
      {
        validators: Validators.compose([
          Validators.required,
          lengthValidator(EstablishmentConstants.UNIFIED_NATIONAL_NO_LENGTH)
        ])
      }
    ],

    legalEntity: fb.group({
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      arabic: [null]
    }),
    molEstablishmentIds: fb.group({
      molEstablishmentId: [],
      molEstablishmentOfficeId: [],
      molOfficeId: [],
      molunId: []
    }),
    license: fb.group({
      issueDate: fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose(!isCrnRequired ? [Validators.required] : []),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      issuingAuthorityCode: fb.group({
        english: [
          null,
          {
            validators: Validators.compose(!isCrnRequired ? [Validators.required] : []),
            updateOn: 'blur'
          }
        ],
        arabic: []
      }),
      number: [
        '',
        {
          validators: Validators.compose(
            !isCrnRequired
              ? [Validators.required, Validators.maxLength(EstablishmentConstants.LICENSE_MAX_LENGTH)]
              : [Validators.maxLength(EstablishmentConstants.LICENSE_MAX_LENGTH)]
          ),
          updateOn: 'blur'
        }
      ],
      expiryDate: fb.group({
        gregorian: [null],
        hijiri: ['']
      })
    }),
    establishmentType: fb.group({
      english: [],
      arabic: []
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
    ]
  });
};

export function getLicenseControls(licenseform) {
  if (licenseform) {
    const licenseNo: FormControl = licenseform.get(constants.Number) as FormControl;
    const issuingAuth: FormControl = licenseform.get(constants.IssuingAuthCode)?.get('english') as FormControl;
    const issueDate: FormControl = licenseform.get(constants.IssueDate)?.get('gregorian') as FormControl;
    const expiryDate: FormControl = licenseform.get(constants.ExpiryDate)?.get('gregorian') as FormControl;
    return [licenseNo, issuingAuth, issueDate, expiryDate];
  }
}

export function alterCrnFieldsValidation(isRequired, form) {
  const controls = getCrnControls(form);
  if (isRequired) {
    updateValidation(controls[0], true, [lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]);
    updateValidation(controls[1], true);
  } else {
    updateValidation(controls[0], false, [lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]);
    updateValidation(controls[1], false);
  }
}

export function alterLicenseValidation(isRequired, crnForm) {
  const [number, issuingAuth, issueDate, expiryDate]: Array<FormControl> = getLicenseControls(crnForm);
  updateValidation(issuingAuth, isRequired);
  updateValidation(number, isRequired);
  updateValidation(issueDate, isRequired, [maxDateValidator(new Date())]);
  updateValidation(expiryDate, false);
}
