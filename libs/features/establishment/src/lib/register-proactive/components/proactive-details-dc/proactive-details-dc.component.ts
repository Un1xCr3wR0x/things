/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BaseComponent, BilingualText, Establishment, LovList, markFormGroupTouched, scrollToTop } from '@gosi-ui/core';
import { takeUntil } from 'rxjs/operators';
import {
  EstablishmentConstants,
  EstablishmentTypeEnum,
  LegalEntityEnum,
  MciResponse,
  SystemParamsEnum
} from '../../../shared';
import {
  alterCrnFieldsValidation,
  alterLicenseValidation,
  constants,
  createEstablishmentForm
} from './establishment-form-dc';

//TODO Move to a separate file and import here

@Component({
  selector: 'est-proactive-details-dc',
  templateUrl: './proactive-details-dc.component.html',
  styleUrls: ['./proactive-details-dc.component.scss']
})
export class ProactiveDetailsDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Input Variables
  @Input() establishment: Establishment;
  @Input() legalEntityList: LovList;
  @Input() establishmentType: LovList;
  @Input() licenseIssuingAuthorityList: LovList;
  @Input() showReset = false;
  @Input() showCrn = false; //Method to show crn else license and mol
  @Input() isLicenseMandatory = false;
  @Input() disableLicense = false;
  @Input() disableLegalEntity;
  @Input() disableLicenseExpiryDate = false;
  @Input() initialLegalEntity: BilingualText; //to reset the legal entity when crn is reset
  @Input() gosiStartDates: Map<string, Date>;
  @Input() verifiedCrn: MciResponse = undefined;
  @Input() showSaveButton:boolean;

  //Local Variables
  establishmentForm: FormGroup;
  crnDateVerified: boolean;
  currentDate = new Date();
  nextDay = new Date();
  disableCRN = false;
  minLicenseDate: Date;
  crnHide = false; // FIXME : remove this code once the mci scenario in 325260 is completed

  /* Output Variables*/
  @Output() crnVerify: EventEmitter<Object> = new EventEmitter<Object>(null);
  @Output() resetCrn: EventEmitter<number> = new EventEmitter<number>(null);
  @Output() save: EventEmitter<null> = new EventEmitter<null>(null);
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>(null);
  @Output() verifyCrnError: EventEmitter<null> = new EventEmitter<null>(null);

  /* Constants */
  licenseNoMax = EstablishmentConstants.LICENSE_MAX_LENGTH;
  crnMax = EstablishmentConstants.CRN_MAX_LENGTH;
  isBranch: boolean;
  unnMax = EstablishmentConstants.UNIFIED_NATIONAL_NO_LENGTH;

  /**
   * Creates an instance of ProactiveDetailsDcComponent.
   * @param fb
   * @param environment
   */
  constructor() {
    super();
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

  /**
   * This method is to initialise ProactiveDetailsDcComponent
   */
  ngOnInit() {
    scrollToTop();
    this.crnDateVerified = false;
    this.establishmentForm = createEstablishmentForm(this.showCrn);
    markFormGroupTouched(this.establishmentForm);
    this.detectFormChanges();
  }

  /**
   * This method is to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishment && changes.establishment.currentValue && this.establishmentForm) {
      if (this.establishment?.establishmentType?.english === EstablishmentTypeEnum.BRANCH) {
        this.isBranch = true;
      }
      Object.keys(this.establishment).forEach(name => {
        if (this.establishment[name] && this.establishment[name] !== null && name in this.establishmentForm.controls) {
          if (name !== constants.CRN && name !== constants.License) {
            if (name === constants.LegalEntity) {
              this.setLegalEntity();
            } else {
              this.establishmentForm.get(name).patchValue(this.establishment[name]);
              this.establishmentForm.get('unifiedNationalNumber').patchValue(this.establishment?.unifiedNationalNumber);
            }
          } else if (this.establishment[name] && this.establishment[name] !== null) {
            this.setDetails(name);
          }
        }
      });
      this.setLegalEntity();
      this.alterFieldValidations();
      markFormGroupTouched(this.establishmentForm);
    }
    if (changes.legalEntityList && changes.legalEntityList.currentValue) {
      this.setLegalEntity();
    }
    if (changes.verifiedCrn && changes.verifiedCrn.currentValue) {
      this.setCrnDetails(this.verifiedCrn);
      if (this.verifiedCrn.legalEntity) {
        this.establishment.legalEntity = this.verifiedCrn.legalEntity;
      }
      this.setLegalEntity(this.verifiedCrn.legalEntity);
      this.alterFieldValidations();
      markFormGroupTouched(this.establishmentForm);
    }
    if(changes && changes.showSaveButton){
      this.showSaveButton=changes.showSaveButton.currentValue;
    }
  }

  /**
   * This method is to set detect value changes in form
   */
  detectFormChanges() {
    if (this.establishmentForm) {
      this.establishmentForm
        .get(constants.LegalEntity)
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (
            this.establishmentForm.get(constants.LegalEntity).valid &&
            this.establishmentForm.get(constants.LegalEntity).value
          ) {
            this.setMininumLicenseDate(this.establishmentForm.get(constants.LegalEntity));
          }
        });
    }
  }

  /**
   * This method is to set minimum limit for license issue date
   */
  setMininumLicenseDate(formControl: AbstractControl) {
    if (this.gosiStartDates) {
      if (formControl.value.english === LegalEntityEnum.GOVERNMENT) {
        this.minLicenseDate = new Date(this.gosiStartDates.get(SystemParamsEnum.government));
      } else if (formControl.value.english === LegalEntityEnum.SEMI_GOV) {
        this.minLicenseDate = new Date(this.gosiStartDates.get(SystemParamsEnum.semiGovernment));
      } else if (formControl.value.english === LegalEntityEnum.ORG_REGIONAL) {
        this.minLicenseDate = new Date(this.gosiStartDates.get(SystemParamsEnum.orgRegInternational));
      } else {
        this.minLicenseDate = null;
      }
    } else {
      this.minLicenseDate = null;
    }
  }

  /**
   *
   * This method is to set legal entity
   */
  setLegalEntity(estLegalEntity?: BilingualText) {
    const legalEntity = estLegalEntity ? estLegalEntity : this.establishment[constants.LegalEntity];
    if (
      this.establishment[constants.LegalEntity] &&
      this.establishmentForm &&
      this.establishmentForm.get(constants.LegalEntity).get(constants.English).value !== LegalEntityEnum.INDIVIDUAL
    ) {
      this.establishmentForm.get(constants.LegalEntity).get(constants.English).patchValue(legalEntity?.english);
    }
  }

  /**
   * This method is to set establishment details into form
   * @param key
   */
  //TODO Replace strings with constants
  setDetails(key) {
    if (this.establishment[key] && this.establishment[key] !== null) {
      Object.keys(this.establishment[key]).forEach(name => {
        if (this.establishment[key][name] && this.establishment[key][name] !== null) {
          if (name === constants.IssueDate || name === constants.ExpiryDate) {
            if (
              this.establishment[key][name][constants.Gregorian] &&
              this.establishment[key][name][constants.Gregorian] !== null
            ) {
              const date = new Date(this.establishment[key][name][constants.Gregorian]);
              this.establishmentForm.get(key).get(name).get(constants.Gregorian).patchValue(date);
              if (
                this.establishment.crn !== null &&
                this.establishment.crn.issueDate !== null &&
                this.establishment.crn.issueDate.gregorian !== null &&
                key === constants.CRN
              ) {
                this.crnDateVerified = true;
                this.setLegalEntity();
              }
            }
          } else {
            if (this.establishment[key][name] && this.establishmentForm.get(key).get(name)) {
              this.establishmentForm.get(key).get(name).patchValue(this.establishment[key][name]);
            }
          }
        }
      });
    }
  }

  setCrnDetails(mciResponse: MciResponse) {
    this.establishmentForm.get(constants.CRN).get(constants.Number).setValue(mciResponse.crn.number);
    this.establishmentForm
      .get(constants.CRN)
      .get(constants.IssueDate)
      .get(constants.Gregorian)
      .setValue(new Date(mciResponse.crn.issueDate.gregorian));
    this.establishmentForm
      .get(constants.CRN)
      .get(constants.ExpiryDate)
      .get(constants.Gregorian)
      .setValue(new Date(mciResponse.crn.expiryDate.gregorian));
    this.crnDateVerified = true;
  }

  /**
   * This method is used to verify the crn details.
   */
  verifyCRNNumber() {
    this.showReset = true;
    const unnNumber = this.showCrn
      ? this.establishment.unifiedNationalNumber
      : this.establishmentForm.get('unifiedNationalNumber').value;
    this.crnVerify.emit({ crn: this.establishmentForm.get(constants.CRN).get(constants.Number).value, unn: unnNumber });
  }

  /**
   * This method is to reset the crn componentform
   */
  resetCRNDetails() {
    this.crnDateVerified = false;
    if (this.initialLegalEntity?.english) {
      this.establishment.legalEntity = this.initialLegalEntity;
      this.establishmentForm
        .get(constants.LegalEntity)
        .get(constants.English)
        .setValue(this.initialLegalEntity?.english);
    } else {
      this.establishment.legalEntity.english = null;
      this.establishmentForm.get(constants.LegalEntity).get(constants.English).setValue(null);
    }
    this.establishmentForm.get(constants.LegalEntity).get(constants.English).markAsPristine();
    this.establishmentForm.get(constants.LegalEntity).get(constants.English).markAsUntouched();
    this.resetCRN();
  }

  /**
   * This method is to reset crn details
   */
  resetCRN() {
    this.establishment.crn = null;
    this.establishmentForm.get(constants.CRN).reset();
    this.establishmentForm.get(constants.CRN).markAsPristine();
    this.establishmentForm.get(constants.CRN).markAsUntouched();
    this.alterFieldValidations();
    this.resetCrn.emit();
  }

  /**
   * This method is used to reset whole form
   */
  resetCRNForm() {
    this.establishmentForm.reset(createEstablishmentForm(this.showCrn).getRawValue());
    this.establishmentForm.updateValueAndValidity();
    this.establishmentForm.markAsUntouched();
    this.establishmentForm.markAsPristine();
  }

  /**
   * This method is used to save details of this page
   */
  saveCRNDetails() {
    if (this.showCrn) {
      this.checkValueForLicense();
    }
    markFormGroupTouched(this.establishmentForm);
    if (this.establishmentForm.get('crn').get('number').value && !this.crnDateVerified) {
      this.verifyCrnError.emit();
    } else {
      this.save.emit(this.establishmentForm.getRawValue());
    }
  }

  /**
   *This method is to set license to null if all the license fields are not entered
   */
  checkValueForLicense() {
    if (
      this.establishmentForm.get(constants.License).get(constants.Number).value === null ||
      this.establishmentForm.get(constants.License).get(constants.IssuingAuthCode).get(constants.English).value ===
        null ||
      this.establishmentForm.get(constants.License).get(constants.IssueDate).get(constants.Gregorian).value === null
    ) {
      this.establishmentForm.get(constants.License).get(constants.Number).setValue(null);
      this.establishmentForm
        .get(constants.License)
        .get(constants.IssuingAuthCode)
        .get(constants.English)
        .setValue(null);
      this.establishmentForm.get(constants.License).get(constants.IssueDate).get(constants.Gregorian).setValue(null);
      this.establishmentForm.get(constants.License).get(constants.ExpiryDate).get(constants.Gregorian).setValue(null);
    }
  }

  alterFieldValidations() {
    alterCrnFieldsValidation(false, this.establishmentForm);
    alterLicenseValidation(false, this.establishmentForm.get(constants.License));
    if (this.establishmentForm.get(constants.CRN).get(constants.Number).value) {
      alterCrnFieldsValidation(true, this.establishmentForm);
    } else {
      alterLicenseValidation(true, this.establishmentForm.get(constants.License));
    }
    if (
      (this.establishmentForm.get(constants.License).get(constants.Number).value !== null &&
        this.establishmentForm.get(constants.License).get(constants.Number).value !== '') ||
      this.establishmentForm.get(constants.License).get(constants.IssuingAuthCode).get(constants.English).value ||
      this.establishmentForm.get(constants.License).get(constants.IssueDate).get(constants.Gregorian).value !== null
    ) {
      alterLicenseValidation(true, this.establishmentForm.get(constants.License));
      this.establishmentForm.get(constants.License).get(constants.IssueDate).get(constants.Gregorian).markAsUntouched();
      this.establishmentForm.get(constants.License).get(constants.IssueDate).get(constants.Hijiri).markAsUntouched();
    }
  }
}
