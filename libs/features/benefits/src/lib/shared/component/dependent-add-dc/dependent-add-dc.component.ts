import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { ActionType } from '../../enum/action-type';
import { BenefitConstants, EventsConstants } from '../../constants';
import { getStatusDate, setMariatalEvent } from '../../utils/validateDependentUtils';
import { Lov, startOfDay, formatDate, BilingualText, Name, convertToHijriFormatAPI } from '@gosi-ui/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Question, HeirEvent } from '../../models/questions';
import { AgeInNewLaw, DependentDetails } from '../../models/dependent-details';
import { BenefitValues } from '../../enum/benefit-values';
import { RelationShipCode } from '../../enum/relationship';
import {
  getControlsForDependent,
  getQuestionForDependent,
  getEventsFormArray,
  getEventsFormArrayForKey,
  getEventsForDependent,
  getDuplicateEvents,
  getEventsForMaritalStatus,
  deleteNonRemovableEvent,
  calendarWithStartOfDay,
  isFemale,
  isMotherOrGrandMother,
  isSisterDaughter,
  isSonGrandsonBrother,
  isFatherGrandfatherHusband,
  addEventToEventsOnlyQuestion,
  removeEventForQuestionKeyFromQuestions,
  getIdRemoveNullValue,
  removeNullFromIdentities,
  getRequestDateFromForm
} from '../../utils';
import { MaritalValues } from '../../enum/marital-values';
import { EventCategory, QuestionTypes } from '../../enum/events';
import { PersonalInformation } from '../../models';
import { DependentAddBaseComponent } from '../base/dependent-add-base.component';

@Component({
  selector: 'bnt-dependent-add-dc',
  templateUrl: './dependent-add-dc.component.html',
  styleUrls: ['./dependent-add-dc.component.scss']
})
export class DependentAddDcComponent extends DependentAddBaseComponent implements OnInit, OnChanges {
  notificationDate: Date;
  maxDate: Date;
  descriptionMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  currentDate: Date;

  @Input() lang: string;
  @Input() isLumpsum = false;
  @Input() contributorDetails: PersonalInformation; //Not used
  @Input() benefitRequestId: number;

  @Output() getRelationshipListByGender: EventEmitter<BilingualText> = new EventEmitter();

  isSmallScreen: boolean;
  updateFirstTime: boolean;
  depHeirDeathDate;

  /*
   * This method is for initialisation tasks
   */
  ngOnInit(): void {
    this.maxDate = moment(this.systemRunDate?.gregorian).toDate();
    this.notificationDate = moment(this.systemRunDate?.gregorian).add(1, 'y').toDate();
    this.isSmallScreen = window.innerWidth <= 768 ? true : false;
    // this.personDetailsForm = this.getForm();
    this.getLabel();
    this.selectGender();
  }
  ngOnChanges(changes: SimpleChanges) {
    //this.setInputValues();
    // const systemRunDateVal = moment(this.systemRunDate.gregorian); //Defect 490454
    // this.isSameDate = this.eligibilityStartDateInDateFormat?.isSame(systemRunDateVal, 'day') ? true : false;
    if (changes) {
      this.personDetailsForm = this.getForm();
      if (changes.annuityRelationShipList && changes.annuityRelationShipList.currentValue && this.update) {
        this.resetSearch();
        this.setSavedValues();
        this.updateFirstTime = true;
        this.setRelationAndMaritalStatus(this.annuityRelationShipList);
        // If there is marital status date the function would be called from date-dc
        if (!this.dependentForm.get('maritalStatusDate.gregorian'))
          this.selectRelationShipForDependent(this.selectedRelationship, false);
      }
      if (changes.validateApiResponse && changes.validateApiResponse.currentValue) {
        this.validated();
      }
      if (changes.eligibilityStartDate && changes.eligibilityStartDate.currentValue) {
        this.calculateAgeAndEligibility();
      }
      // if (changes.ageInNewLaw?.currentValue) {
      //   this.calculateAgeAndEligibility();
      // }
    }
    if (changes?.systemRunDate?.currentValue) {
      this.currentDate = moment(this.systemRunDate.gregorian).toDate();
    }
  }
  selectGender() {
    this.getRelationshipListByGender.emit(this.personDetailsForm.get('gender').value);
  }

