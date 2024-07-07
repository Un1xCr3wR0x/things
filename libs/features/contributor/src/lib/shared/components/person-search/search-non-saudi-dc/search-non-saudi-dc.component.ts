/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  borderNoValidator,
  BorderNumber,
  getPersonIdentifier,
  IdentityTypeEnum,
  Iqama,
  iqamaValidator,
  lengthValidator,
  LovList,
  markFormGroupTouched,
  Person,
  convertToYYYYMMDD
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ContributorConstants } from '../../../constants';
import { PersonTypesEnum } from '../../../enums';

@Component({
  selector: 'cnt-search-non-saudi-dc',
  templateUrl: './search-non-saudi-dc.component.html',
  styleUrls: ['./search-non-saudi-dc.component.scss']
})
export class SearchNonSaudiDcComponent implements OnInit {
  /**Variable declaration and initialization */
  searchNonSaudiContributorForm: FormGroup;
  nationalityLovList: LovList = new LovList([]);
  personDetails = new Person();
  currentDate = new Date();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  ROLE = 'contributor';

  /**
   * Input variables
   */
  @Input() nationalityList: Observable<LovList>;

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
    this.searchNonSaudiContributorForm = this.createSearchNonSaudiForm();
    if (this.nationalityList) {
      this.filterNonSaudiNationalityList();
    }
  }

  /**
   * Method to create non saudi search form
   */
  createSearchNonSaudiForm() {
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
      border: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            Validators.minLength(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            borderNoValidator
          ]),
          updateOn: 'blur'
        }
      ],
      birthDate: this.fb.group({
        gregorian: [, { validators: Validators.required }],
        hijiri: [''],
        updateOn: 'blur'
      }),
      nationality: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }

  /**
   * Method to check if either of the identity is optional
   */
  checkOptionalIdentity() {
    const iqama = this.searchNonSaudiContributorForm.get('iqama');
    const border = this.searchNonSaudiContributorForm.get('border');

    if (iqama.value !== null && iqama.value !== '') {
      iqama.setValidators([Validators.required, lengthValidator(this.MAX_LENGTH), iqamaValidator]);
      border.setValidators([lengthValidator(this.MAX_LENGTH), borderNoValidator]);
    } else if (border.value !== null && border.value !== '') {
      border.setValidators([Validators.required, lengthValidator(this.MAX_LENGTH), borderNoValidator]);
      iqama.setValidators([lengthValidator(this.MAX_LENGTH), iqamaValidator]);
    } else {
      iqama.setValidators([Validators.required, lengthValidator(this.MAX_LENGTH), iqamaValidator]);
      border.setValidators([Validators.required, lengthValidator(this.MAX_LENGTH), borderNoValidator]);
    }
    border.updateValueAndValidity();
    iqama.updateValueAndValidity();
  }

  /**
   * Method to filter nationalities
   */
  filterNonSaudiNationalityList() {
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
  verifyNonSaudiDetails() {
    markFormGroupTouched(this.searchNonSaudiContributorForm);
    if (this.searchNonSaudiContributorForm.valid) {
      this.setNonSaudiFormEmitData();
    } else {
      this.error.emit();
    }
  }

  /**
   * Method to set non saudi form value to emit via event emitter to parent
   */
  setNonSaudiFormEmitData() {
    const searchData = this.searchNonSaudiContributorForm.getRawValue();
    this.queryParams = `personType=${PersonTypesEnum.NON_SAUDI}&role=${this.ROLE}&nationality=${searchData.nationality.english}`;
    if (searchData.border !== null) {
      const identity = new BorderNumber();
      this.queryParams += '&borderNo=' + searchData.border;
      identity.idType = IdentityTypeEnum.BORDER;
      identity.id = searchData.border;
      this.personDetails.identity.push(identity);
    }
    if (searchData.iqama !== null) {
      const identity = new Iqama();
      this.queryParams += '&iqamaNo=' + searchData.iqama;
     this.queryParams+= '&birthDate='+convertToYYYYMMDD(searchData.birthDate.gregorian);
      identity.idType = IdentityTypeEnum.IQAMA;
      identity.iqamaNo = searchData.iqama;
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
}
