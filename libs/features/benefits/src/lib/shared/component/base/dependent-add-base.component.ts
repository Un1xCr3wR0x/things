import { Directive, Input } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import {CommonIdentity, GosiCalendar, Lov, Role} from '@gosi-ui/core';
import moment from 'moment';
import {
  addEventToEventsOnlyQuestion,
  deleteNonRemovableEvent,
  getControlsForDependent,
  getDuplicateEvents,
  getEventsForCategory,
  getEventsForDependent,
  getEventsForMaritalStatus,
  getEventsFormArray,
  getAllEventsFromQuestions,
  getIdLabel,
  getIdRemoveNullValue,
  getQuestionForDependent,
  isFatherGrandfatherHusband,
  isFemale,
  isMotherOrGrandMother,
  isSisterDaughter,
  isSonGrandsonBrother,
  removeEventForQuestionKeyFromQuestions,
  removeEventsAddedFromCurrentSession,
  setMariatalEvent,
  findOddEvent,
  getRequestDateFromForm,
  getOldestEventFromNicEvents,
  maritalStatusForEventType,
  isHeirDisabled,
  getQuestionKeyValue
} from '../../utils';
import { DependentDetails, HeirEvent, Question } from '../../models';
import { QuestionTypes, RelationShipCode, ActionType, BenefitValues, MaritalValues } from '../../enum';
import { EventsConstants } from '../../constants';
import { HeirDependentAddEditBaseComponent } from './heir-dependent-add-edit-base.component';

@Directive()
export abstract class DependentAddBaseComponent extends HeirDependentAddEditBaseComponent {
  /**
   * Input
   */
  @Input() disableSave = false;

  updateFirstTime: boolean;
  // isSameDate = false;

  setSavedValues() {
    if (this.dependentDetails) {
      this.personDetailsForm.get('name').patchValue(this.dependentDetails.name);
      this.personDetailsForm.get('gender').patchValue(this.dependentDetails.gender);
    }
  }

  selectRelationShipForDependent(value: Lov, maritalStatusChanged = false) {
    /**
     * refer calculateAgeAndEligibility()
     * Variables to be used for Heir eligibility check
     * 1. hijiriAgeInMonths
     * 2. isEligibilityDateInNewLaw
     * 3. ageOnEligibilityDate
     * 4. isAlive
     * 5. eligibilityStartDateInDateFormat
     */
    //US: 425769
    // if (this.selectedRelationship?.code !== value?.code) {
    if (!value?.code) return;
    this.selectedRelationship = value;
    this.questions = [];
    this.questionsForm = new FormArray([]);
    this.setMaritalStatus(maritalStatusChanged);
    if (!this.dependentForm.valid) return;
    // this.setStatusAndDate();
    if (this.selectedRelationship && isFemale(this.selectedRelationship)) {
      if (!isMotherOrGrandMother(this.selectedRelationship)) {
        // Defect 545422 if eventDate coming from events api is before eligibility date then eventapi values wont be displayed
        if (
          !moment({ gregorian: this.statusDate?.toDate() }.gregorian).isSameOrBefore(
            this.eligibilityStartDateInDateFormat
          )
        )
          this.setMaritalEventsFromApi();
      }
      if (this.status && this.maritalStatusEvents.includes(this.status.english)) {
        const qn: Question = getQuestionForDependent(EventsConstants.eventsOnlyText());
        // info message not required for divorcedOrWidowed - Defect 503895
        qn.showInfoMsg =
          this.status.english === MaritalValues.divorcee || this.status.english === MaritalValues.widower
            ? false
            : true;
        qn.showAddeventButton = false;
        qn.events = [];
        // As per BA confirmation, marital events shouldn't be populated if maritalEvents already come from BE(NIC or MOJ)....
        // Only if there are no events, get events from UI

        // To do:  change condition to be same as that of disable condition(nic/moj) of sorted event from getMaritalEventToPopulate
        if (
          maritalStatusChanged ||
          (!this.isValidator &&
            this.dependentDetails.actionType !== ActionType.ADD &&
            !this.events?.maritalEvents?.length)
        ) {
          qn.events.push(
            getEventsForMaritalStatus(
              this.status.english,
              { gregorian: this.statusDate.toDate() },
              this.eligibilityStartDateInDateFormat
            )
          );
        }
        // else if(this.dependentDetails.events?.length) {
        //   qn.events = getEventsForCategory(this.dependentDetails.events, EventCategory.married);
        // }

        this.createQuestionList(qn);
      }
      // this.setMomGrandMomQuestions();
      // let qn: Question;
      this.wifeQuestions();
      this.setSisterDaughterQuestions();
    }
    this.setFatherGrandFatherQuestions();
    this.sonGrandsonBrotherQuestions();
    this.questionsForm = this.createQuestionForm();
    this.questions.forEach((eachQn, index) => {
      this.toggleSelected(
        eachQn,
        this.questionsForm.at(index).get(eachQn.key).value ? 'Yes' : 'No',
        this.questionsForm.at(index) as FormGroup
      );
    });
    if (this.requestDateChangedByValidator && this.dependentDetails.showMandatoryDetails) {
      return;
    } else if (this.update && this.updateFirstTime) {
      this.setPreselectedQuestionsAndControls(this.dependentDetails, this.questionsForm);
    }
  }