  checkAlive() {
    const grp = this.fb.group({
      gregorian: [null, { updateOn: 'blur', validators: Validators.compose([Validators.required]) }],
      hijiri: [null, { updateOn: 'blur' }]
    });
    if (this.dependentForm.get('checkBoxForAlive')?.value) {
      this.isAlive = false;
      this.dependentForm.addControl('deathDate', grp);
      this.selectRelationShipForDependent(this.selectedRelationship);
    } else {
      this.isAlive = true;
      this.dependentForm.removeControl('deathDate');
      this.depHeirDeadBeforeEligibility = null;
      this.depHeirDeathDate = null;
      this.selectRelationShipForDependent(this.selectedRelationship);
    }
  }
  selectMaritalStatus(value: Lov) {
    this.selectedMartialStatus = value.value;
    this.setMaritalStatusDate(this.selectedMartialStatus?.english, this.dependentDetails.maritalStatusDate);
    this.selectRelationShipForDependent(this.selectedRelationship, true);
  }
  maritalStatusDateChanged() {
    this.maritalStatusDateUpdatedFromUi = true;
    this.dependentForm
      .get('maritalStatusDate.gregorian')
      .patchValue(startOfDay(moment(this.dependentForm.get('maritalStatusDate.gregorian').value).toDate()));
    this.selectRelationShipForDependent(this.selectedRelationship, true);
  }

  /*
   * This method is for save dependent
   */
  save(update: boolean) {
    this.resetErrors();
    if (this.personDetailsForm && this.personDetailsForm.invalid) {
      this.personDetailsForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
      return;
    }
    if (this.searchPersonData?.birthDate?.calendarType === 'hijiri') {
      this.searchPersonData.birthDate.hijiri = convertToHijriFormatAPI(this.searchPersonData?.birthDate?.hijiri);
    }
    const dependent = {
      actionType: !this.dependentDetails?.newlyAdded && update ? ActionType.MODIFY : ActionType.ADD,
      dateOfBirth:
        this.searchPersonData?.birthDate || this.searchPersonData?.dob
          ? this.searchPersonData?.birthDate || this.searchPersonData?.dob
          : this.dependentDetails.birthDate,
      personId: this.dependentDetails?.personId,
      relationship: this.selectedRelationship?.value,
      events: [],
      maritalStatusDateUpdatedFromUi: this.maritalStatusDateUpdatedFromUi,
      maritalStatusDate: this.dependentForm?.get('maritalStatusDate')
        ? calendarWithStartOfDay(this.dependentForm?.get('maritalStatusDate').value)
        : null,
      maritalStatus: this.dependentForm.get('maritalStatus') ? this.dependentForm.get('maritalStatus')?.value : null,
      deathDate: this.dependentForm.get('deathDate')
        ? calendarWithStartOfDay(this.dependentForm.get('deathDate')?.value)
        : null,
      benefitRequestId: this.benefitRequestId,
      benefitStartDate: this.benefitStartDate,
      modificationRequestDate: this.isModifyPage ? getRequestDateFromForm(this.parentForm) : null,
      statusDate: getStatusDate(this.dependentForm),
      disabilityDescription: this.dependentForm.get('disabilityDescription')
        ? this.dependentForm.get('disabilityDescription').value
        : null,
      identity: this.searchPersonData?.identity
        ? removeNullFromIdentities(this.searchPersonData?.identity)
        : removeNullFromIdentities(this.dependentDetails?.identity),
      name: new Name().fromJsonToObject(this.personDetailsForm.get('name')?.value) || this.dependentDetails?.name,
      sex: this.personDetailsForm.get('gender').value,
      nonSaudiDependentAdded: true,
      nationality: this.searchPersonData?.nationality || this.dependentDetails?.nationality
      // nin: this.dependentForm.get('nationalId').value
    } as DependentDetails;

    if (this.setQuestionsEventsControlsForValidate(dependent as DependentDetails)) {
      if (update) {
        this.saveDependent.emit(dependent);
      } else {
        if (this.personDetailsForm.valid) {
          this.validateDependent.emit(dependent);
        }
      }
    }
  }

  /**
   *
   */
  heirStatusSelected(status: string) {
    let selected = false;
    if (this.dependentForm.get(status)) {
      selected = this.dependentForm.get(status).value.english === 'Yes';
    }
    return selected;
  }

  deathDateSelected() {
    this.depHeirDeathDate =
      this.dependentForm.get('deathDate') && this.dependentForm.get('deathDate').value
        ? moment(this.dependentForm.get('deathDate.gregorian').value)
        : null;
    this.selectRelationShipForDependent(this.selectedRelationship);
    if (this.depHeirDeathDate)
      this.depHeirDeadBeforeEligibility = this.depHeirDeathDate.isBefore(this.eligibilityStartDateInDateFormat);
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }
}
