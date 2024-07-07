/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeEnum,
  CRNDetails,
  DocumentItem,
  Establishment,
  lengthValidator,
  maxDateValidator,
  unifiedNationalNumberValidator,
  updateValidation
} from '@gosi-ui/core';
import {
  DocumentNameEnum,
  EstablishmentConstants,
  hasCrn,
  hasNumberFieldChange,
  isDocumentsValid,
  isEstFromMolMci,
  isGccEstablishment,
  LegalEntityEnum,
  NavigationIndicatorEnum,
  mciEstablishment
} from '../../../shared';
import { ChangeIdentifierDetailsScComponent } from './change-identifier-details-sc.component';

/**
 * Method to cancel the transaction
 */
export function cancelIdentifierTransaction(self: ChangeIdentifierDetailsScComponent) {
  if (self.isValidator) {
    self.changeEstablishmentService
      .revertTransaction(self.establishmentToChange.registrationNo, self.estRouterData.referenceNo)
      .subscribe(
        () => {
          self.setTransactionComplete();
          if (self.reRoute) {
            self.router.navigate([self.reRoute]);
          } else {
            if (self.appToken === ApplicationTypeEnum.PUBLIC) {
              self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(self.appToken)]);
            } else {
              self.changeEstablishmentService.navigateToIdentifierValidator();
            }
          }
        },
        err => self.alertService.showError(err?.error?.message)
      );
  } else {
    self.setTransactionComplete();
    self.reRoute ? self.router.navigate([self.reRoute]) : self.location.back();
  }
}

/**
 * Method to check if license has changed
 * @param establishment
 * @param changeEst
 */