  wifeQuestions() {
    // US: 395702
    if (this.selectedRelationship.code.toString() === RelationShipCode.WIFE) {
      if (
        this.status.english === MaritalValues.married &&
        this.statusDate &&
        this.statusDate.isAfter(this.eligibilityStartDateInDateFormat)
      ) {
        const qn: Question = getQuestionForDependent(QuestionTypes.MARRIED_WIFE);
        // qn.value = true;
        qn.showAddeventButton = true;
        qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
        this.createQuestionList(qn);
      }
      if (
        (this.status.english === MaritalValues.divorcee || this.status.english === MaritalValues.widower) &&
        this.statusDate &&
        this.statusDate.isAfter(this.eligibilityStartDateInDateFormat)
      ) {
        const qn: Question = getQuestionForDependent(EventsConstants.eventsOnlyText());
        // info message not required for divorcedOrWidowed - Defect 503895
        qn.showInfoMsg = false;
        qn.value = false;
        qn.showAddeventButton = true;
        qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
        this.createQuestionList(qn);
      }
    }
  }

  setMaritalEventsFromApi() {
    if (this.events?.maritalEvents?.length) {
      //US: 398902
      //Only show events no question
      const qn: Question = getQuestionForDependent(EventsConstants.eventsOnlyText());
      // info message not required for divorcedOrWidowed - Defect 503895
      qn.showInfoMsg =
        this.status.english === MaritalValues.divorcee || this.status.english === MaritalValues.widower ? false : true;
      qn.value = true;
      qn.showAddeventButton = false;
      // qn.eventsCanbeAdded = false;
      qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
      this.createQuestionList(qn);
    }
  }

  setSisterDaughterQuestions() {
    if (isSisterDaughter(this.selectedRelationship)) {
      //395695
      //399133
      if (
        this.statusDate &&
        this.statusDate.isAfter(this.eligibilityStartDateInDateFormat) &&
        this.status.english === MaritalValues.married
      ) {
        const qn: Question = getQuestionForDependent(QuestionTypes.MARRIED);
        qn.value = false;
        qn.showAddeventButton = true;
        qn.minDate = this.eligibilityStartDateInDateFormat.toDate();
        qn.maxDate = this.statusDate.toDate();
        qn.addEventForAnswer = true;
        qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
        this.createQuestionList(qn);
      } else if (
        (this.status.english === MaritalValues.widower || this.status.english === MaritalValues.divorcee) &&
        this.statusDate &&
        this.statusDate.isAfter(this.eligibilityStartDateInDateFormat)
      ) {
        const qn: Question = getQuestionForDependent(QuestionTypes.DIVORCED_OR_WIDOWED);
        qn.showInfoMsg =
          this.status.english === MaritalValues.divorcee || this.status.english === MaritalValues.widower
            ? false
            : true;
        qn.value = true;
        qn.minDate = this.eligibilityStartDateInDateFormat.toDate();
        qn.maxDate = this.statusDate.toDate();
        qn.addEventForAnswer = false;
        qn.mandatoryEventsToBeAdded = [EventsConstants.MARRIED];
        this.createQuestionList(qn);
      }
    }
  }

