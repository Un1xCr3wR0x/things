/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  borderNoValidator,
  BorderNumber,
  IdentityTypeEnum,
  Iqama,
  iqamaValidator,
  LovList,
  NationalId,
  NIN,
  Passport,
  Person,
  getIdentityValue,
  subtractDays
} from '@gosi-ui/core';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { Observable } from 'rxjs';
import { MaxLengthEnum, YesOrNo } from '../../../shared';
import * as moment from 'moment-timezone';

@Directive()
export class PersonDetailsBaseDc {
  /* Local variables */
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  engMaxLength = MaxLengthEnum.NAME_ENGLISH;
  arbMaxLength = MaxLengthEnum.NAME_ARABIC;
  borderMaxLength = MaxLengthEnum.BORDER;
  passportMaxLength = MaxLengthEnum.PASSPORT;
  iqamaMaxLength = MaxLengthEnum.IQAMA;
  contactDetailParentForm = new FormGroup({});
  contributorDetails = new Person();
  isMobileDefault = true;
  minExpiryDate = moment().add(1, 'day').toDate();
  maxIssueDate = subtractDays(new Date(), 1);
  currentDate: Date = new Date();
  disablePassport = false;
  disableIqama = false;
  disableBorder = false;
  enableAddress = false;

  /** Template and directive references */
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  @ViewChild('contactDetails', { static: false })
  contactDetailsComponent: ContactDcComponent;

  /** Input variables */
  @Input() educationList: Observable<LovList>;
  @Input() specializationList: Observable<LovList>;
  @Input() nationalityList: Observable<LovList>;
  @Input() cityList: Observable<LovList>;
  @Input() genderList: Observable<LovList>;
  @Input() maritalStatusList: Observable<LovList>;
  @Input() personDetails: Person;
  @Input() parentForm: FormGroup;
  @Input() isEditMode: boolean;
  @Input() countryList: Observable<LovList>;

  /** Output variables */
  @Output() contributorSave: EventEmitter<Person> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   * Creates an instance of PersonDetailsBaseDc
   * @param fb form builder
   */
  constructor(readonly fb: FormBuilder) {}

  /** Method to create person details form. */
  createPersonDetailsForm(isSaudi: boolean) {
    return this.fb.group({
      name: this.fb.group({
        arabic: this.fb.group({
          firstName: [
            null,
            {
              validators: [Validators.required, Validators.minLength(2)],
              updateOn: 'blur'
            }
          ],
          secondName: [null, { updateOn: 'blur' }],
          thirdName: [null, { updateOn: 'blur' }],
          familyName: [
            null,
            {
              validators: Validators.required,
              updateOn: 'blur'
            }
          ]
        }),
        english: this.fb.group({
          name: [
            null,
            {
              validators: [Validators.minLength(2)],
              updateOn: 'blur'
            }
          ]
        })
      }),
      identity: isSaudi
        ? this.fb.group({
            idType: [''],
            newNin: ['']
          })
        : this.fb.array([]),
      nationality: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      birthDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      }),
      maritalStatus: isSaudi
        ? this.fb.group({
            english: [null],
            arabic: [null]
          })
        : this.fb.group({
            english: [null, { validators: Validators.required }],
            arabic: [null]
          }),
      sex: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      education: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      specialization: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      student: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      prisoner: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
  }

  /** Method to create passport form. */
  getPassportForm() {
    return this.fb.group({
      idType: [IdentityTypeEnum.PASSPORT],
      passportNo: [
        '',
        {
          validators: Validators.compose([
            Validators.pattern('[a-zA-Z0-9]+$'),
            Validators.maxLength(this.passportMaxLength)
          ]),
          updateOn: 'blur'
        }
      ],
      issueDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      expiryDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      })
    });
  }

  /** Method to create Iqama form. */
  getIqamaForm(isRequired = false) {
    return this.fb.group({
      idType: [IdentityTypeEnum.IQAMA],
      iqamaNo: [
        '',
        {
          validators: Validators.compose([
            Validators.minLength(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            iqamaValidator,
            isRequired ? Validators.required : null
          ])
        }
      ],
      expiryDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      })
    });
  }

  /** Method to create National ID form. */
  getNationalIDForm() {
    return this.fb.group({
      idType: [IdentityTypeEnum.NATIONALID],
      id: ['', Validators.required]
    });
  }

  /** Method to create Border form.  */
  getBorderForm(isRequired = false) {
    return this.fb.group({
      idType: [IdentityTypeEnum.BORDER],
      id: [
        '',
        {
          validators: Validators.compose([
            Validators.minLength(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            borderNoValidator,
            isRequired ? Validators.required : null
          ])
        }
      ]
    });
  }

  /**
   * Method to bind data to form if value exists
   * @param formGroup form group
   * @param data person details
   */
  bindDataToForm(formGroup: FormGroup, data: Person) {
    Object.keys(data).forEach(name => {
      if (formGroup.get(name) && data[name]) {
        if (name !== 'identity') {
          if (name === 'birthDate') {
            formGroup.get(name).get('gregorian').patchValue(new Date(data[name]['gregorian']));
          } else if (name === 'student' || name === 'prisoner') {
            if (data[name]) formGroup.get(name).get('english').patchValue(YesOrNo.YES);
          } else {
            formGroup.get(name).patchValue(data[name]);
          }
        }
      }
    });
    formGroup.updateValueAndValidity();
    formGroup.markAsPristine();
  }

  /**
   * Method to bind identity data to form if value exists
   * @param formGroup form group
   * @param data identity type data
   */
  bindIdentityDataToForm(formGroup: FormGroup, data: NIN | Iqama | NationalId | Passport | BorderNumber) {
    Object.keys(data).forEach(name => {
      if (formGroup.get(name) && data[name]) {
        if (name === 'issueDate' || name === 'expiryDate') {
          if (data[name]['gregorian']) {
            formGroup.get(name).get('gregorian').patchValue(new Date(data[name]['gregorian']));
          }
        } else {
          formGroup.get(name).patchValue(data[name]);
        }
      }
    });
    formGroup.updateValueAndValidity();
    formGroup.markAsPristine();
  }

  /**Method to check values are present on page load */
  checkForValues(): void {
    this.disablePassport = (<Passport>getIdentityValue(this.personDetails.identity, IdentityTypeEnum.PASSPORT))
      ?.passportNo
      ? true
      : false;
    this.disableIqama = (<Iqama>getIdentityValue(this.personDetails.identity, IdentityTypeEnum.IQAMA))?.iqamaNo
      ? true
      : false;
    this.disableBorder = (<BorderNumber>getIdentityValue(this.personDetails.identity, IdentityTypeEnum.BORDER))?.id
      ? true
      : false;
  }
}
