/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  convertToYYYYMMDD,
  hijiriToJSON,
  IdentityTypeEnum,
  lengthValidator,
  LovList,
  markFormGroupTouched,
  NationalityTypeEnum,
  NIN,
  ninValidator,
  Person
} from '@gosi-ui/core';
import { ContributorTypesEnum } from '../../../enums';

@Component({
  selector: 'cnt-search-saudi-dc',
  templateUrl: './search-saudi-dc.component.html',
  styleUrls: ['./search-saudi-dc.component.scss']
})
export class SearchSaudiDcComponent implements OnInit {
  /**Variable declaration and initialization */
  searchSaudiContributorForm: FormGroup;
  currentDate = new Date();
  personDetails = new Person();
  queryParams = '';
  MIN_LENGTH = 10;
  MAX_LENGTH = 10;
  calenderList: LovList;

  /** Input variables. */
  @Input() personType: string;
  @Input() role = 'contributor';
  @Input() parentForm: FormGroup; //For Add vic

  /** Output event emitters. */
  @Output() verify: EventEmitter<Object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {}
  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    const item = [
      {
        value: { english: 'Gregorian', arabic: 'ميلادي' },
        sequence: 1
      },
      {
        value: { english: 'Hijiri', arabic: 'هجري' },
        sequence: 2
      }
    ];
    this.calenderList = new LovList(item);
    this.searchSaudiContributorForm = this.createSearchSaudiForm();
    if (this.parentForm) this.parentForm.addControl('saudiSearch', this.searchSaudiContributorForm);
    this.detectFormChange();
  }
  /**
   * Method to detect change in calender type (hijiri or gregorian) and set the form validation accordingly
   */
  detectFormChange() {
    if (this.searchSaudiContributorForm) {
      this.searchSaudiContributorForm.get('calenderType.english').valueChanges.subscribe(calender => {
        if (calender === 'Gregorian') {
          this.searchSaudiContributorForm.get('birthDate.gregorian').setValidators([Validators.required]);
          this.searchSaudiContributorForm.get('birthDate.hijiri').reset();
          this.searchSaudiContributorForm.get('birthDate.hijiri').clearValidators();
        } else {
          this.searchSaudiContributorForm.get('birthDate.hijiri').setValidators([Validators.required]);
          this.searchSaudiContributorForm.get('birthDate.gregorian').reset();
          this.searchSaudiContributorForm.get('birthDate.gregorian').clearValidators();
        }
        this.searchSaudiContributorForm.updateValueAndValidity();
      });
    }
  }
  /**
   * Method to create saudi search form
   */
  createSearchSaudiForm() {
    return this.fb.group({
      nin: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            lengthValidator(this.MIN_LENGTH),
            Validators.maxLength(this.MAX_LENGTH),
            Validators.pattern('[0-9]+'),
            ninValidator
          ]),
          updateOn: 'blur'
        }
      ],
      calenderType: this.fb.group({
        english: ['Gregorian', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      }),
      birthDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        updateOn: 'blur'
      })
    });
  }

  /**
   * Method to capture search details and send to parent via event emitter
   */
  verifyContributorDetails() {
    markFormGroupTouched(this.searchSaudiContributorForm);
    if (this.searchSaudiContributorForm.valid) {
      this.setSaudiFormEmitData();
    } else {
      this.error.emit();
    }
  }
  /**
   * Method to set saudi form value to emit via event emitter to parent
   */
  setSaudiFormEmitData() {
    const identity = new NIN();
    const searchData = this.searchSaudiContributorForm.getRawValue();
    this.queryParams = searchData.birthDate.gregorian
      ? `NIN=${searchData.nin}&birthDate=${convertToYYYYMMDD(searchData.birthDate.gregorian)}&role=${this.role}`
      : `NIN=${searchData.nin}&birthDateH=${hijiriToJSON(searchData.birthDate.hijiri)}&role=${this.role}`;
    if (this.personType === ContributorTypesEnum.SECONDED) this.queryParams += `&personType=Seconded`;
    this.personDetails.birthDate = searchData.birthDate;
    this.personDetails.nationality.english = NationalityTypeEnum.SAUDI_NATIONAL;
    identity.idType = IdentityTypeEnum.NIN;
    identity.newNin = searchData.nin;
    this.personDetails.identity = [identity];
    this.verify.emit({
      queryParams: this.queryParams,
      personDetails: this.personDetails
    });
  }
  resetForm() {
    this.reset.emit();
  }
}