export const hasLicenseChanged = (establishment: Establishment, changeEst: Establishment): boolean => {
  if (establishment.license === null) {
    if (changeEst.license === null) {
      return false;
    } else if (
      (changeEst.license.number === null || changeEst.license.number.toString() === '') &&
      changeEst.license.issuingAuthorityCode.english === null &&
      changeEst.license.issueDate.gregorian === null &&
      changeEst.license.expiryDate.gregorian === null
    ) {
      return false;
    } else {
      return true;
    }
  }

  if (establishment.license.number !== changeEst.license?.number) {
    return true;
  }

  if (establishment.license.issuingAuthorityCode === null) {
    if (changeEst.license?.issuingAuthorityCode.english !== null) {
      return true;
    }
  } else if (changeEst.license?.issuingAuthorityCode.english !== establishment.license.issuingAuthorityCode.english) {
    return true;
  }

  if (establishment.license.issueDate === null) {
    if (changeEst.license?.issueDate.gregorian !== null) {
      return true;
    }
  } else if (
    new Date(changeEst.license?.issueDate.gregorian).toDateString() !==
    new Date(establishment.license.issueDate.gregorian).toDateString()
  ) {
    return true;
  }

  if (establishment.license.expiryDate === null) {
    if (changeEst.license?.expiryDate !== null && changeEst.license?.expiryDate.gregorian !== null) {
      return true;
    }
  } else {
    if (changeEst.license?.expiryDate === null) {
      return true;
    }
    if (
      new Date(changeEst.license?.expiryDate.gregorian).toDateString() !==
      new Date(establishment.license.expiryDate.gregorian).toDateString()
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Method to check if crn has changed or not
 * @param crn
 * @param changedCrn
 */
export function hasCrnChanged(crn: CRNDetails, changedCrn: CRNDetails) {
  if (!crn) {
    if (!changedCrn) {
      return false;
    }
    if (!changedCrn.number && !changedCrn.issueDate?.gregorian) {
      return false;
    } else {
      return true;
    }
  }
  if (crn.number !== changedCrn?.number) {
    return true;
  }

  if (!crn.issueDate?.gregorian) {
    if (changedCrn?.issueDate?.gregorian) {
      return true;
    }
  } else if (
    new Date(changedCrn?.issueDate?.gregorian).toDateString() !== new Date(crn?.issueDate?.gregorian).toDateString()
  ) {
    return true;
  }

  if (!crn.expiryDate?.gregorian) {
    if (changedCrn?.expiryDate?.gregorian) {
      return true;
    }
  } else if (
    new Date(changedCrn?.expiryDate?.gregorian).toDateString() !== new Date(crn?.expiryDate?.gregorian).toDateString()
  ) {
    return true;
  }

  if (crn?.mciVerified !== changedCrn?.mciVerified) {
    return true;
  }

  return false;
}

/**
 * Method to set the license variables
 */
export function bindLicenseToForm(self: ChangeIdentifierDetailsScComponent, establishment: Establishment) {
  const [number, issuingAuth, issueDate, expiryDate]: Array<FormControl> = self.getLicenseControls();
  if (establishment.license.issuingAuthorityCode) {
    issuingAuth.setValue(establishment.license.issuingAuthorityCode.english);
  }
  number.setValue(establishment.license.number);
  if (establishment.license.issueDate) {
    /* self.maxIssueDate = new Date(establishment.license.issueDate.gregorian); */
    issueDate.setValue(new Date(establishment.license.issueDate.gregorian));
    issueDate.setValidators([maxDateValidator(self.maxIssueDate)]);
    issueDate.updateValueAndValidity();
  }
  if (establishment.license.expiryDate) {
    expiryDate.setValue(new Date(establishment.license.expiryDate.gregorian));
  }
}

/**
 * Method to get the crn control
 * @param form
 */
export function getCrnControls(form: FormGroup): FormControl[] {
  const crnForm = form?.get('crn') as FormGroup;
  if (crnForm) {
    return [
      crnForm.get('number') as FormControl,
      crnForm.get('issueDate').get('gregorian') as FormControl,
      crnForm.get('mciVerified') as FormControl,
      crnForm.get('expiryDate').get('gregorian') as FormControl
    ];
  } else {
    return [];
  }
}

export function bindCrnToForm(form: FormGroup, crn: CRNDetails) {
  if (crn && form) {
    form.get('number').setValue(crn.number);
    const issueDateValue = crn.issueDate?.gregorian ? new Date(crn.issueDate.gregorian) : null;
    form.get('issueDate').get('gregorian').setValue(issueDateValue);
    const expiryDate = crn.expiryDate?.gregorian ? new Date(crn.expiryDate.gregorian) : null;
    form.get('expiryDate').get('gregorian').setValue(expiryDate);
    form.get('mciVerified').setValue(crn.mciVerified);
    form.updateValueAndValidity();
  }
}

/**
 * Method to check if the transaction is valid
 */
export function isValidForSubmit(self: ChangeIdentifierDetailsScComponent) {
  const estWithCrn = { crn: (self.changeIdentifierDetailsForm.get('crn') as FormGroup).getRawValue() };
  const isCrnVerified = hasCrnChanged(
    self.establishmentToChange.crn,
    (self.changeIdentifierDetailsForm.get('crn') as FormGroup).getRawValue()
  )
    ? self.changeIdentifierDetailsForm.get('crn')?.get('mciVerified')?.value === true
    : true;

  if (hasCrn(estWithCrn as Establishment) && !isCrnVerified) {
    self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.VERIFY-CRN');
    return false;
  }
  if (self.changeIdentifierDetailsForm.valid === false && !self.isPpaGCC) {
    self.alertService.showMandatoryErrorMessage();
    return false;
  }
  if (self.changeIdentifierDetailsForm.get('departmentNumber').valid === false && self.isPpaGCC) {
    self.alertService.showMandatoryErrorMessage();
    return false;
  }
  const isDocumentsSubmitted = isDocumentsValid(self.identifierDetailsDocuments);
  if (isDocumentsSubmitted === false && !self.hasCrn && !self.hasUnn) {
    self.alertService.showMandatoryDocumentsError();
    return false;
  }
  if (self.isValidator) {
    self.changeIdentifierDetailsForm
      .get('navigationIndicator')
      .setValue(NavigationIndicatorEnum.VALIDATOR_CHANGE_IDENTIFIER_DETAILS_SUBMIT);
  } else {
    self.changeIdentifierDetailsForm
      .get('navigationIndicator')
      .setValue(NavigationIndicatorEnum.CSR_CHANGE_IDENTIFIER_DETAILS_SUBMIT);
  }
  return true;
}

/**
 * Method to check if license is empty
 * @param controls
 */
export function hasLicense(controls: FormControl[]) {
  const [licenseNo, issuingAuth, issueDate, expiryDate]: Array<FormControl> = controls;
  const hasValue = licenseNo?.value || issuingAuth?.value || issueDate?.value || expiryDate?.value ? true : false;
  return hasValue;
}

/**
 * Method to bind data to form
 */
export function bindIdentifierForm(self: ChangeIdentifierDetailsScComponent, establishment: Establishment) {
  Object.keys(self.changeIdentifierDetailsForm.controls).forEach(key => {
    if (key in establishment) {
      if (key === 'license') {
        if (establishment.license) {
          bindLicenseToForm(self, establishment);
        }
      } else if (key === 'crn') {
        bindCrnToForm(self.changeIdentifierDetailsForm.get('crn') as FormGroup, establishment?.crn);
      } else {
        self.changeIdentifierDetailsForm.get(key).setValue(establishment[key]);
      }
    }
    if (
      !isGccEstablishment(establishment) &&
      establishment.legalEntity.english !== LegalEntityEnum.GOVERNMENT &&
      establishment.legalEntity.english !== LegalEntityEnum.SEMI_GOV
    ) {
      self.changeIdentifierDetailsForm
        .get('unifiedNationalNumber')
        .setValidators([Validators.required, lengthValidator(self.nationalNoLength), unifiedNationalNumberValidator]);
      self.showNationalNo = true;
    } else {
      self.changeIdentifierDetailsForm
        .get('unifiedNationalNumber')
        .setValidators([lengthValidator(self.nationalNoLength), unifiedNationalNumberValidator]);
      self.showNationalNo = false;
    }
  });
}

export function checkChangesForValidator(self: ChangeIdentifierDetailsScComponent) {
  self.hasCrn = hasCrn(self.establishmentToChange);
  self.hasLicenseChanged = hasLicenseChanged(self.establishmentAfterChange, self.establishmentToChange);
  self.hasCrnChanged = hasCrnChanged(self.establishmentAfterChange?.crn, self.establishmentToChange?.crn);
  self.hasRecruitmentNoChanged = hasNumberFieldChange(
    self.establishmentAfterChange?.recruitmentNo,
    self.establishmentToChange?.recruitmentNo
  );
  self.hasNationalNoChange = hasNumberFieldChange(
    self.establishmentAfterChange?.unifiedNationalNumber,
    self.establishmentToChange?.unifiedNationalNumber
  );
  changeIdentifierDocumentsValidations(self);
  changeIdentifierFieldsValidation(self);
}

export function changeIdentifierDocumentsValidations(self: ChangeIdentifierDetailsScComponent) {
  if (self.identifierDetailsDocuments) {
    const employeeDoc = self.identifierDetailsDocuments.find(
      doc => doc.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT
    );
    const authDoc = self.identifierDetailsDocuments.find(
      doc => doc.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER
    );
    const nationalIdIqama = self.identifierDetailsDocuments.find(
      doc => doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA
    );
    if (employeeDoc) employeeDoc.required = employeeDoc.show = self.appToken === ApplicationTypeEnum.PRIVATE;
    if (nationalIdIqama) {
      nationalIdIqama.required = false;
      nationalIdIqama.show = self.appToken === ApplicationTypeEnum.PRIVATE;
    }
    if (authDoc) {
      authDoc.show = self.appToken === ApplicationTypeEnum.PRIVATE;
      authDoc.required = false;
    }
    const crn = self.identifierDetailsDocuments.find(
      doc => doc.name.english === DocumentNameEnum.COMMERCIAL_REG_DOCUMENT
    );
    const license = self.identifierDetailsDocuments.find(doc => doc.name.english === DocumentNameEnum.LICENSE_DOCUMENT);

    if (crn && license) {
      // If License is changed show license document
      const licenseDocCheck = self.hasLicenseChanged ? hasLicense(self.getLicenseControls()) : false;
      license.show = licenseDocCheck;
      license.required = licenseDocCheck;

      /*
       * Crn to be shown:
       * If Crn has Changed/Added or
       * If license has changed and crn is already there in db
       * If there is no license
       */
      const licenseExists = hasLicense(self.getLicenseControls());
      const showCrnDoc = self.hasCrnChanged || (licenseDocCheck && self.hasCrn) || !licenseExists;
      crn.show = showCrnDoc;
      crn.required = showCrnDoc;

      //If Recruitment-No has Changed
      if (self.hasRecruitmentNoChanged) {
        //Has Crn in DB or User has verified Crn
        const hasValidCrn = self.hasCrn || getCrnControls(self.changeIdentifierDetailsForm)[2]?.value === true;
        crn.show = showCrnDoc ? true : hasValidCrn; //If Crn Changes is not there or license change with Crn is not there then if Crn is already present of verified then show Crn to support recruitment no change
        crn.required = showCrnDoc ? true : hasValidCrn;
        license.show = licenseDocCheck ? true : !hasValidCrn; //If license change are not there and has no valid crn in  db or in screen show license to support recruitment no change
        license.required = licenseDocCheck ? true : !hasValidCrn;
      }
      checkForNationalNoChange(self, crn, showCrnDoc, license, licenseDocCheck);
    }
  }
}

export function checkForNationalNoChange(
  self: ChangeIdentifierDetailsScComponent,
  crn: DocumentItem,
  showCrnDoc: boolean,
  license: DocumentItem,
  licenseDocCheck: boolean
) {
  //If National-No has Changed
  if (self.hasNationalNoChange && self.showNationalNo) {
    //Has Crn in DB or User has verified Crn
    const hasValidCrn = self.hasCrn || getCrnControls(self.changeIdentifierDetailsForm)[2]?.value === true;
    crn.show = showCrnDoc ? true : hasValidCrn; //If Crn Changes is not there or license change with Crn is not there then if Crn is already present of verified then show Crn to support recruitment no change
    crn.required = showCrnDoc ? true : hasValidCrn;
    license.show = licenseDocCheck ? true : !hasValidCrn; //If license change are not there and has no valid crn in  db or in screen show license to support recruitment no change
    license.required = licenseDocCheck ? true : !hasValidCrn;
  }
}

export function changeIdentifierFieldsValidation(self: ChangeIdentifierDetailsScComponent) {
  const controls = getCrnControls(self.changeIdentifierDetailsForm);
  //Crn Field Validation
  if (self.hasCrnChanged) {
    updateValidation(controls[0], true, [lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]);
    updateValidation(controls[1], true);
  } else {
    const licenseExists = hasLicense(self.getLicenseControls());
    updateValidation(controls[0], !licenseExists, [lengthValidator(EstablishmentConstants.CRN_MAX_LENGTH)]);
    updateValidation(controls[1], !licenseExists);
  }
  //License Field Validation
  const makeLicenseMandatory = shouldLicenseBeMandatory(self);
  alterLicenseFieldsValidaity(self, makeLicenseMandatory);
}

export function shouldLicenseBeMandatory(self: ChangeIdentifierDetailsScComponent) {
  // Crn is Valid if the crn is from DB or Crn is verified by User.
  const isCrnValid = self.hasCrn || getCrnControls(self.changeIdentifierDetailsForm)[2]?.value === true;
  if (self.hasLicenseChanged) {
    if (
      hasLicense(self.getLicenseControls()) || //Has License
      !isCrnValid
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function alterLicenseFieldsValidaity(self: ChangeIdentifierDetailsScComponent, makeRequired: boolean) {
  const [number, issuingAuth, issueDate]: Array<FormControl> = self.getLicenseControls();
  updateValidation(issuingAuth, makeRequired);
  updateValidation(number, makeRequired);
  updateValidation(issueDate, makeRequired, [maxDateValidator(self.maxIssueDate)]);
}
