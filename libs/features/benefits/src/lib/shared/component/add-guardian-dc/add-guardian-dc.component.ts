/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  LovList,
  GosiCalendar,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  Lov,
  BilingualText,
  getPersonEnglishName,
  getPersonArabicName
} from '@gosi-ui/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SearchPerson, PersonalInformation, DependentDetails, AttorneyDetailsWrapper } from '../../models';
import * as moment from 'moment';
import { BenefitValues } from '../../enum/benefit-values';
import { PersonBankDetails } from '@gosi-ui/features/contributor/lib/shared/models';

@Component({
  selector: 'bnt-add-guardian-dc',
  templateUrl: './add-guardian-dc.component.html',
  styleUrls: ['./add-guardian-dc.component.scss']
})
export class AddGuardianDcComponent implements OnInit, OnChanges, OnDestroy {
  guardianDetialsForm: FormGroup;
  showListOfGuardians = true;
  nationalIdLabel: BilingualText;
  guardianPayeeForm: FormGroup;
  guardianSource: string;
  showBankDetail = false;
  id: number;
  age: number;
  listOfGuardiansLovList: Observable<LovList>;
  @Input() lang = 'en';
  @Input() hideSaveButton = false;
  @Input() listYesNo$: Observable<LovList>;
  @Input() systemRunDate: GosiCalendar;
  @Input() showCardForBank = false;
  @Input() guardianDetails: PersonalInformation;
  @Input() paymentMethodList: Observable<LovList>;
  @Input() listOfGuardians: AttorneyDetailsWrapper[];
  @Input() parentForm: FormGroup;
  @Input() nationalityList$: Observable<LovList>;
  @Input() update = false;
  @Input() bankDetails: PersonBankDetails; //Get bank details
  @Input() hideChooseGuardian = false;

  @Output() searchGuardian: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() getBankDetails: EventEmitter<number> = new EventEmitter(); //Get bank details

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForms();
  }

  createForms() {
    if (!this.guardianDetialsForm) this.guardianDetialsForm = this.createGuardianForm();
    if (this.parentForm) {
      if (this.parentForm.get('guardian')) this.parentForm.removeControl('guardian');
      this.parentForm.addControl('guardian', this.guardianDetialsForm);
      if (this.parentForm.get('guardianSource')) {
        this.guardianSource = this.parentForm.get('guardianSource').value;
        if (this.guardianSource && this.guardianSource === BenefitValues.alreadySavedHeir) {
          this.guardianDetialsForm?.get('selectGuardianFromList').get('english').setValue(BenefitValues.yes);
          this.showListOfGuardians = true;
        } else if (this.guardianSource === BenefitValues.newPerson) {
          this.guardianDetialsForm?.get('selectGuardianFromList').get('english').setValue(BenefitValues.no);
          this.showListOfGuardians = false;
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.listOfGuardians && changes.listOfGuardians.currentValue) {
      this.createForms();
      this.nationalIdLabel = new BilingualText();
      this.nationalIdLabel.english = BenefitValues.nationaliIdEnglish;
      this.nationalIdLabel.arabic = BenefitValues.nationalIdArabic;
      this.listOfGuardiansLovList = this.createLovForName(changes.listOfGuardians.currentValue);
    }
    if (
      changes.guardianDetails &&
      changes.guardianDetails.currentValue &&
      changes.guardianDetails.currentValue.personId
    ) {
      this.guardianDetails = changes.guardianDetails.currentValue;
      this.getBankDetails.emit(this.guardianDetails.personId);
      this.guardianDetialsForm.get('guardianPersonId').patchValue(this.guardianDetails.personId);
      this.parentForm.controls.guardian.updateValueAndValidity();
      if (this.guardianDetails.nin) {
        this.id = this.guardianDetails.nin.newNin;
      } else if (this.guardianDetails.identity) {
        const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(this.guardianDetails.identity);
        this.id = idObj ? idObj.id : null;
      }
      if (this.guardianDetails.birthDate) {
        const birthdate = moment(this.guardianDetails.birthDate.gregorian);
        const thisDay = moment();
        this.age = thisDay.diff(birthdate, 'years');
      }
    }
    if (changes?.hideChooseGuardian?.currentValue) {
      this.createForms();
      this.chooseGuardian(BenefitValues.no);
    }
  }

  createLovForName(list: AttorneyDetailsWrapper[]) {
    const lovItems: Lov[] = [];
    list.forEach((eachItem, index) => {
      const value = new Lov();
      value.sequence = index;
      value.code = eachItem.personId;
      const bilingual = new BilingualText();
      bilingual.arabic = getPersonArabicName(eachItem.name.arabic);
      bilingual.english = getPersonEnglishName(eachItem.name.english);
      if (eachItem.personId) {
        bilingual.english = bilingual.english + ` (` + this.nationalIdLabel.english + ` : ${eachItem.personId})`;
        bilingual.arabic = bilingual.arabic + ` (` + this.nationalIdLabel.arabic + ` : ${eachItem.personId})`;
      } else if (eachItem.identity.length) {
        const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(eachItem.identity);
        bilingual.english = bilingual.english + ` (` + this.nationalIdLabel.english + ` : ${idObj.id})`;
        bilingual.arabic = bilingual.arabic + ` (` + this.nationalIdLabel.arabic + ` : ${idObj.id})`;
      }

      value.value = bilingual;
      lovItems.push(value);
    });
    const lov = new BehaviorSubject(new LovList(lovItems));
    return lov.asObservable();
  }

  createGuardianForm() {
    return this.fb.group({
      paymentMode: this.fb.group({
        english: [BenefitValues.BANK, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      selectGuardianFromList: this.fb.group({
        english: ['Yes', { validators: Validators.required }],
        arabic: null
      }),
      guardianPersonId: null,
      guardianSource: null,
      selectedFromList: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  chooseGuardian(event) {
    if (event === 'Yes') {
      this.showListOfGuardians = true;
      this.guardianDetialsForm.get('guardianSource').patchValue(BenefitValues.alreadySavedHeir);
    } else {
      this.showListOfGuardians = false;
      this.guardianDetialsForm.get('guardianSource').patchValue(BenefitValues.newPerson);
    }
  }

  verifyGuardian(searchGurdian: SearchPerson) {
    if (this.guardianDetialsForm.valid) {
      this.searchGuardian.emit(searchGurdian);
    } else {
      this.guardianDetialsForm.markAllAsTouched();
    }
  }

  guardianSelected(event: Lov) {
    this.guardianDetialsForm.get('guardianPersonId').patchValue(event.code);
    this.parentForm.controls.guardian.updateValueAndValidity();
  }

  // method to reset search
  resetSearch() {
    this.guardianDetails = new PersonalInformation();
  }

  ngOnDestroy() {
    this.guardianDetails = null;
  }
}
