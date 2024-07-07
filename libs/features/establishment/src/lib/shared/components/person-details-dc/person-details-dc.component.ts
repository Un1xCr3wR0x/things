/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AppConstants,
  BaseComponent,
  dayDifference,
  IdentityTypeEnum,
  Iqama,
  lengthValidator,
  LovList,
  maxDateValidator,
  minDateValidator,
  NationalId
} from '@gosi-ui/core';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { EstablishmentConstants } from '../../constants';
import { PersonDetailsFormModel } from '../../models';

@Component({
  selector: 'est-person-details-dc',
  templateUrl: './person-details-dc.component.html',
  styleUrls: ['./person-details-dc.component.scss']
})
export class PersonDetailsDcComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  //Constants
  minLengthName = EstablishmentConstants.PERSON_NAME_MIN_LENGTH;
  maxLengthArabicName = EstablishmentConstants.PERSON_NAME_ARABIC_MAX_LENGTH;
  maxLengthEnglishName = EstablishmentConstants.PERSON_NAME_ENGLISH_MAX_LENGTH;
  gccIdMaxLength = EstablishmentConstants.DEFAULT_GCCID_LENGTH;

  personForm: FormGroup;
  previousDate = new Date();
  iqamaExists = false;
  gccIdExists = false;
  makeAsReadOnly = false;
  minStartDateForOwner = new Date();

  //Input Variables
  @Input() person: PersonDetailsFormModel = new PersonDetailsFormModel();
  @Input() readOnly: boolean;
  @Input() isSaved: boolean;
  @Input() genderList: LovList;
  @Input() parentForm: FormGroup;
  @Input() enable: boolean;
  @Input() customId = '';
  @Input() idValue = '';
  @Input() hasDateFields = false; // For owner : start date and end date is required in change establishment
  @Input() maxStartDate = new Date();
  @Input() minStartDate: Date;
  @Input() isEndDateMandatory = false;
  @Input() showEndDate = false;
  @Input() showGender = true;
  @Input() isGcc;
  @Input() personDet;
  @Input() personOwnerBirthDate: Date = new Date();
  @Output() dateChangedEvent: EventEmitter<void> = new EventEmitter();
  @Output() dateUnchangedEvent: EventEmitter<void> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {
    super();
    this.previousDate = moment().subtract(1, 'days').toDate();
  }

  ngOnInit(): void {
    this.personOwnerBirthDate = new Date(this.personOwnerBirthDate)
    this.minStartDateForOwner = dayDifference(this.personOwnerBirthDate, this.minStartDate) > 0 
    ? this.minStartDate : this.personOwnerBirthDate;
    this.personForm = this.createPersonForm();
    if (this.hasDateFields === true) {
      this.addStartAndEndDate(this.personForm, this.isEndDateMandatory);
    }
    if (this.parentForm) {
      this.parentForm.addControl('person', this.personForm);
    }
    if (this.person) {
      this.bindPerson();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && (changes.hasDateFields || changes.isEndDateMandatory)) {
      if (this.hasDateFields === true) {
        if (this.personForm) {
          this.addStartAndEndDate(this.personForm, this.isEndDateMandatory);
        }
      }
    }
    if (changes.enable) {
      if (!this.enable) {
        this.makeAsReadOnly = true;
      } else {
        this.makeAsReadOnly = false;
      }
    }
  }

  /**
   * Method to add start date and end date to parent form
   * @param parentForm
   */
  addStartAndEndDate(form: FormGroup, isEndDateMandatory: boolean): void {
    const offsetDate = moment(this.minStartDate);
    const minDate = offsetDate.clone().startOf('day').toDate();
    form.addControl(
      'startDate',
      this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([
              Validators.required,
              maxDateValidator(this.maxStartDate),
              minDateValidator(minDate)
            ]),
            updateOn: 'blur'
          }
        ],
        hijiri: null
      })
    );
    form.addControl(
      'endDate',
      this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([minDateValidator(minDate), maxDateValidator(this.previousDate)]),
            updateOn: 'blur'
          }
        ],
        hijiri: null
      })
    );
    if (isEndDateMandatory) {
      form.get('endDate')?.setValidators([Validators.required]);
    }
    form.updateValueAndValidity();
    form
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkForDateChange('startDate', form);
      });
    form
      .get('endDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkForDateChange('endDate', form);
      });
  }

  /**
   * Check if date has changed in person form model and form
   * @param dateKey
   * @param form
   */
  checkForDateChange(dateKey: string, form) {
    const date = form.get(dateKey)?.get('gregorian')?.value;
    if (!moment(this.person[dateKey]?.gregorian).isSame(date, 'day')) {
      this.dateChangedEvent.emit();
    } else {
      const startDate = form.get('startDate')?.get('gregorian')?.value;
      const endDate = form.get('endDate')?.get('gregorian')?.value;
      if (
        moment(this.person['startDate']?.gregorian).isSame(startDate, 'day') &&
        moment(this.person['endDate']?.gregorian).isSame(endDate, 'day')
      ) {
        if (this.isSaved) {
          this.dateUnchangedEvent.emit();
        }
      }
    }
  }

  /**
   * Method to create form to intialise the form for capturing person details
   */
  createPersonForm(): FormGroup {
    return this.fb.group({
      name: this.fb.group({
        arabic: this.fb.group({
          firstName: [
            null,
            {
              validators: Validators.compose([
                Validators.required,
                Validators.minLength(this.minLengthName),
                Validators.maxLength(this.maxLengthArabicName)
              ]),
              updateOn: 'blur'
            }
          ],
          secondName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.maxLengthArabicName)]),
              updateOn: 'blur'
            }
          ],
          thirdName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.maxLengthArabicName)]),
              updateOn: 'blur'
            }
          ],
          familyName: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.maxLength(this.maxLengthArabicName)]),
              updateOn: 'blur'
            }
          ]
        }),
        english: this.fb.group({
          name: [
            null,
            {
              validators: Validators.compose([
                Validators.minLength(this.minLengthName),
                Validators.maxLength(this.maxLengthEnglishName)
              ]),
              updateOn: 'blur'
            }
          ]
        })
      }),
      sex: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      id: [null, { updateOn: 'blur' }]
    });
  }

  /**
   * Method to bind data to form
   */
  bindPerson() {
    this.personForm.patchValue(this.person);
    this.personForm.updateValueAndValidity();
    if (this.isGcc) this.updateGccIdField();
  }

  /**
   * Method  to get arabic name
   */
  get arabicName(): FormGroup {
    return this.personForm.get('name').get('arabic') as FormGroup;
  }

  /**
   * Method  to get english name
   */
  get englishName(): FormGroup {
    return this.personForm.get('name').get('english').get('name') as FormGroup;
  }

  ngOnDestroy() {
    this.parentForm.removeControl('person');
    this.iqamaExists = false;
    this.gccIdExists = false;
    this.makeAsReadOnly = false;
    super.ngOnDestroy();
  }
  /**
   * This method fetches the corresponding gcc national id length for different nationalities
   */
  getIdMaxLength() {
    if (this.personDet && this.personDet && this.personDet.nationality.english) {
      const nationality = this.personDet.nationality.english;
      if (nationality) {
        Object.keys(AppConstants.NATIONALITY_ID_LENGTH_MAPPING).forEach(key => {
          if (nationality === key) {
            this.gccIdMaxLength = AppConstants.NATIONALITY_ID_LENGTH_MAPPING[key];
          }
        });
      }
      return this.gccIdMaxLength;
    }
  }

  /**
   * This method is used to update the id form control conditionally
   */
  updateGccIdField() {
    if (this.isGcc) {
      if (this.personForm) {
        this.personForm.get('id').setValidators([Validators.required, lengthValidator(this.getIdMaxLength())]);
      }
    } else {
      if (this.personForm) {
        this.personForm.get('id').clearValidators();
      }
    }
    if (this.personDet.identity && this.personForm) {
      this.gccIdExists = false;
      this.iqamaExists = false;
      for (let item of this.personDet.identity) {
        if (!this.gccIdExists) {
          if (item.idType === IdentityTypeEnum.NATIONALID) {
            this.gccIdExists = true;
            item = <NationalId>item;
            this.personForm.controls.id.setValue(item.id);
          } else {
            this.gccIdExists = false;
          }
        }
      }
      if (!this.gccIdExists) {
        this.personForm.controls.id.setValue(null);
      }
      this.personForm.controls.id.updateValueAndValidity();
    }
  }
}
