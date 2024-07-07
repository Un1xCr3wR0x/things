/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  getPersonIdentifier,
  IdentityTypeEnum,
  Iqama,
  iqamaValidator,
  lengthValidator,
  LovList,
  markFormGroupTouched,
  NationalId,
  Passport,
  Person,
  convertToYYYYMMDD
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { MaxLengthEnum, Nationalities, PersonTypesEnum } from '../../../enums';

@Component({
  selector: 'cnt-search-gcc-dc',
  templateUrl: './search-gcc-dc.component.html',
  styleUrls: ['./search-gcc-dc.component.scss']
})
export class SearchGccDcComponent implements OnInit {
  /**Variable declaration and initialization */
  searchGccContributorForm: FormGroup;
  gccNationalityLovList: LovList = new LovList([]);
  personDetails = new Person();
  currentDate = new Date();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  MAX_LENGTH_ENUM = MaxLengthEnum;
  ROLE = 'contributor';
  minLength = 7;

  /**
   * Input variables
   */
  @Input() gccNationalityList: Observable<LovList>;

  /**
   * Output event emitters
   */

  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    this.searchGccContributorForm = this.createSearchGCCForm();
    if (this.gccNationalityList) {
      this.filterGccNationalities();
    }
  }

  /**
   * Method to create GCC search form
   */
  createSearchGCCForm() {
    return this.fb.group({
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [''],
        updateOn: 'blur'
      }),
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      iqama: [
        null,
        {
          validators: Validators.compose([
            Validators.minLength(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            iqamaValidator
          ]),
          updateOn: 'blur'
        }
      ],
      passport: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[a-zA-Z0-9]+$'),
            Validators.maxLength(this.MAX_LENGTH_ENUM.PASSPORT)
          ]),
          updateOn: 'blur'
        }
      ],
      gccId: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /**
   * Method to filter GCC nationalities
   */
  filterGccNationalities() {
    this.gccNationalityList.subscribe(res => {
      this.gccNationalityLovList = new LovList(res.items);
      this.gccNationalityLovList.items = this.gccNationalityLovList.items.filter(
        item => item.value.english !== Nationalities.MIXED
      );
    });
  }

  /**
   * Method to capture search details and send to parent via event emitter
   */
  verifyGccSearchDetails() {
    markFormGroupTouched(this.searchGccContributorForm);
    if (this.searchGccContributorForm.valid) {
      this.setGccFormEmitData();
    } else {
      this.error.emit();
    }
  }

  /**
   * Method to set gcc form value to emit via event emitter to parent
   */
  setGccFormEmitData() {
    const searchData = this.searchGccContributorForm.getRawValue();
    this.queryParams = `personType=${PersonTypesEnum.GCC}&role=${this.ROLE}&gccId=${searchData.gccId}&nationality=${searchData.nationality.english}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}`;
    this.personDetails.identity = [];
    if (searchData.iqama !== null) {
      const identity = new Iqama();
      this.queryParams += '&iqamaNo=' + searchData.iqama;
      identity.idType = IdentityTypeEnum.IQAMA;
      identity.iqamaNo = searchData.iqama;
      this.personDetails.identity.push(identity);
    }
    if (searchData.passport !== null) {
      const identity = new Passport();
      this.queryParams += '&passportNo=' + searchData.passport;
      identity.idType = IdentityTypeEnum.PASSPORT;
      identity.passportNo = searchData.passport;
      this.personDetails.identity.push(identity);
    }
    if (searchData.gccId !== null) {
      const identity = new NationalId();
      identity.idType = IdentityTypeEnum.NATIONALID;
      identity.id = searchData.gccId;
      this.personDetails.identity.push(identity);
    }
    this.personDetails.birthDate = searchData.birthDate;
    this.personDetails.nationality = searchData.nationality;
    this.personDetails.identity = [...getPersonIdentifier(this.personDetails)];
    this.verify.emit({
      queryParams: this.queryParams,
      personDetails: this.personDetails
    });
  }

  resetForm() {
    this.reset.emit();
  }

  getIdMaxLength() {
    const nationality = this.searchGccContributorForm.get('nationality.english').value;
    if (nationality !== 'Oman') {
      const maxLength = Number(MaxLengthEnum[nationality]);
      this.searchGccContributorForm.get('gccId').reset();
      this.searchGccContributorForm.get('gccId').setValidators([lengthValidator(maxLength), Validators.required]);
    } else {
      const maxLength = Number(MaxLengthEnum[nationality]);
      this.searchGccContributorForm.get('gccId').reset();
      this.searchGccContributorForm
        .get('gccId')
        .setValidators([lengthValidator(this.minLength, maxLength), Validators.required]);
    }
    this.searchGccContributorForm.get('gccId').markAsUntouched();
    this.searchGccContributorForm.get('gccId').updateValueAndValidity();
  }
}
