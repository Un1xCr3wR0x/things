/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  GccCountryEnum,
  IdentifierLengthEnum,
  IdentityTypeEnum,
  iqamaValidator,
  lengthValidator,
  LovList,
  NationalityTypeEnum,
  ninValidator,
  Person
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentConstants } from '../../constants';

@Component({
  selector: 'est-search-person-dc',
  templateUrl: './search-person-dc.component.html',
  styleUrls: ['./search-person-dc.component.scss']
})
export class SearchPersonDcComponent implements OnInit, OnChanges {
  searchForm: FormGroup;
  //identifier lengths
  ninLength = IdentifierLengthEnum.NIN;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  passportLength = IdentifierLengthEnum.PASSPORT;

  currentDate = new Date();
  gccIdLength: number;
  gccIdMaxLength: number;
  //Identity types
  ninType = IdentityTypeEnum.NIN;
  iqamaType = IdentityTypeEnum.IQAMA;
  gccType = IdentityTypeEnum.NATIONALID;
  passportType = IdentityTypeEnum.PASSPORT;
  iqamaControl: FormControl;
  gccIdControl: FormControl;
  passportControl: FormControl;

  @Input() parentForm: FormGroup;
  @Input() person: Person;
  @Input() nationalityList$: Observable<LovList>;
  @Input() viewOnly = false;
  @Input() readOnly = false;
  @Input() idValue = '';

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.createSearchPersonForm();
    this.selectIdForm(undefined);
    if (this.parentForm.get('search')) {
      this.parentForm.removeControl('search');
    }
    this.parentForm.addControl('search', this.searchForm);
    this.nationalityList$.pipe(
      map(nationalities =>
        nationalities.items.filter(nationality => nationality.value.english !== NationalityTypeEnum.MIXED_NATIONAL)
      )
    );
    this.bindPerson();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.person && changes.person.currentValue) {
      this.bindPerson();
    }
  }

  /**
   * Method to bind person to form
   */
  bindPerson() {
    if (this.person && this.searchForm) {
      this.selectIdForm(this.person.nationality.english);
      Object.keys(this.searchForm.controls).forEach(key => {
        if (key in this.person && this.person[key]) {
          if (key === 'identity') {
            this.person.identity.forEach(item => {
              const identity = this.identityFormArray.find(id => id.get('idType').value === item.idType);
              if (identity) {
                identity.patchValue(item);
                identity.updateValueAndValidity();
              }
            });
          } else {
            this.searchForm.get(key).patchValue(this.person[key]);
          }
        }
      });
      if (this.person.birthDate && this.person.birthDate.gregorian) {
        this.searchForm.get('birthDate').get('gregorian').setValue(new Date(this.person.birthDate.gregorian));
      }
    }
  }

  /**
   * Method to create the identity form
   * @param nationality
   */
  selectIdForm(nationality: string) {
    if (this.searchForm.get('identity')) {
      this.searchForm.removeControl('identity');
    }
    if (EstablishmentConstants.GCC_NATIONAL.indexOf(nationality) !== -1) {
      this.setGccIdMaxLength(nationality);
      this.searchForm.addControl('identity', this.createGccForm());
      this.iqamaControl = this.idControl(IdentityTypeEnum.IQAMA).get('iqamaNo') as FormControl;
      this.iqamaControl.setValidators([
        Validators.pattern('[0-9]+'),
        lengthValidator(this.iqamaLength),
        iqamaValidator
      ]);
    } else if (nationality !== NationalityTypeEnum.SAUDI_NATIONAL && nationality) {
      this.searchForm.addControl('identity', this.createNonSaudiForm());
      this.iqamaControl = this.idControl(IdentityTypeEnum.IQAMA).get('iqamaNo') as FormControl;
      this.iqamaControl.setValidators([
        Validators.pattern('[0-9]+'),
        lengthValidator(this.iqamaLength),
        Validators.required,
        iqamaValidator
      ]);
    } else {
      this.searchForm.addControl('identity', this.createSaudiForm());
    }
  }

  /**
   * Method to set the gcc max length
   * @param nationality
   */
  setGccIdMaxLength(nationality: string) {
    switch (nationality) {
      case GccCountryEnum.KUWAIT: {
        this.gccIdLength = this.gccIdMaxLength = IdentifierLengthEnum.KUWAIT_ID;
        break;
      }
      case GccCountryEnum.BAHRAIN: {
        this.gccIdLength = this.gccIdMaxLength = IdentifierLengthEnum.BAHRAIN_ID;
        break;
      }
      case GccCountryEnum.UAE: {
        this.gccIdLength = this.gccIdMaxLength = IdentifierLengthEnum.UAE_ID;
        break;
      }
      case GccCountryEnum.OMAN: {
        this.gccIdLength = IdentifierLengthEnum.OMAN_ID_MIN;
        this.gccIdMaxLength = IdentifierLengthEnum.OMAN_ID;

        break;
      }
      case GccCountryEnum.QATAR: {
        this.gccIdLength = this.gccIdMaxLength = IdentifierLengthEnum.QATAR_ID;
        break;
      }
    }
  }

  /**
   * Method to get the id controls corresponding to id type
   * @param idType
   */
  idControl(idType: string): FormGroup {
    return this.identityFormArray.find(formGroup => formGroup.get('idType').value === idType) as FormGroup;
  }

  /**
   * create search person form
   */
  createSearchPersonForm(): FormGroup {
    return this.fb.group({
      nationality: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: null
      })
    });
  }

  /**
   * Method to create gcc form
   */
  createGccForm(): FormArray {
    const array = this.fb.array([]);
    array.push(this.createGccIdForm());
    array.push(this.createIqamaNoFormGroup());
    array.push(this.createPassportFormGroup());
    return array;
  }

  /**
   * Method to create form for non saudi
   */
  createNonSaudiForm(): FormArray {
    const array = this.fb.array([]);
    array.push(this.createIqamaNoFormGroup());

    return array;
  }

  /**
   * Method to create form for saudi
   */
  createSaudiForm(): FormArray {
    const array = this.fb.array([]);
    array.push(
      this.fb.group({
        idType: this.ninType,
        newNin: [
          null,
          {
            validators: Validators.compose([
              Validators.pattern('[0-9]+'),
              Validators.required,
              lengthValidator(this.ninLength),
              ninValidator
            ]),
            updateOn: 'blur'
          }
        ]
      })
    );
    return array;
  }

  /**
   * Create iqama form
   */
  createIqamaNoFormGroup(): FormGroup {
    return this.fb.group({
      idType: this.iqamaType,
      iqamaNo: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.iqamaLength),
            iqamaValidator
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Create passport id form
   */
  createPassportFormGroup(): FormGroup {
    return this.fb.group({
      idType: this.passportType,
      passportNo: [
        null,
        {
          validators: Validators.compose([Validators.pattern('[a-zA-Z0-9]+$')]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Method to crate gcc id form
   */
  createGccIdForm(): FormGroup {
    return this.fb.group({
      idType: this.gccType,
      id: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.gccIdLength, this.gccIdMaxLength)
          ]),
          updateOn: 'blur'
        }
      ]
    });
  }

  get identityFormArray(): FormGroup[] {
    if (this.searchForm.controls.identity) {
      return (this.searchForm.controls.identity as FormArray).controls as FormGroup[];
    } else {
      return [];
    }
  }
}
