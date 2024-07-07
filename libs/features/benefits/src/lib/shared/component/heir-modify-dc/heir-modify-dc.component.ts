/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GenderEnum, Lov } from '@gosi-ui/core';
import { AddEvent, BenefitPaymentDetails, DependentDetails, EventResponseDto, HeirEvent, Question } from '../../models';
import {
  addActionTypeToEvents,
  addEventToEventsOnlyQuestion,
  createControlsForm,
  deepCopy,
  getControlsForHeir,
  getDuplicateEvents,
  getEligibilityStatusForHeirPensionLumpsumFromValidateApi,
  getEventsForHeir,
  getEventsFormArray,
  getIsSonDaughter,
  getQuesInfoForHeir,
  getQuestionForDependent,
  getQuestionForHeir,
  getQuestionKeyValue,
  isHeirDisabled,
  removeEventForQuestionKeyFromQuestions
} from '../../utils';
import { DependentHeirConstants, EventsConstants } from '../../constants';
import { BenefitValues, EventCategory, RelationShipCode,InputControlType, QuestionTypes } from '../../enum';
import { HeirAddModifyBaseComponent } from '../base/heir-add-modify-base.component';
import * as moment from 'moment';

@Component({
  selector: 'bnt-heir-modify-dc',
  templateUrl: './heir-modify-dc.component.html',
  styleUrls: ['./heir-modify-dc.component.scss']
})
export class HeirModifyDcComponent extends HeirAddModifyBaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() qnControl: FormGroup;
  @Input() addedEvent: AddEvent;
  questionsForm = new FormArray([]);

  systemEvents = [BenefitValues.moj.toString(), BenefitValues.system.toString(), BenefitValues.nic.toString()];
  isSmallScreen: boolean;
  dependentHeirConstants = DependentHeirConstants;
  benefitPaymentDetails: BenefitPaymentDetails = {
    payeeType: null,
    paymentMode: null,
    bankAccount: null,
    samaVerification: null
  } as BenefitPaymentDetails;

  ngOnInit(): void {
    //Call events api before loading this component
    this.disableSave = true;
    this.disableVerify = true;
    this.isSmallScreen = window.innerWidth <= 768 ? true : false;
    this.getEvents.emit(this.dependentDetails.personId);
    if (this.dependentDetails?.validateApiResponse) {
      this.eligibilityStatusAfterValidation = getEligibilityStatusForHeirPensionLumpsumFromValidateApi(
        this.dependentDetails.validateApiResponse.events,
        this.dependentDetails.validateApiResponse.valid,
        this.benefitType,
        this.systemRunDate
      );
    }
    this.setQuestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.validateApiResponse && changes.validateApiResponse.currentValue) {
      this.heirValidated();
    }
    if (changes.events?.currentValue) {
      this.checkForMojEvents(this.events);
      this.setQuestions();
    }
    if (changes.addedEvent?.currentValue) {
      this.disableVerify = false;
    }
    if (changes.dependentDetails && changes.dependentDetails.currentValue) {
      this.benefitPaymentDetails = {
        payeeType: this.dependentDetails.payeeType,
        paymentMode: this.dependentDetails.paymentMode,
        bankAccount: this.dependentDetails.bankAccount,
        samaVerification: this.dependentDetails.bankAccount?.bankName
      } as BenefitPaymentDetails;
    }
  }

  setQuestions() {
    this.calculateAgeAndEligibility();
    this.questions = [];
    this.selectedRelationship = new Lov();
    this.selectedRelationship.value = this.dependentDetails?.relationship;
    this.dependentForm.get('relationship').patchValue(this.dependentDetails.relationship);
    this.questionsForm = new FormArray([]);
    //this.addedEvent = element?.events;
    const qnEventOnly: Question = getQuestionForHeir(EventsConstants.eventsOnlyText());
    // qnEventOnly.events = [...this.dependentDetails?.events];
    this.dependentDetails?.events.forEach((event: HeirEvent) => {
      const duplicateEvents = getDuplicateEvents(event, qnEventOnly.events);
      if (!duplicateEvents.length) {
        qnEventOnly.events.push(event);
      }
    });
    if (this.events) {
      qnEventOnly.events = [
        ...qnEventOnly.events,
        ...addActionTypeToEvents(
          this.dependentDetails?.relationship.english === BenefitValues.mother ? [] : this.events?.maritalEvents,
          qnEventOnly.events
        ),
        //employment events not required for wife
        ...addActionTypeToEvents(
          this.dependentDetails?.relationship.english === BenefitValues.wife ? [] : this.events?.employmentEvents,
          qnEventOnly.events
        ),
        //Defect 542812 death event shown if its coming from events api(new implementation)
        ...addActionTypeToEvents(this.events?.deathEvent, qnEventOnly.events)
      ];
    }

    this.createQuestionList(qnEventOnly);
    if (this.dependentDetails?.gender?.english === GenderEnum.MALE) {
      const qn: Question = getQuestionForHeir(QuestionTypes.DISABLED);
      qn.value = false;
      qn.eventsCanbeAdded = false;
      if (this.dependentDetails?.disabled) {
        qn.value = true;
        // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator)
        qn.disabled = true;
      } else if (this.isValidator && !this.isDraft) {
        qn.disabled = true;
      }
      this.createQuestionList(qn);
    } else {
      //Female 403949
      const eligibilityDate = moment(deepCopy(this.eligibilityStartDateInDateFormat));

      if (this.selectedRelationship.value?.english === RelationShipCode.WIFE &&
        this.dependentDetails?.heirStatus?.english === 'Widowed' &&
        this.requestDateInMoment.isBefore(eligibilityDate.add(10, 'M'))
      ) {
        //more condition is there
        const qn: Question = getQuestionForHeir(QuestionTypes.PREGNANT);
        qn.value = false;
        qn.eventsCanbeAdded = false;
        this.createQuestionList(qn);
      }
    }
    if (
      (this.selectedRelationship.value?.english === DependentHeirConstants.SonBilingual.english ||
        this.selectedRelationship.value?.english === DependentHeirConstants.DaughterBilingual.english) &&
      !this.isDeathOrMissingDateInNewLaw
    ) {
      const qn: Question = getQuestionForHeir(QuestionTypes.ORPHAN); // change qn params on next step
      qn.value = false;
      qn.isQuesInfoRequired = true;
      qn.eventsCanbeAdded = false;
      qn.quesInfo = getQuesInfoForHeir(QuestionTypes.ORPHAN);
      qn.isQuesInfoRequired = true;
      this.createQuestionList(qn);
    }
    this.questionsForm = this.createQuestionForm();
    this.setPreselectedQuestionsAndControls(this.dependentDetails, this.questionsForm);
  }

  checkForMojEvents(events: EventResponseDto) {
    if (
      events.maritalEvents?.findIndex(event => this.systemEvents.includes(event.eventSource.english)) >= 0 ||
      events.employmentEvents?.findIndex(event => this.systemEvents.includes(event.eventSource.english)) >= 0 ||
      events.deathEvent?.findIndex(event => this.systemEvents.includes(event.eventSource.english)) >= 0
    ) {
      this.disableVerify = false;
    }
  }

  verify() {
    // this.disableSave = false;
    this.validateHeir(true);
  }

  /*
   * This method is for save dependent
   */
  save() {
    this.resetErrors();
    this.addHeir(true);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.eligibilityStatusAfterValidation = null;
  }

  changeToggleForQuestion(question: Question, value: boolean, eachQuestionGrp: FormGroup) {
    // this.disableSave = false;
    this.disableVerify = false;
    this.toggleSelected(question, value ? BenefitValues.yes : BenefitValues.no, eachQuestionGrp);
  }

  /**
   *
   * @param question
   * @param value
   * @param formGroup
   */
  toggleSelected(question: Question, value: string, eachQuestionGrp: FormGroup) {
    //Reset only error messages
    this.addedEvent = null;
    const formControlName = question.key;
    if (formControlName === QuestionTypes.DISABLED) {
      const disabilityEvent = getEventsForHeir(formControlName, {
        gregorian: this.eligibilityStartDateInDateFormat.toDate()
      });
      disabilityEvent[0].eventCanBeDeleted = false;
      if (value === 'Yes') {
        this.isHeirDisabled = true;
        const duplicateEvents = getDuplicateEvents(disabilityEvent[0], question.events);
        if (
          !duplicateEvents.length &&
          this.dependentDetails.events.findIndex(
            event => event.eventType?.english === EventsConstants.BEGINNING_OF_DISABILITY.english
          ) < 0
        ) {
          this.questions = addEventToEventsOnlyQuestion(this.questions, disabilityEvent[0]);
        }
      } else {
        this.isHeirDisabled = false;
        this.questions = removeEventForQuestionKeyFromQuestions(
          disabilityEvent[0],
          this.questions,
          EventsConstants.eventsOnlyText()
        );
      }
    } else if (formControlName === QuestionTypes.ORPHAN) {
      if (value === 'Yes') {
        question.inputControls = getControlsForHeir(
          QuestionTypes.ORPHAN,
          '',
          moment(this.systemRunDate?.gregorian).toDate(),
          this.eligibilityStartDateInDateFormat.toDate()
        );
      }
    }
    if (question.inputControls) {
      //Add controls to eachQuestionGrp
      eachQuestionGrp.removeControl('inputControls');
      eachQuestionGrp.addControl('inputControls', createControlsForm(question));
    }
    //Set event controls for each question
    this.questions.forEach((qn, index) => {
      const qnControl = this.questionsForm.at(index) as FormGroup;
      qnControl.removeControl('eventControls');
      if (qn.events && qn.events.length) {
        qnControl.addControl('eventControls', getEventsFormArray(qn.events));
      }
    });
  }

  setPreselectedQuestionsAndControls(dependentDetails: DependentDetails, questionsForm: FormArray) {
    //TODO: set question, inputcontrols, events
    this.questions.forEach((eachQn, index) => {
      if (
        eachQn.key &&
        questionsForm?.at(index)?.get('key') &&
        eachQn.key === questionsForm.at(index).get('key').value
      ) {
        questionsForm?.at(index)?.get(eachQn.key).patchValue(getQuestionKeyValue(dependentDetails, eachQn));
        this.changeToggleForQuestion(
          eachQn,
          questionsForm?.at(index)?.get(eachQn.key).value,
          questionsForm?.at(index) as FormGroup
        );
        if (eachQn.inputControls && eachQn.inputControls.length) {
          eachQn.inputControls.forEach((control, controlIndex) => {
            let value = dependentDetails[control.key];
            if (control.controlType === InputControlType.DROPDOWN) {
              const lov = eachQn.dropDownList.items.filter(item => item.code === value);
              value = lov[0].value;
            } else if (control.controlType === InputControlType.DATE && value.gregorian) {
              if(moment(value.gregorian).isSameOrBefore(this.eligibilityStartDateInDateFormat.toDate())){
                 value.gregorian = this.eligibilityStartDateInDateFormat.toDate();
              }else{
                value.gregorian = moment(value.gregorian).toDate();
              }
            }
            questionsForm
              .at(index)
              ?.get('inputControls')
              ['controls'].at(controlIndex)
              .get(control.key)
              .patchValue(value);
          });
        }
        // For modify the events added to EventsOnly Object so each question iteration not required
        // this.setEventsInFormAndQnObject(dependentDetails, questionsForm, index, eachQn);
      }
    });
  }
}
