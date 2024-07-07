/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
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
  startOfDay
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EstablishmentConstants } from '../../constants';
import { createSearchPersonForm } from './search-person-form-dc';

/**
 * This component is used to search for the person in NIC or Service using idetifiers
 * @export
 * @class SearchPersonDcComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'est-search-employee-dc',
  templateUrl: './search-employee-dc.component.html',
  styleUrls: ['./search-employee-dc.component.scss']
})
export class SearchEmployeeDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Constants
  typeNIN = IdentityTypeEnum.NIN;
  typeIQAMA = IdentityTypeEnum.IQAMA;
  typeNATIONALID = IdentityTypeEnum.NATIONALID;
  typePASSPORT = IdentityTypeEnum.PASSPORT;
  ninLength = IdentifierLengthEnum.NIN;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  passportNoMax = IdentifierLengthEnum.PASSPORT;

  //Local Variables
  verifyPersonForm: FormGroup;
  saudiNationality: boolean;
  gccNationality: boolean;
  others: boolean;
  gccCountries: string[];
  currentDate: Date = new Date();
  submitted = false;
  nationalityLovList: LovList = new LovList([]);
  modalRef: BsModalRef;
  isDateRequired = false; //To check is date is missing
  isNationalityRequired = false; //For non saudi owner through mol if nationality is missing.

  /** Input Variables */
  @Input() nationalityList: LovList;
  @Input() label: string;
  @Input() gccEstablishment: boolean;
  @Input() hasPerson = false;
  @Input() person: Person;
  @Input() idValue = '';
  @Input() isResetRequired = true;
  @Input() noPadding = false;

  /** Output Variables */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() formChanged: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() verifyError: EventEmitter<null> = new EventEmitter();
  @Output() formInvalid: EventEmitter<null> = new EventEmitter();
  @Output() keepDraft: EventEmitter<null> = new EventEmitter();

  /**
   * This method is used to initialise the component
   * @param fb
   * @memberof SearchPersonDcComponent
   */
  constructor(private modalService: BsModalService) {
    super();
    this.saudiNationality = true;
    this.gccCountries = EstablishmentConstants.GCC_NATIONAL;
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof AdminDetailsFormDcComponent
   */
  ngOnInit() {
    this.verifyPersonForm = createSearchPersonForm();
    if (this.nationalityList && this.nationalityList.items.length > 0) {
      this.nationalityLovList = new LovList(this.nationalityList.items);
      this.nationalityLovList.items = this.nationalityLovList.items.filter(
        item => item.value.english !== NationalityTypeEnum.MIXED_NATIONAL
      );
    }
    this.setPersonDetailsToForm();
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

    if (changes.hasPerson || changes.person) {
      this.setPersonDetailsToForm();
    }
  }

  setPersonDetailsToForm() {
    if (this.verifyPersonForm && this.person) {
      Object.keys(this.person).forEach(name => {
        if (name in this.verifyPersonForm.controls) {
          if (name === 'nationality') {
            if (!this.person[name]) {
              if (
                this.person.identity.map(item => item.idType).filter(idType => idType === this.typeIQAMA).length > 0
              ) {
                this.isNationalityRequired = true;
                this.nationalityLovList.items = [
                  ...this.nationalityLovList.items.filter(
                    nationality => nationality.value.english !== NationalityTypeEnum.SAUDI_NATIONAL
                  )
                ];
              } else {
                this.isNationalityRequired = false;
                this.nationalityLovList.items = [
                  ...this.nationalityLovList.items.filter(
                    item => item.value.english !== NationalityTypeEnum.MIXED_NATIONAL
                  )
                ];
                this.verifyPersonForm.get('nationality').get('english').patchValue(this.person[name].english);
                this.verifyPersonForm.get('nationality').get('english').updateValueAndValidity();
              }
            } else {
              this.verifyPersonForm.get('nationality').get('english').patchValue(this.person[name].english);
              this.verifyPersonForm.get('nationality').get('english').updateValueAndValidity();
            }
            this.selectIdTypeOnChanges(this.person[name].english);
          } else if (name === 'birthDate') {
            if (
              this.person[name] === undefined
                ? true
                : this.person[name] === null
                ? true
                : this.person[name].gregorian === null || this.person[name].gregorian === undefined
            ) {
              this.isDateRequired = true;
              this.verifyPersonForm.get(name).get('gregorian').setValue(null);
            } else {
              if (this.person[name].gregorian) {
                this.isDateRequired = false;
              } else {
                this.isDateRequired = false;
              }
              this.verifyPersonForm
                .get(name)
                .get('gregorian')
                .setValue(startOfDay(new Date(this.person[name].gregorian)));
            }
          }
          this.verifyPersonForm.get(name).updateValueAndValidity();
        }
      });
      if (this.person.identity.length > 0) {
        this.person.identity.forEach(val => {
          Object.keys(val).forEach(name => {
            if (name !== 'idType') {
              if (name in this.verifyPersonForm.controls) {
                if (val.idType === IdentityTypeEnum.IQAMA) {
                  val = <Iqama>val;
                  this.verifyPersonForm.get('iqamaNo').setValue(val.iqamaNo);
                  this.verifyPersonForm.get('iqamaNo').updateValueAndValidity();
                } else if (val.idType === IdentityTypeEnum.NATIONALID) {
                  val = <NationalId>val;
                  this.verifyPersonForm.get('id').setValue(val.id);
                  this.verifyPersonForm.get('id').updateValueAndValidity();
                } else if (val.idType === IdentityTypeEnum.PASSPORT) {
                  val = <Passport>val;
                  this.verifyPersonForm.get('passportNo').setValue(val.passportNo);
                  this.verifyPersonForm.get('passportNo').updateValueAndValidity();
                } else {
                  val = <NIN>val;
                  this.verifyPersonForm.get('newNin').setValue(val.newNin);
                  this.verifyPersonForm.get('newNin').updateValueAndValidity();
                }
                this.fieldRequired();
              }
            }
          });
        });
      } else {
        this.verifyPersonForm.get('iqamaNo').setValue(null);
        this.verifyPersonForm.get('iqamaNo').updateValueAndValidity();
        this.verifyPersonForm.get('newNin').setValue(null);
        this.verifyPersonForm.get('newNin').updateValueAndValidity();
        this.verifyPersonForm.get('id').setValue(null);
        this.verifyPersonForm.get('id').updateValueAndValidity();
        this.verifyPersonForm.get('passportNo').setValue(null);
        this.verifyPersonForm.get('passportNo').updateValueAndValidity();
      }

      if (this.person.personId && this.verifyPersonForm.valid) {
        this.submitted = true;
      }
      if (!this.person.birthDate || !this.person.birthDate.gregorian) {
        this.submitted = false;
      }
      this.verifyPersonForm.updateValueAndValidity();
    }
  }

  /**
   * This method is used to reset the form to initial template
   */
  resetSearchPersonForm() {
    this.verifyPersonForm.reset(createSearchPersonForm().getRawValue());
    this.verifyPersonForm.updateValueAndValidity();
    this.verifyPersonForm.markAsPristine();
    this.verifyPersonForm.markAsUntouched();
  }

  /**
   * This method is used to verify the data again
   */
  resetVerifiedData() {
    this.submitted = false;
    this.progress.emit();
    markFormGroupUntouched(this.verifyPersonForm);
    this.formChanged.emit();
  }

  /**
   * This method is to show the required identifiers to search the person
     Saudi Nationality: National Identifier Number
     Non Saudi : Iqama Number
     GCC nationality: GCC National ID or Passport Number or Iqama Number
   * @param nationality
   * @memberof SearchPersonDcComponent
   */
  selectIdType(nationality) {
    if (nationality === null) {
      this.verifyPersonForm.get('idType').setValue(null);
      this.verifyPersonForm.get('idType').updateValueAndValidity();
    }

    if (nationality !== this.verifyPersonForm.get('nationality').value) {
      this.verifyPersonForm.get('birthDate').get('gregorian').setValue(null);
      this.selectIdTypeOnChanges(nationality);
      if (this.submitted) {
        this.formChanged.emit();
      }
    }
  }

  /**
   * This method is to select the id type on ng changes
   * @param nationality
   */
  selectIdTypeOnChanges(nationality) {
    const nin = this.verifyPersonForm.get('newNin');
    const iqama = this.verifyPersonForm.get('iqamaNo');
    const id = this.verifyPersonForm.get('id');
    const passportNumber = this.verifyPersonForm.get('passportNo');
    nin.setValue(null);
    iqama.setValue(null);
    passportNumber.setValue(null);
    id.setValue(null);
    this.updateFormControlsValidity();
    markFormGroupUntouched(this.verifyPersonForm);
    this.disableControl(nin);
    this.disableControl(iqama);
    this.disableControl(id);
    this.disableControl(passportNumber);
    this.verifyPersonForm.updateValueAndValidity();
    this.saudiNationality = false;
    this.gccNationality = false;
    this.others = false;

    if (nationality === NationalityTypeEnum.SAUDI_NATIONAL) {
      this.saudiNationality = true;
      this.enableControl(nin);
      this.verifyPersonForm.get('idType').setValue(this.typeNIN);
    } else if (this.gccCountries.indexOf(nationality) !== -1) {
      this.gccNationality = true;
      this.enableControl(id);
      this.enableControl(passportNumber);
      this.enableControl(iqama);
      id.setValidators([Validators.required, lengthValidator(this.getIdMinLength(), this.getIdMaxLength())]);
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
   * This method is used to make the necessary field required and others optional on blur event of the control
   * This functionality should be triggered only for gcc countries
   */
  fieldRequired() {
    const id = this.verifyPersonForm.get('id');
    const iqama = this.verifyPersonForm.get('iqamaNo');
    const passportNumber = this.verifyPersonForm.get('passportNo');
    //Only for gcc coutnries
    if (this.gccCountries.indexOf(this.verifyPersonForm.get('nationality').get('english').value) !== -1) {
      if (id.value !== null && id.value !== '') {
        id.setValidators([Validators.required, lengthValidator(this.getIdMinLength(), this.getIdMaxLength())]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax), Validators.pattern('[a-zA-Z0-9]+$')]);
      } else if (iqama.value !== null && iqama.value !== '') {
        iqama.setValidators([Validators.required, lengthValidator(this.iqamaLength), iqamaValidator]);
        id.setValidators([lengthValidator(this.getIdMinLength(), this.getIdMaxLength())]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax), Validators.pattern('[a-zA-Z0-9]+$')]);
      } else if (passportNumber.value !== null && passportNumber.value !== '') {
        passportNumber.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+$'),
          Validators.maxLength(this.passportNoMax)
        ]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        id.setValidators([lengthValidator(this.getIdMinLength(), this.getIdMaxLength())]);
      } else {
        id.setValidators([Validators.required, lengthValidator(this.getIdMinLength(), this.getIdMaxLength())]);
        iqama.setValidators([lengthValidator(this.iqamaLength), iqamaValidator]);
        passportNumber.setValidators([Validators.maxLength(this.passportNoMax), Validators.pattern('[a-zA-Z0-9]+$')]);
        id.markAsUntouched();
        id.markAsPristine();
        iqama.markAsUntouched();
        iqama.markAsPristine();
        passportNumber.markAsUntouched();
        passportNumber.markAsPristine();
      }
    }
    this.updateFormControlsValidity();
  }

  /**
   * This method fetches the corresponding gcc national id length for different nationalities
   */
  getIdMaxLength() {
    const nationality = this.verifyPersonForm.get('nationality').get('english');
    let maxLength = 15;
    if (nationality && nationality.value) {
      Object.keys(AppConstants.NATIONALITY_ID_LENGTH_MAPPING).forEach(key => {
        if (nationality.value === key) {
          maxLength = AppConstants.NATIONALITY_ID_LENGTH_MAPPING[key];
        }
      });
    }
    return maxLength;
  }
  getIdMinLength() {
    const nationality = this.verifyPersonForm.get('nationality').get('english');
    let minLength = 7;
    if (nationality && nationality.value) {
      Object.keys(AppConstants.NATIONALITY_ID_MIN_LENGTH_MAPPING).forEach(key => {
        if (nationality.value === key) {
          minLength = AppConstants.NATIONALITY_ID_MIN_LENGTH_MAPPING[key];
        }
      });
    }
    return minLength;
  }

  /**
   * This method is used to reflect the validation after the control validitiy is updated
   */
  updateFormControlsValidity() {
    const id = this.verifyPersonForm.get('id');
    const iqama = this.verifyPersonForm.get('iqamaNo');
    const passportNumber = this.verifyPersonForm.get('passportNo');
    id.updateValueAndValidity();
    iqama.updateValueAndValidity();
    passportNumber.updateValueAndValidity();
  }

  /**
   * This method is enables the form control
   * @param formControl
   * @memberof SearchPersonDcComponent
   */
  enableControl(formControl: AbstractControl) {
    if (formControl) formControl.enable();
  }

  /**
   * This method is disables the form control
   * @param formControl
   * @memberof SearchPersonDcComponent
   */
  disableControl(formControl: AbstractControl) {
    if (formControl) formControl.disable();
  }

  /**
   * This method is to submit the admin details for verification
   * @memberof SearchPersonDcComponent
   */
  verifyPerson() {
    this.progress.emit();
    markFormGroupTouched(this.verifyPersonForm);
    this.submit.emit(this.verifyPersonForm.getRawValue());
    if (this.verifyPersonForm.valid) {
      this.submitted = true;
    }
  }
  /**
   * This method is to show a confirmation popup for cancelling the form
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }

  /**
   * This method is to decline popUp the form   *
   */
  decline() {
    this.modalRef.hide();
  }

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  triggerVerifyEvent() {
    markFormGroupTouched(this.verifyPersonForm);
    if (!this.verifyPersonForm.valid) {
      this.formInvalid.emit();
    } else {
      this.verifyError.emit();
    }
  }

    /**
   * This method is to keep transactions in draft
   */
    onKeepDraft() {
      this.modalRef.hide();
      this.keepDraft.emit();
    }
}
