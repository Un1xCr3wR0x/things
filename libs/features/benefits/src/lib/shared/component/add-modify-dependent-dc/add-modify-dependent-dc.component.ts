/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import {BilingualText, GenderEnum, GosiCalendar, Lov, Role} from '@gosi-ui/core';
import { AddEvent, AnnuityResponseDto, DependentDetails, HeirEvent, Question } from '../../models';
import { ActionType, BenefitEventSource, BenefitValues, QuestionTypes } from '../../enum';
import {
  getQuestionForDependent,
  calendarWithStartOfDay,
  getStatusDate,
  getEventsFormArray,
  getEventsForDependent,
  getDuplicateEvents,
  getRequestDateFromForm,
  isHeirDisabled
} from '../../utils';
import { EventsConstants } from '../../constants';
import { HeirDependentAddEditBaseComponent } from '../base/heir-dependent-add-edit-base.component';
import moment from 'moment';

@Component({
  selector: 'bnt-add-modify-dependent-dc',
  templateUrl: './add-modify-dependent-dc.component.html',
  styleUrls: ['./add-modify-dependent-dc.component.scss']
})
export class AddModifyDependentDcComponent
  extends HeirDependentAddEditBaseComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() qnControl: FormGroup;
  @Input() addedEvent: AddEvent;
  @Input() isValidator = false;
  @Input() benefitRequestId: number;
  @Output() changeToggle: EventEmitter<boolean> = new EventEmitter();
  questionsForm = new FormArray([]);
  sex: BilingualText;
  isSmallScreen: boolean;
  disableSave = true;

  ngOnInit(): void {
    this.isModifyBackdated = true;
    this.eventErrorWithoutEventCategory = null;
    this.isSmallScreen = window.innerWidth <= 768 ? true : false;
    this.getEvents.emit(this.dependentDetails.personId);
    this.selectedRelationship = new Lov();
    this.selectedRelationship.value = this.dependentDetails?.relationship;
    this.setQuestons();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.validateApiResponse && changes.validateApiResponse.currentValue) {
      this.validated();
    }
    if (changes.events?.currentValue && changes.events?.currentValue) {
      this.setQuestons();
    }
    if (changes.eligibilityStartDate && changes.eligibilityStartDate.currentValue) {
      this.calculateAgeAndEligibility();
    }
    if (changes.addedEvent?.currentValue) {
      this.disableSave = false;
    }
  }

  ngAfterViewInit() {
    // const qnForm = this.questionsForm.valueChanges.subscribe(qn => {
    //   if (!this.questionsForm.pristine) {
    //     this.disableSave = false;
    //     qnForm.unsubscribe();
    //   }
    // });
  }

  setQuestons() {
    this.questions = [];
    this.questionsForm = new FormArray([]);
    //this.addedEvent = element?.events;
    const qnEventOnly: Question = getQuestionForDependent(EventsConstants.eventsOnlyText());
    if (this.dependentDetails?.events) {
      qnEventOnly.events = [...this.dependentDetails?.events];
    }
    // employmentEvents removed from request and modify "dependents" ---- Defect 502622
    // no need to be shown in event table and no need of employment questions for dependents
    if (this.events) {
      qnEventOnly.events = [...qnEventOnly?.events, ...this.events?.maritalEvents];
    }
    this.createQuestionList(qnEventOnly);

    if (this.dependentDetails?.gender?.english === GenderEnum.MALE) {
      const qn: Question = getQuestionForDependent(QuestionTypes.DISABLED);
      qn.value = false;
      qn.eventsCanbeAdded = false;
      if (this.dependentDetails?.disabled) {
        qn.value = true;
        // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator) {
        // if (!this.hasManuallyAddedDisabledEvent()) {
        if (isHeirDisabled(this.dependentDetails.events) || (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)) {
          qn.disabled = true;
        }
      }
      this.createQuestionList(qn);
    }
    this.questionsForm = this.createQuestionForm();
    const qnForm = this.questionsForm.valueChanges.subscribe(qn => {
      if (!this.questionsForm.pristine) {
        this.disableSave = false;
        qnForm.unsubscribe();
      }
    });
  }

  /*
   * This method is for save dependent
   */
  save() {
    this.resetErrors();
    const dependent = {
      actionType: this.dependentDetails?.actionType === ActionType.ADD ? ActionType.ADD : ActionType.MODIFY,
      dateOfBirth: this.dependentDetails.birthDate,
      personId: this.dependentDetails.personId,
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
      statusDate: getStatusDate(this.dependentForm),
      modificationRequestDate: getRequestDateFromForm(this.parentForm),
      disabilityDescription: this.dependentForm.get('disabilityDescription')
        ? this.dependentForm.get('disabilityDescription').value
        : null
      // nin: this.dependentForm.get('nationalId').value
    } as DependentDetails;
    if (this.setQuestionsEventsControlsForValidate(dependent as DependentDetails)) {
      this.saveDependent.emit(dependent);
    }
  }

  changeToggleForQuestion(question: Question, value: boolean, formGroup: FormGroup) {
    this.disableSave = false;
    const yesOrNo = value ? BenefitValues.yes : BenefitValues.no;
    this.toggleSelected(question, yesOrNo, formGroup);
  }

  /**
   *
   * @param question
   * @param value
   * @param formGroup
   */
  toggleSelected(question: Question, value: string, formGroup: FormGroup) {
    //Reset only error messages
    const formControlName = question.key;
    this.addedEvent = null;
    question.infoMessage = null;
    this.resetErrors();
    // const date = new GosiCalendar();
    const date = getRequestDateFromForm(this.parentForm);
    if (formControlName === QuestionTypes.DISABLED) {
      const event = getEventsForDependent(formControlName, date);
      const eventsOnlyIndex = this.questions.findIndex(eachQn => eachQn.key === EventsConstants.eventsOnlyText());
      if (value === 'Yes') {
        this.questions[eventsOnlyIndex].events.push(event[0]);
      }
      if (value === 'No') {
        const disabledEventIndex = this.questions[eventsOnlyIndex].events.findIndex(eachEvent => {
          return (
            eachEvent.eventCategory === event[0].eventCategory &&
            moment(eachEvent.eventStartDate.gregorian).isSame(event[0].eventStartDate.gregorian)
          );
        });
        this.questions[eventsOnlyIndex].events.splice(disabledEventIndex, 1);
      }
    }
    this.questions?.forEach((query, index) => {
      const qnControl = this.questionsForm.at(index) as FormGroup;
      qnControl?.removeControl('eventControls');
      if (query?.events && query?.events?.length) {
        qnControl?.addControl('eventControls', getEventsFormArray(query?.events));
      }
    });
  }

  onToggle(event: boolean) {
    this.changeToggle.emit(event);
  }

  ngOnDestroy() {
    this.isModifyBackdated = false;
  }

  hasManuallyAddedDisabledEvent() {
    return this.dependentDetails.events.filter(
      item =>
        item.eventSource?.english === BenefitEventSource.MANUAL &&
        item.eventType?.english === EventsConstants.BEGINNING_OF_DISABILITY.english
    ).length;
  }
}
