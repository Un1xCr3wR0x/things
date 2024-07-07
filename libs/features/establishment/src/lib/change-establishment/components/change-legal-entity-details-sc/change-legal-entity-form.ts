/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 * This file is used to handle form actions
 */

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeEnum, Establishment, NationalityTypeEnum } from '@gosi-ui/core';
import { LegalEntityEnum, NavigationIndicatorEnum } from '../../../shared';
import { ChangeLegalEntityDetailsScComponent } from './change-legal-entity-details-sc.component';

/**
 * Method to create legal entity form
 */
export function createLegalEntityDetailsForm(self: ChangeLegalEntityDetailsScComponent) {
  return self.fb.group({
    legalEntity: self.fb.group({
      english: [null, Validators.required],
      arabic: []
    }),
    paymentType: self.fb.group({
      arabic: [],
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ]
    }),
    nationalityCode: self.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null]
    }),
    navigationIndicator: [NavigationIndicatorEnum.CSR_LEGAL_ENTITY_CHANGE_SUBMIT],
    comments: null,
    referenceNo: null,
    lateFeeIndicator: self.fb.group({
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
}

export function createOwnerSelectionForm(self: ChangeLegalEntityDetailsScComponent): FormGroup {
  return self.fb.group({
    english: [self.currentOwnerSelection, { validators: Validators.required, updateOn: 'blur' }],
    arabic: null
  });
}

// Method to assmeble establishment details to form
export function patchLegalEntityForm(establishment: Establishment, legalEnityForm: FormGroup): void {
  if (legalEnityForm && establishment) {
    legalEnityForm.patchValue(establishment);
    if (establishment.establishmentAccount?.paymentType) {
      legalEnityForm.get('paymentType').patchValue(establishment.establishmentAccount?.paymentType);
    }
  }
}

// Method to show nationality and set default
export function defaultNationality(
  self: ChangeLegalEntityDetailsScComponent,
  isDisabled: boolean,
  nationality?: string
) {
  self.showNationality = true;
  const nationalityControl: FormControl = self.legalEntityForm.get('nationalityCode').get('english') as FormControl;
  if (isDisabled) {
    if(self.isPpa && self.establishment.gccCountry){
      self.showNationality = false;
      nationalityControl.setValue(self.establishment.gccEstablishment?.country.english);
    }
    else{
    nationalityControl.setValue(NationalityTypeEnum.SAUDI_NATIONAL);
    }
    self.disabledNationality = true;
  } else {
    nationalityControl.setValue(nationality);
    self.disabledNationality = false;
  }
  nationalityControl.updateValueAndValidity();
}

// Method to set the required value for payment type
export function setPayment(
  self: ChangeLegalEntityDetailsScComponent,
  paymentType: string = null,
  showPaymentSection: boolean = false,
  isRequired: boolean = true
) {
  const paymentControl = self.legalEntityForm.get('paymentType').get('english');
  self.showContribution = showPaymentSection;
  paymentControl.setValue(paymentType);
  if (isRequired === true) {
    paymentControl.setValidators(Validators.required);
  } else {
    paymentControl.clearValidators();
  }
  paymentControl.updateValueAndValidity();
}

export function setLateFeeIndicator(
  self: ChangeLegalEntityDetailsScComponent,
  value: string = null,
  showLateFeeSection = false,
  isRequired = true
) {
  const lateFeeControl = self.legalEntityForm.get('lateFeeIndicator').get('english');
  self.showLateFeeIndicator = showLateFeeSection;
  lateFeeControl.setValue(value);
  if (isRequired === true) {
    lateFeeControl.setValidators(Validators.required);
  } else {
    lateFeeControl.clearValidators();
  }
  lateFeeControl.updateValueAndValidity();
}