  setFatherGrandFatherQuestions() {
    /**
     * Father/Grandfather/Husband disability question
     */
    if (isFatherGrandfatherHusband(this.selectedRelationship)) {
      // if (this.ageOnEligibilityDate < 60) { //age on eligibility removed story:
      const qn: Question = getQuestionForDependent(QuestionTypes.DISABLED);
      qn.value = false;
      // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator) {
      if (isHeirDisabled(this.dependentDetails.events) || (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)) {
        qn.disabled = true;
      }
      this.createQuestionList(qn);
      // }
    }
  }

  sonGrandsonBrotherQuestions() {
    //TODO Story: 403239
    if (isSonGrandsonBrother(this.selectedRelationship)) {
      if (
        (this.isEligibilityDateInNewLaw && this.ageOnEligibilityDate < 26 && this.hijiriAgeInMonths >= 249) ||
        (this.isAgeInNewLaw(20) && this.ageOnEligibilityDate < 25 && this.hijiriAgeInMonths >= 252) ||
        (!this.isAgeInNewLaw(20) && this.ageOnEligibilityDate < 25 && this.hijiriAgeInMonths >= 240)
      ) {
        let qn: Question;
        qn = getQuestionForDependent(QuestionTypes.STUDENT);
        if (this.eligibilityStartDateInDateFormat.isSame(this.currentDate, 'day')) {
          qn.label = 'BENEFITS.IS-DEPENDENT-STUDENT';
        }
        qn.value = false;
        qn.minDate = this.eligibilityStartDateInDateFormat.toDate();
        this.createQuestionList(qn);
      }
      if (this.isAlive) {
        let qn: Question;
        qn = getQuestionForDependent(QuestionTypes.DISABLED);
        qn.value = false;
        // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator) {
        if (isHeirDisabled(this.dependentDetails.events) ||
          (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)
        ) {
          qn.disabled = true;
        }
        if (
          (this.isEligibilityDateInNewLaw && this.hijiriAgeInMonths >= 312) ||
          (!this.isEligibilityDateInNewLaw && this.hijiriAgeInMonths >= 300)
        ) {
          qn.inputControls = getControlsForDependent(QuestionTypes.DISABLED);
        }
        this.createQuestionList(qn);
      }
    }
  }

