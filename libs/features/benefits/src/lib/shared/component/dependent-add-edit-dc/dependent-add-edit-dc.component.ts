/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnChanges, SimpleChanges, Input, HostListener } from '@angular/core';
import * as moment from 'moment';
import { ActionType } from '../../enum/action-type';
import { BenefitConstants, EventsConstants } from '../../constants';
import { getStatusDate } from '../../utils/validateDependentUtils';
import { Lov, startOfDay, formatDate } from '@gosi-ui/core';
import { Validators } from '@angular/forms';
import { AgeInNewLaw, DependentDetails } from '../../models/dependent-details';
import { calendarWithStartOfDay, getRequestDateFromForm, removeDuplicateEvents } from '../../utils';
import { MaritalValues } from '../../enum/marital-values';
import { PersonalInformation } from '../../models';
import { DependentAddBaseComponent } from '../base/dependent-add-base.component';

@Component({
  selector: 'bnt-dependent-add-edit-dc',
  templateUrl: './dependent-add-edit-dc.component.html',
  styleUrls: ['./dependent-add-edit-dc.component.scss']
})
export class DependentAddEditDcComponent extends DependentAddBaseComponent implements OnInit, OnChanges {
  notificationDate: Date;
  maxDate: Date;
  descriptionMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  currentDate: Date;
  maritalValues = MaritalValues;

  @Input() lang: string;
  @Input() isLumpsum = false;
  @Input() contributorDetails: PersonalInformation; //Not used
  @Input() benefitRequestId: number;
  // @Input() isModifyPage: boolean;

  isSmallScreen: boolean;

  depHeirDeathDate;
  // isSameDate = false;

  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    // const systemRunDateVal = moment(this.systemRunDate.gregorian); //Defect 490454
    // this.isSameDate = this.eligibilityStartDateInDateFormat.isSame(systemRunDateVal, 'day') ? true : false;
    if (changes) {
      if (changes.annuityRelationShipList?.currentValue) {
        this.setInputValues();
        if (this.update) {
          this.resetSearch();
          this.updateFirstTime = true;
          this.setRelationAndMaritalStatus(this.annuityRelationShipList);
          if (!this.status || this.status?.english === MaritalValues.single) {
            // As there is no marital status below fun wouldn't get called for single status
            this.selectRelationShipForDependent(this.selectedRelationship, true);
          }
        }
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
    if (this.update) {
      if (this.isModifyPage) this.disableSave = true;
      const qnForm = this.questionsForm.valueChanges.subscribe(qn => {
        if (!this.questionsForm.pristine) {
          this.disableSave = false;
          qnForm.unsubscribe();
        }
      });
      const dependentForm = this.dependentForm.valueChanges.subscribe(form => {
        if (!this.dependentForm.pristine) {
          this.disableSave = false;
          dependentForm.unsubscribe();
        }
      });
    }
  }

  /*
   * This method is for initialisation tasks
   */
  ngOnInit(): void {
    this.maxDate = moment(this.systemRunDate?.gregorian).toDate();
    this.notificationDate = moment(this.systemRunDate?.gregorian).add(1, 'y').toDate();
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    // this.isSmallScreen = window.innerWidth <= 768 ? true : false;
    this.isThisAgeInNewLaw.emit([
      { year: 20, hijiriDob: this.dependentDetails.birthDate.hijiri },
      { year: 25, hijiriDob: this.dependentDetails.birthDate.hijiri }
    ] as AgeInNewLaw[]);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    // const scrWidth = window.innerWidth;
    this.isSmallScreen = window.innerWidth <= 960 ? true : false;
  }
  selectMaritalStatus(value: Lov) {
    // if (value.value) {
    this.resetErrors();
    this.selectedMartialStatus = value.value;
    this.setMaritalStatusDate(this.selectedMartialStatus?.english);
    if (this.latestEvent && this.latestEvent.status.english === this.selectedMartialStatus.english) {
      this.setMaritalStatusDate(this.latestEvent.status?.english, this.latestEvent.eventStartDate, true);
    }
    this.selectRelationShipForDependent(this.selectedRelationship, true);
    // }
  }

  maritalStatusDateChanged() {
    this.setStatusAndDate();
    if (this.statusDate) {
      this.maritalStatusDateUpdatedFromUi = true;
      this.dependentForm.get('maritalStatusDate.gregorian').patchValue(startOfDay(this.statusDate.toDate()));
      this.selectRelationShipForDependent(this.selectedRelationship, true);
    }
    // if (
    //   this.dependentForm.get('maritalStatusDate').valid &&
    //   (!this.statusDate ||
    //     !this.statusDate.isSame(moment(this.dependentForm.getRawValue().maritalStatusDate?.gregorian)))
    // ) {
    //   this.maritalStatusDateUpdatedFromUi = true;
    //   this.dependentForm
    //     .get('maritalStatusDate.gregorian')
    //     .patchValue(startOfDay(moment(this.dependentForm.get('maritalStatusDate.gregorian').value).toDate()));
    //   this.selectRelationShipForDependent(this.selectedRelationship, true);
    // }
  }

  /**
   *
   * @param question
   * @param value
   * @param formGroup
   */

  /*
   * This method is for save dependent
   */
  save(update: boolean) {
    if (this.disableSave) return;
    this.disableSave = true;
    if (this.dependentForm.invalid) {
      this.dependentForm.markAllAsTouched();
      this.disableSave = false;
      return;
    }
    this.resetErrors();
    // if (this.dependentDetails.actionType === ActionType.ADD) {
    //   this.dependentDetails.newlyAdded = true;
    // }
    const dependent = {
      actionType: this.dependentDetails.actionType !== ActionType.ADD && update ? ActionType.MODIFY : ActionType.ADD,
      dateOfBirth: this.dependentDetails.birthDate,
      personId: this.dependentDetails.personId,
      relationship: this.selectedRelationship?.value,
      events: [],
      maritalStatusDateUpdatedFromUi: this.maritalStatusDateUpdatedFromUi,
      maritalStatusDate: this.dependentForm?.get('maritalStatusDate')
        ? calendarWithStartOfDay(this.dependentForm?.getRawValue()?.maritalStatusDate)
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
        : null
      // nin: this.dependentForm.get('nationalId').value
    } as DependentDetails;

    if (this.setQuestionsEventsControlsForValidate(dependent as DependentDetails)) {
      //const nonDuplicatingEvents = removeDuplicateEvents(dependent?.events);
      //to remove duplicate auto added events while editing
      //dependent.events = nonDuplicatingEvents;
      if (update) {
        this.saveDependent.emit(dependent);
      } else {
        this.validateDependent.emit(dependent);
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
  getDateFormat(lang) {
    return formatDate(lang);
  }
  getStatus(status) {
    if (status?.english === MaritalValues.divorcee) {
      return EventsConstants.DIVORCE;
    }
    return status;
  }
  getMaritalStatusFemale() {
    if (this.status?.english === MaritalValues.widower) {
      return EventsConstants.WIDOWHOOD;
    } else if (this.status?.english === MaritalValues.divorcee) {
      return EventsConstants.DIVORCE;
    } else {
      return this.status;
    }
  }
}
