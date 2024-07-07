/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageToken, LovList, addDays, startOfDay } from '@gosi-ui/core';
import { filter } from 'rxjs/operators';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { Establishment, SecondedDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-seconded-details-dc',
  templateUrl: './seconded-details-dc.component.html',
  styleUrls: ['./seconded-details-dc.component.scss']
})
export class SecondedDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  secondedDetailsFrom: FormGroup;
  lang = 'en';
  isEnglishNameNull = false;
  minEndDate: Date;
  minContractDate: Date;

  /** Input variables. */
  @Input() establishment: Establishment;
  @Input() parentForm: FormGroup;
  @Input() govtEstablishmentList: LovList;
  @Input() secondedDetails: SecondedDetails;
  @Input() isEditMode: boolean;

  /** Creates an instance of SecondedDetailsDcComponent. */
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to initalize the component. */
  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
  }

  /** Method to identify the changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishment && changes.establishment.currentValue) {
      if (!this.isEditMode) {
        this.secondedDetailsFrom = this.createSecondedForm();
        this.detectChanges();
        this.initializeSecondedForm();
      }
    }

    if (changes.secondedDetails && changes.secondedDetails.currentValue) {
      if (this.isEditMode) {
        this.secondedDetailsFrom = this.createSecondedForm();
        this.detectChanges();
        this.initializeSecondedForm();
      }
    }

    if ((!changes.establishment && this.establishment) || (!changes.secondedDetails && this.secondedDetails))
      this.initializeSecondedForm();
  }

  /** Method to create seconded form. */
  createSecondedForm() {
    return this.fb.group({
      secondedToEstablishment: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      secondedRegistrationNo: [null, { validators: Validators.required }],
      currentEstablishment: this.fb.group({ english: [null, { validators: Validators.required }], arabic: null }),
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: null
      }),
      endDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: null
      }),
      contractDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: null
      }),
      salary: [null, { validators: Validators.required }]
    });
  }

  /** Method to initialize seconded form. */
  initializeSecondedForm() {
    if (!this.establishment.name.english) {
      this.isEnglishNameNull = true;
      this.secondedDetailsFrom.get('secondedToEstablishment.english').clearValidators();
      this.secondedDetailsFrom.get('secondedToEstablishment.english').updateValueAndValidity();
    }
    this.secondedDetailsFrom.get('secondedToEstablishment').setValue(this.establishment.name);
    this.secondedDetailsFrom.get('secondedRegistrationNo').setValue(this.establishment.registrationNo);
    if (this.isEditMode) this.setSecondedDetails();
    this.setDateValidation();
    if (this.parentForm.get('secondedForm')) this.parentForm.removeControl('secondedForm');
    this.parentForm.addControl('secondedForm', this.secondedDetailsFrom);
  }

  /** Method to set seconded details. */
  setSecondedDetails() {
    this.secondedDetailsFrom.get('currentEstablishment').setValue(this.secondedDetails.currentEstablishment);
    this.secondedDetailsFrom
      .get('startDate.gregorian')
      .setValue(moment(this.secondedDetails.startDate.gregorian).toDate());
    this.secondedDetailsFrom.get('endDate.gregorian').setValue(moment(this.secondedDetails.endDate.gregorian).toDate());
    this.secondedDetailsFrom
      .get('contractDate.gregorian')
      .setValue(moment(this.secondedDetails.contractDate.gregorian).toDate());
    this.secondedDetailsFrom.get('salary').setValue(this.secondedDetails.salary);
  }

  /** Method to set date validation. */
  setDateValidation(): void {
    const endDate = this.secondedDetailsFrom.get('endDate.gregorian').value;
    const contractDate = this.secondedDetailsFrom.get('contractDate.gregorian').value;
    this.minEndDate = moment(
      moment(endDate).isAfter(this.secondedDetailsFrom.get('startDate.gregorian').value, 'day')
        ? addDays(this.secondedDetailsFrom.get('startDate.gregorian').value, 1)
        : this.secondedDetailsFrom.get('startDate.gregorian').value
    ).toDate();
    this.minContractDate = moment(
      moment(contractDate).isSameOrAfter(this.secondedDetailsFrom.get('startDate.gregorian').value, 'day')
        ? startOfDay(this.secondedDetailsFrom.get('startDate.gregorian').value)
        : this.secondedDetailsFrom.get('startDate.gregorian').value
    ).toDate();
  }

  detectChanges(): void {
    this.secondedDetailsFrom
      .get('endDate.gregorian')
      .valueChanges.pipe(filter(endDate => endDate !== null))
      .subscribe(endDate => this.setMinEndDate(endDate));
    this.secondedDetailsFrom
      .get('contractDate.gregorian')
      .valueChanges.pipe(filter(contractDate => contractDate !== null))
      .subscribe(contractDate => this.setMinContractDate(contractDate));
  }

  setMinEndDate(endDate: Date): void {
    if (moment(endDate).isAfter(this.secondedDetailsFrom.get('startDate.gregorian').value, 'day'))
      this.minEndDate = moment(this.secondedDetailsFrom.get('startDate.gregorian').value).add(1, 'days').toDate();
  }
  setMinContractDate(contractDate: Date): void {
    if (moment(contractDate).isSameOrAfter(this.secondedDetailsFrom.get('startDate.gregorian').value, 'day'))
      this.minContractDate = startOfDay(this.secondedDetailsFrom.get('startDate.gregorian').value);
  }
}
