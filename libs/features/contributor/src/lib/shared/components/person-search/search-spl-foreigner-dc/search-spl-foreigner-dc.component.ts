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
  LovList,
  markFormGroupTouched,
  Person,convertToYYYYMMDD
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ContributorConstants } from '../../../constants';
import { PersonTypesEnum } from '../../../enums';

@Component({
  selector: 'cnt-search-spl-foreigner-dc',
  templateUrl: './search-spl-foreigner-dc.component.html',
  styleUrls: ['./search-spl-foreigner-dc.component.scss']
})
export class SearchSplForeignerDcComponent implements OnInit {
  /**Variable declaration and initialization */
  searchSplForeignerContributorForm: FormGroup;
  nationalityLovList: LovList = new LovList([]);
  personDetails = new Person();
  currentDate = new Date();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  ROLE = 'contributor';
  isSpecialResident: boolean;

  /**
   * Input variables
   */
  @Input() nationalityList: Observable<LovList>;

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
    this.searchSplForeignerContributorForm = this.createSearchSplForeignerForm();
    if (this.nationalityList) {
      this.filterSplForeignerNationalities();
    }
  }

  /**
   * Method to create immigrated tribe search form
   */
  createSearchSplForeignerForm() {
    return this.fb.group({
      iqama: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            Validators.minLength(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            iqamaValidator
          ]),
          updateOn: 'blur'
        }
      ],
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        updateOn: 'blur'
      })
    });
  }

  /**
   * Method to filter special foreigner nationality
   */
  filterSplForeignerNationalities() {
    this.nationalityList.subscribe(res => {
      this.nationalityLovList = new LovList(res.items);
      this.nationalityLovList.items = this.nationalityLovList.items.filter(
        item => ContributorConstants.NON_SAUDI_EXCLUDED_NATIONALITIES.indexOf(item.value.english) === -1
      );
    });
  }

  /**
   * Method to capture search details and send to parent via event emitter
   */
  verifySplForeignerSearchDetails() {
    markFormGroupTouched(this.searchSplForeignerContributorForm);
    if (this.searchSplForeignerContributorForm.valid) {
      this.setSplForeignerFormEmitData();
    } else {
      this.error.emit();
    }
  }

  /**
   * Method to set special foreigner form value to emit via event emitter to parent
   */
  setSplForeignerFormEmitData() {
    const identity = new Iqama();
    const searchData = this.searchSplForeignerContributorForm.getRawValue();
    if (!this.isSpecialResident)
      this.queryParams = `personType=${PersonTypesEnum.SPECIAL_FOREIGNER}&role=${this.ROLE}&iqamaNo=${searchData.iqama}&nationality=${searchData.nationality.english}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}`;
    else
      this.queryParams = `personType=${PersonTypesEnum.PREMIUM_RESIDENTS}&role=${this.ROLE}&iqamaNo=${searchData.iqama}&nationality=${searchData.nationality.english}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}`;
    this.personDetails.nationality = searchData.nationality;
    this.personDetails.birthDate = searchData.birthDate;
    identity.idType = IdentityTypeEnum.IQAMA;
    identity.iqamaNo = searchData.iqama;
    this.personDetails.identity.push(identity);
    this.personDetails.identity = [...getPersonIdentifier(this.personDetails)];
    this.verify.emit({
      queryParams: this.queryParams,
      personDetails: this.personDetails
    });
  }

  resetForm() {
    this.reset.emit();
  }
}