  setPreselectedQuestionsAndControls(dependentDetails: DependentDetails, questionsForm: FormArray) {
    //TODO: set question, inputcontrols, events
    this.questions.forEach((eachQn, index) => {
      if (
        eachQn.key &&
        // eachQn.key !== EventsConstants.eventsOnlyText() &&
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
            questionsForm
              .at(index)
              ?.get('inputControls')
              ['controls'].at(controlIndex)
              .get(control.key)
              .patchValue(dependentDetails[control.key]);
          });
        }
        this.setEventsInFormAndQnObject(dependentDetails, questionsForm, index, eachQn);
      }
      // else if (eachQn.key === EventsConstants.eventsOnlyText()) {bnt-dependent-details-sc
      //   //TODO: add events
      // }
    });
    // console.log(getAllEventsFromQuestions(this.questions));
    const oddEvent = findOddEvent(this.dependentDetails.events || [], getAllEventsFromQuestions(this.questions));
    if (oddEvent.length) {
      oddEvent.forEach(event => {
        this.questions = addEventToEventsOnlyQuestion(this.questions, event);
        const index = this.questions.findIndex(qn => qn.key === EventsConstants.eventsOnlyText());
        if (index >= 0) {
          this.addMaritalEventToFormIndex(event, questionsForm, index, this.questions[index]);
        }
      });
    }
    this.updateFirstTime = false;
  }

  changeToggleForQuestion(question: Question, value: boolean, formGroup: FormGroup) {
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
    const maritalStatus = this.dependentForm.get('maritalStatus')?.value;
    const maritalStatusDate = this.dependentForm.getRawValue().maritalStatusDate;
    this.resetErrors();
    if (value === 'Yes') {
      if (formControlName === QuestionTypes.DISABLED) {
        // Applicable for both pension and Lumpsum
        let date = new GosiCalendar();
        this.isModifyPage
          ? (date = getRequestDateFromForm(this.parentForm))
          : (date.gregorian = this.eligibilityStartDateInDateFormat.toDate());
        const event = getEventsForDependent(formControlName, date);
        const duplicateEvents = getDuplicateEvents(event[0], question.events);
        if (!duplicateEvents.length) {
          //to remove duplicate auto added events while editing
          question.events = event;
          question.showAddeventButton = false;
        }
      } else if (
        formControlName === QuestionTypes.MARRIED &&
        question.label === 'BENEFITS.HAS-DEPENDENT-MARRIED-WIDOW-DIVORCEE'
      ) {
        //For this question the events are added when the answer is NO, so for Yes adding events to eventsonly Qn
        const marriageEvent = new HeirEvent(
          EventsConstants.MARRIED,
          { gregorian: this.eligibilityStartDateInDateFormat.toDate() },
          false,
          QuestionTypes.MARRIED
        );
        this.questions = addEventToEventsOnlyQuestion(this.questions, marriageEvent);
      } else {
        this.setEventForMarried(question, formGroup);
      }
    } else if (value === 'No') {
      if (formControlName === QuestionTypes.DISABLED) {
        const disabilityEvent = new HeirEvent(
          EventsConstants.BEGINNING_OF_DISABILITY,
          { gregorian: this.eligibilityStartDateInDateFormat.toDate() },
          false,
          QuestionTypes.DISABLED
        );
        this.questions = removeEventForQuestionKeyFromQuestions(
          disabilityEvent,
          this.questions,
          QuestionTypes.DISABLED
        );
      } else if (formControlName === QuestionTypes.STUDENT) {
        //this.dependentForm.removeControl('studyStartDate');
        if (this.isAgeInNewLaw(25)) {
          question.infoMessage = 'BENEFITS.DEPENDENT-SON-NEW-LAW-MSG';
        } else {
          question.infoMessage = 'BENEFITS.DEPENDENT-SON-OLD-LAW-MSG';
        }
      } else if (
        formControlName === QuestionTypes.MARRIED &&
        question.label === 'BENEFITS.HAS-DEPENDENT-MARRIED-WIDOW-DIVORCEE'
      ) {
        const marriageEvent = new HeirEvent(
          EventsConstants.MARRIED,
          { gregorian: this.eligibilityStartDateInDateFormat.toDate() },
          false,
          QuestionTypes.MARRIED
        );
        this.questions = removeEventForQuestionKeyFromQuestions(
          marriageEvent,
          this.questions,
          EventsConstants.eventsOnlyText()
        );
      } else {
        this.setEventForMarried(question, formGroup);
      }
    }
    if (
      (question.key === QuestionTypes.MARRIED ||
        question.key === QuestionTypes.MARRIED_WIFE ||
        question.key === QuestionTypes.DIVORCED_OR_WIDOWED) &&
      question.eventsCanbeAdded &&
      !this.isValidator &&
      this.dependentDetails.actionType !== ActionType.ADD &&
      !this.events?.maritalEvents?.length
    ) {
      const marriageEvent = getEventsForMaritalStatus(
        maritalStatus.english,
        maritalStatusDate,
        this.eligibilityStartDateInDateFormat
      );
      if (formGroup?.get(question.key)?.value === question.addEventForAnswer) {
        setMariatalEvent(question, marriageEvent, this.questions);
        //Delete events from event only key
        deleteNonRemovableEvent(this.questions, marriageEvent);
      } else {
        this.questions = addEventToEventsOnlyQuestion(this.questions, marriageEvent);
      }
    }
    if (
      question.key !== EventsConstants.eventsOnlyText() &&
      question.addEventForAnswer !== formGroup?.get(question.key)?.value
    ) {
      this.questions = removeEventsAddedFromCurrentSession(this.questions, question);
    }
    this.questions?.forEach((query, index) => {
      const qnControl = this.questionsForm.at(index) as FormGroup;
      qnControl?.removeControl('eventControls');
      if (query?.events && query?.events?.length) {
        qnControl?.addControl('eventControls', getEventsFormArray(query?.events));
      }
    });
  }
}
