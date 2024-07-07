import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AppConstants,
  borderNoValidator,
  hijiriToJSON,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  iqamaValidator,
  lengthValidator,
  LovList,
  ninValidator, startOfDay
} from '@gosi-ui/core';
import { PersonalInformation } from '@gosi-ui/features/contributor';
import moment from 'moment';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PersonDetailsSmartForm {
  fb: FormBuilder;
  form: FormGroup;
  age: number;
  minorTypeList?;
  maxIDLength = IdentifierLengthEnum.NIN;
  showName = true;

  idValidators = {
    [IdentityTypeEnum.NIN]: Validators.compose([
      lengthValidator(IdentifierLengthEnum.NIN),
      Validators.maxLength(IdentifierLengthEnum.NIN),
      Validators.pattern('[0-9]+'),
      ninValidator
    ]),
    [IdentityTypeEnum.IQAMA]: Validators.compose([
      lengthValidator(IdentifierLengthEnum.IQAMA),
      Validators.maxLength(IdentifierLengthEnum.IQAMA),
      Validators.pattern('[0-9]+'),
      iqamaValidator
    ]),
    [IdentityTypeEnum.BORDER]: Validators.compose([
      lengthValidator(IdentifierLengthEnum.BORDER_ID),
      Validators.maxLength(IdentifierLengthEnum.BORDER_ID),
      Validators.pattern('[0-9]+'),
      borderNoValidator
    ]),
    [IdentityTypeEnum.NATIONALID]: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
    [IdentityTypeEnum.PASSPORT]: Validators.compose([
      Validators.pattern('[a-zA-Z0-9]+$'),
      Validators.maxLength(IdentifierLengthEnum.PASSPORT)
    ])
  };

  constructor(fb: FormBuilder) {
    this.fb = fb;
    this.form = fb.group({
      nationality: fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      id: fb.control(null, [Validators.required]),
      idType: fb.control(''),
      idTypeList: fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      birthDate: fb.group({
        calendarType: fb.group({
          english: ['GREGORIAN', { validators: Validators.required }],
          arabic: [null],
          updateOn: 'blur'
        }),
        gregorian: fb.control(null, [Validators.required])
      })
    });
  }

  removeControl(ctrl: string) {
    this.form.removeControl(ctrl);
  }

  addRelationshipToMinors() {
    this.form.addControl(
      'relationshipToMinors',
      this.fb.group({
        english: ['Father/Mother', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    );
  }

  removeRelationshipToMinors() {
    this.removeControl('relationshipToMinors');
  }

  addPersonNameFields() {
    this.form.addControl(
      'name',
      this.fb.group({
        arabic: this.fb.group(
          {
            firstName: [
              '',
              {
                validators: [Validators.required, Validators.minLength(2), Validators.pattern('^([ء-ي]+[\\s]?)+$')]
              }
            ],
            secondName: ['', { validators: [Validators.pattern('^([ء-ي]+[\\s]?)+$')] }],
            thirdName: ['', { validators: [Validators.pattern('^([ء-ي]+[\\s]?)+$')] }],
            familyName: [
              '',
              {
                validators: [Validators.required, Validators.minLength(2), Validators.pattern('^([ء-ي]+[\\s]?)+$')]
              }
            ]
          },
          { updateOn: 'blur' }
        ),
        english: this.fb.group({
          name: [
            null,
            {
              validators: [Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')],
              updateOn: 'blur'
            }
          ]
        })
      })
    );
    this.form.addControl(
      'gender',
      this.fb.group(
        {
          english: ['Male', { validators: Validators.required }],
          arabic: [null]
        },
        { updateOn: 'blur' }
      )
    );
  }

  makeEnglishNameMandatory() {
    this.name
      .get('english.name')
      .setValidators([Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$'), Validators.required]);
    this.name.get('english.name').updateValueAndValidity();
  }

  removePersonNameFields() {
    this.removeControl('name');
    this.removeControl('gender');
  }

  addMinorType() {
    this.form.addControl(
      'minorType',
      this.fb.group({
        english: ['Age Minor', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    );
    this.updateMinorTypeList();
  }

  updateMinorTypeList() {
    if (this.age > 17) {
      this.minorTypeList = new LovList([{ value: { english: 'Mentally Minor', arabic: 'قاصر عقلًا' }, sequence: 1 }]);
      this.minorType?.get('english')?.setValue('Mentally Minor');
    } else {
      this.minorTypeList = new LovList([
        { value: { english: 'Age Minor', arabic: 'قاصر سنّا' }, sequence: 1 },
        { value: { english: 'Mentally Minor', arabic: 'قاصر عقلًا' }, sequence: 2 }
      ]);
    }
  }

  get id() {
    return this.form.get('id');
  }
  get idType() {
    return this.form.get('idType');
  }
  get idTypeList() {
    return this.form.get('idTypeList');
  }
  get nationality() {
    return this.form.get('nationality');
  }
  get birthDate() {
    return this.form.get('birthDate');
  }
  get relationshipToMinors() {
    return this.form.get('relationshipToMinors');
  }
  get name() {
    return this.form.get('name');
  }
  get gender() {
    return this.form.get('gender');
  }
  get minorType() {
    return this.form.get('minorType');
  }
  get isSaudi(): boolean {
    return this.idType.value === IdentityTypeEnum.NIN;
  }
  get isGcc(): boolean {
    return this.idType.value === IdentityTypeEnum.NATIONALID;
  }
  get isIqama(): boolean {
    return this.idType.value === IdentityTypeEnum.IQAMA;
  }
  get isBorderNumber(): boolean {
    return this.idType.value === IdentityTypeEnum.BORDER;
  }
  get isPassport(): boolean {
    return this.idType.value === IdentityTypeEnum.PASSPORT;
  }
  get isParent(): boolean {
    return this.relationshipToMinors.get('english').value === 'Father/Mother';
  }
  get isGregorianBirthDate(): boolean {
    return this.birthDate.get('gregorian') ? true : false;
  }
  get isHijriBirthDate(): boolean {
    return this.birthDate.get('hijiri') ? true : false;
  }
  get arabicFullName(): string {
    return [
      this.form.get('name.arabic.firstName')?.value,
      this.form.get('name.arabic.secondName')?.value,
      this.form.get('name.arabic.thirdName')?.value,
      this.form.get('name.arabic.familyName')?.value
    ]
      .filter(Boolean)
      .join(' ');
  }

  selectIdType(id: string) {
    this.idType.setValue(id);
    const validators = [Validators.required];
    const nationality = this.nationality.get('english').value;
    const idLength = AppConstants.NATIONALITY_ID_LENGTH_MAPPING[nationality];
    if (idLength && id === IdentityTypeEnum.NATIONALID) {
      validators.push(lengthValidator(idLength, idLength));
      this.maxIDLength = idLength;
    }
    //we specific only passport and gccid and the rest ids has same length nin, iqama, border
    if (id === IdentityTypeEnum.PASSPORT) {
      this.maxIDLength = IdentifierLengthEnum.PASSPORT;
    }
    if (id) validators.push(this.idValidators[id]);
    this.form.setControl('id', this.fb.control(null, validators));
    this.id.setErrors(null);
  }

  selectMinorType(type: string) {
    this.minorType.get('english').setValue(type);
  }

  resetIdFields() {
    this.idTypeList.reset();
    this.id.reset();
  }

  getAuthorizationPerson() {
    const birthDate = {
      gregorian: this.isGregorianBirthDate ? startOfDay(this.birthDate.get('gregorian').value) : null,
      hijiri: this.isHijriBirthDate ? hijiriToJSON(this.birthDate.get('hijiri').value) : null
    };
    let id;
    if (this.isSaudi) id = { newNin: this.id.value };
    if (this.isIqama) id = { iqamaNo: this.id.value };
    if (this.isGcc) id = { id: this.id.value };
    if (this.isPassport) id = { passportNo: this.id.value };
    if (this.isBorderNumber) id = { id: this.id.value };

    let person;

    person = {
      birthDate,
      identity: [
        {
          idType: this.idType.value,
          ...id
        }
      ],
      nationality: { ...this.nationality.value }
    };
    if (this.name) person.name = this.name.value;
    if (this.gender) person.sex = this.gender.value;

    return person;
  }

  fillPersonDetails(person: PersonalInformation) {
    this.addPersonNameFields();
    this.name.patchValue(person.name);
    this.gender.patchValue(person.sex);
    this.nationality.patchValue(person.nationality);
    this.birthDate.patchValue({
      gregorian: moment(person.birthDate?.gregorian).toDate(),
      ...person.birthDate,
      hijiri: person.birthDate.hijiri?.split('-').reverse().join('/')
    });
    this.age = this.isGregorianBirthDate
      ? moment().diff(moment(this.birthDate.get('gregorian').value), 'years')
      : person.ageInHijiri;
  }

  fillAuthorizerDetails(person) {
    this.addPersonNameFields();
    const [firstName, ...familyName] = person.fullName.split(' ').filter(Boolean);
    this.form.patchValue({
      name: {
        arabic: {
          firstName,
          familyName: familyName.join(' ')
        }
      },
      nationality: {
        ...person.nationality
      },
      gender: {
        ...person.sex
      },
      birthDate: {
        gregorian: moment(person.dateOfBirth.gregorian).toDate(),
        hijiri: person.dateOfBirth.hijiri.split('-').reverse().join('/')
      },
      id: person.id,
      idType: person.idType
    });
    this.age = moment().diff(moment(this.birthDate.get('gregorian').value), 'years');
    if (person.minorType === 0 || person.minorType === 1) {
      this.addMinorType();
      this.minorType.get('english').setValue(person.minorType === 0 ? 'Age Minor' : 'Mentally Minor');
    }
  }

  isSamePerson(personForm: PersonDetailsSmartForm) {
    return (
      this.id.value === personForm.id.value &&
      this.idType.value === personForm.idType.value &&
      this.nationality.get('english').value === personForm.nationality.get('english').value
    );
  }
}
