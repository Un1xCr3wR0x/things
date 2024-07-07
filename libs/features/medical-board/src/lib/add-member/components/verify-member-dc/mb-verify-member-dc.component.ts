/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import {
  AppConstants,
  BaseComponent,
  checkBilingualTextNull,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  Iqama,
  iqamaValidator,
  lengthValidator,
  LovList,
  markFormGroupTouched,
  markFormGroupUntouched,
  NationalId,
  NationalityTypeEnum,
  NIN,
  Passport,
  Person,
  startOfDay,
  scrollToTop,
  AlertService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MbMemberForm } from './mb-verify-member-form-dc';
import { MBConstants } from '../../../shared/constants/mb-constants';
import { Observable } from 'rxjs';

/**
 * This component is used to search for the person in NIC or Service using idetifiers
 * @export
 * @class SearchPersonDcComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'mb-verify-member-dc',
  templateUrl: './mb-verify-member-dc.component.html',
  styleUrls: ['./mb-verify-member-dc.component.scss']
})
export class MbVerifyMemberDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Constants
  typePASSPORT = IdentityTypeEnum.PASSPORT;
  ninLength = IdentifierLengthEnum.NIN;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  passportNoMax = IdentifierLengthEnum.PASSPORT;
  typeNIN = IdentityTypeEnum.NIN;
  typeNATIONALID = IdentityTypeEnum.NATIONALID;
  typeIQAMA = IdentityTypeEnum.IQAMA;

  //Local Variables
  submitted = false;
  nationalityLovList: LovList = new LovList([]);
  gccNationality: boolean;
  modalRef: BsModalRef;
  verifyPersonForm: FormGroup;
  saudiNationality: boolean;
  isDateRequired = false; //To check is date is missing
  isNationalityRequired = false; //For non saudi owner through mol if nationality is missing.
  nationalityList$: Observable<LovList>;
  others: boolean;
  currentDate: Date = new Date();
  gccCountries: string[];

  /** Input Variables */
  @Input() nationalityList: LovList;
  @Input() hasPerson = false;
  @Input() person: Person;
  @Input() idValue = '';

  /** Output Variables */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  /**
   * This method is used to initialise the component
   */
  constructor(readonly alertService: AlertService) {
    super();
    this.saudiNationality = true;
    this.gccCountries = MBConstants.GCC_NATIONAL;
  }

  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    this.verifyPersonForm = MbMemberForm();
    if (this.nationalityList && this.nationalityList.items.length > 0) {
      this.nationalityLovList = new LovList(this.nationalityList.items);
      this.nationalityLovList.items = this.nationalityLovList.items.filter(
        item => item.value.english !== NationalityTypeEnum.MIXED_NATIONAL
      );
    }
  }

  /**
   * This method is to show the required identifiers to search the person
     Saudi Nationality: National Identifier Number
     GCC nationality: GCC National ID or Passport Number or Iqama Number
     Non Saudi : Iqama Number
   * @param nationality
   */
  selectIdType(nationality) {
    if (nationality === null) {
      this.verifyPersonForm.get('idType').setValue(null);
      this.verifyPersonForm.get('idType').updateValueAndValidity();
    }

    if (nationality !== this.verifyPersonForm.get('nationality').value) {
      // this.verifyPersonForm.get('birthDate').get('gregorian').setValue(null);
      this.selectIdTypeOnChanges(nationality);
    }
  }

  /**
   * This method is used to detect and changes to the input and if any changes occur, then only do some operations
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.nationalityList && changes.nationalityList.currentValue) {
      if (this.nationalityList && this.nationalityList.items.length > 0) {
        this.nationalityLovList = new LovList(this.nationalityList.items);
        this.nationalityLovList.items = this.nationalityLovList.items.filter(
          item => item.value.english !== NationalityTypeEnum.MIXED_NATIONAL
        );
      }
    }
  }

  /**
   * This method is used to make the necessary field required and
   * others optional on blur event of the control
   * This functionality should be triggered only for gcc countries
   */
  fieldRequired() {
    const iqama = this.verifyPersonForm.get('iqamaNo');
    const id = this.verifyPersonForm.get('id');
    const passportNumber = this.verifyPersonForm.get('passportNo');
    //Only for gcc coutnries
    if (this.gccCountries.indexOf(this.verifyPersonForm.get('nationality').get('english').value) !== -1) {
      if (id.value !== null && id.value !== '') {
        id.setValidators([Validators.required, lengthValidator(this.getIdMaxLength())]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax), Validators.pattern('[a-zA-Z0-9]+$')]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
      } else if (iqama.value !== null && iqama.value !== '') {
        iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax), Validators.pattern('[a-zA-Z0-9]+$')]);
        id.setValidators([lengthValidator(this.getIdMaxLength())]);
      } else if (passportNumber.value !== null && passportNumber.value !== '') {
        passportNumber.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+$'),
          Validators.maxLength(this.passportNoMax)
        ]);
        id.setValidators([lengthValidator(this.getIdMaxLength())]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
      } else {
        id.setValidators([Validators.required, lengthValidator(this.getIdMaxLength())]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax), Validators.pattern('[a-zA-Z0-9]+$')]);
        id.markAsUntouched();
        id.markAsPristine();
        passportNumber.markAsUntouched();
        passportNumber.markAsPristine();
        iqama.markAsUntouched();
        iqama.markAsPristine();
      }
    }
    this.updateFormControlsValidity();
  }

  /**
   * This method is used to select the id type on changes
   *
   * @param nationality
   */

  selectIdTypeOnChanges(nationality) {
    const nin = this.verifyPersonForm.get('newNin');
    const id = this.verifyPersonForm.get('id');
    const iqama = this.verifyPersonForm.get('iqamaNo');
    const passportNumber = this.verifyPersonForm.get('passportNo');
    nin.setValue(null);
    iqama.setValue(null);
    id.setValue(null);
    passportNumber.setValue(null);
    this.updateFormControlsValidity();
    markFormGroupUntouched(this.verifyPersonForm);
    this.disableControl(nin);
    this.disableControl(id);
    this.disableControl(iqama);
    this.disableControl(passportNumber);
    this.verifyPersonForm.updateValueAndValidity();
    this.gccNationality = false;
    this.saudiNationality = false;
    this.others = false;
    if (nationality === NationalityTypeEnum.SAUDI_NATIONAL) {
      this.saudiNationality = true;
      this.enableControl(nin);
      this.verifyPersonForm.get('idType').setValue(this.typeNIN);
    } else if (this.gccCountries.indexOf(nationality) !== -1) {
      this.gccNationality = true;
      this.enableControl(id);
      this.enableControl(iqama);
      this.enableControl(passportNumber);
      id.setValidators([Validators.required, lengthValidator(this.getIdMaxLength())]);
      iqama.clearValidators();
      this.verifyPersonForm.get('idType').setValue(this.typeNATIONALID);
    } else {
      this.others = true;
      this.enableControl(iqama);
      iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
      this.verifyPersonForm.get('idType').setValue(this.typeIQAMA);
    }
    this.updateFormControlsValidity();
  }

  /**
   * This method is used to reflect the validation after the control validitiy is updated
   */
  updateFormControlsValidity() {
    const id = this.verifyPersonForm.get('id');
    const passportNumber = this.verifyPersonForm.get('passportNo');
    const iqama = this.verifyPersonForm.get('iqamaNo');
    id.updateValueAndValidity();
    passportNumber.updateValueAndValidity();
    iqama.updateValueAndValidity();
  }
  /**
   * This method fetches the corresponding gcc national id length for different nationalities
   */
  getIdMaxLength() {
    let maxLength = 15;
    const nationality = this.verifyPersonForm.get('nationality').get('english');
    if (nationality && nationality.value) {
      Object.keys(AppConstants.NATIONALITY_ID_LENGTH_MAPPING).forEach(key => {
        if (nationality.value === key) {
          maxLength = AppConstants.NATIONALITY_ID_LENGTH_MAPPING[key];
        }
      });
    }
    return maxLength;
  }
  /**
   * This method is disables the form control
   * @param formControl
   */
  disableControl(formControl: AbstractControl) {
    if (formControl) formControl.disable();
  }

  /**
   * This method is enables the form control
   * @param formControl
   */
  enableControl(formControl: AbstractControl) {
    if (formControl) formControl.enable();
  }

  verifyMember() {
    scrollToTop();
    this.alertService.clearAlerts();
    markFormGroupTouched(this.verifyPersonForm);
    if (this.verifyPersonForm.valid) {
      this.submit.emit(this.verifyPersonForm.getRawValue());
    } else {
      this.invalidForm.emit();
    }
  }
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
