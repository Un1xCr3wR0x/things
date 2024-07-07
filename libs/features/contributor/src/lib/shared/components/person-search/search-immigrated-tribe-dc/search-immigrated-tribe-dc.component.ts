/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  getPersonIdentifier,
  IdentityTypeEnum,
  Iqama,
  iqamaValidator,
  LovList,
  markFormGroupTouched,
  Person,
  convertToYYYYMMDD
} from '@gosi-ui/core';
import { Nationalities, PersonTypesEnum } from '../../../enums';

@Component({
  selector: 'cnt-search-immigrated-tribe-dc',
  templateUrl: './search-immigrated-tribe-dc.component.html',
  styleUrls: ['./search-immigrated-tribe-dc.component.scss']
})
export class SearchImmigratedTribeDcComponent implements OnInit {
  /**Variable declaration and initialization */
  searchImmigratedContributorForm: FormGroup;
  nationalityLovList: LovList = new LovList([]);
  personDetails = new Person();
  currentDate = new Date();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  ROLE = 'contributor';

  /**
   * Output event emitters
   */

  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    this.searchImmigratedContributorForm = this.createSearchImmigratedForm();
    this.searchImmigratedContributorForm.get('nationality').get('english').setValue(Nationalities.IMMIGRATED_TRIBE);
  }

  /**
   * Method to create immigrated search form
   */
  createSearchImmigratedForm() {
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

      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        updateOn: 'blur'
      }),
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      })
    });
  }

  /**
   * Method to capture search details and send to parent via event emitter
   */
  verifyImmigratedTribeDetails() {
    markFormGroupTouched(this.searchImmigratedContributorForm);
    if (this.searchImmigratedContributorForm.valid) {
      this.setImmigratedTribeFormEmitData();
    } else {
      this.error.emit();
    }
  }

  /**
   * Method to set immigrated tribe form value to emit via event emitter to parent
   */
  setImmigratedTribeFormEmitData() {
    const identity = new Iqama();
    const searchData = this.searchImmigratedContributorForm.getRawValue();
    this.queryParams = `personType=${PersonTypesEnum.IMMIGRATED_TRIBE}&role=${this.ROLE}&iqamaNo=${searchData.iqama}&nationality=${Nationalities.IMMIGRATED_TRIBE}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}`;
    this.personDetails.birthDate = searchData.birthDate;
    this.personDetails.nationality = searchData.nationality;
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
