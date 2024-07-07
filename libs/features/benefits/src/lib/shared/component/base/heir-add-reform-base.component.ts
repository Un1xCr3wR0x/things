import {Directive, Input} from '@angular/core';
import {HeirAddBaseComponent} from './heir-add-base.component';
import {Lov, LovList, NationalityTypeEnum, Role} from "@gosi-ui/core";
import {FormArray, FormGroup} from "@angular/forms";
import {
  BenefitValues,
  createControlsForm,
  deepCopy,
  DependentDetails,
  EventsConstants,
  getControlsForHeir, getEventsFormArray,
  getIsSonDaughter,
  getQuestionForHeirReform, getTypesOfEventsAfterDate, hasOddBeginningOfStudyEvent,
  HeirEvent,
  isFatherMother,
  isHeirDisabled,
  isOverSeas,
  isSaudiMother,
  isWifeHusband, MaritalValues,
  Question,
  QuestionTypes,
} from "@gosi-ui/features/benefits/lib/shared";
import moment from "moment";

@Directive()
export abstract class HeirAddReformBaseComponent extends HeirAddBaseComponent {

  selectRelationShipForHeirReform(value: Lov, maritalStatusChanged = false) {
    /**
     * refer calculateAgeAndEligibility()
     * Variables to be used for Heir eligibility check
     * 1. hijiriAgeInMonths
     * 2. isDeathOrMissingDateInNewLaw
     * 3. ageOnEligibilityDate
     * 4. isAlive
     * 5. eligibilityStartDateInDateFormat
     * 6. requestDateInMoment
     */
    if (!value?.code) return;
    this.selectedRelationship = value;
    this.questions = [];
    this.eventErrorWithoutEventCategory = null;
    this.questionsForm = new FormArray([]);
    this.validateApiResponse = null;
    if (!this.updateFirstTime) {
      // For the edit scenario the status is set, and not to be cleared
      this.eligibilityStatusAfterValidation = null;
    }
    // resetManuallyAddedEvents(this.dependentDetails);
    this.setMaritalStatusForPensionReform(maritalStatusChanged);
    if (!this.dependentForm.valid) return;
    // this.setStatusAndDate();
    const heir: DependentDetails = deepCopy(this.dependentDetails);
    this.isContributorSaudi = heir?.nationality?.english === NationalityTypeEnum.SAUDI_NATIONAL;
    this.isOverSeasContributor = isOverSeas(heir.contactDetail);
    this.isMotherOverseas = isSaudiMother(this.selectedRelationship, heir.contactDetail, heir.nationality);
    this.disabledAndStudentQuestionForReform();
    if (this.selectedRelationship && isWifeHusband(this.selectedRelationship)) {
      this.setEventByMaritalStatus();
      this.setMaritalQuesionAndEvents();
      this.setWidowQuestion()
    }

    if (this.isAlive && isFatherMother(this.selectedRelationship)) {
      //403934
      const qn: Question = getQuestionForHeirReform(QuestionTypes.DISABLED);
      qn.value = false;
      if (isHeirDisabled(this.dependentDetails.events) ||
        (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)
      ) {
        qn.disabled = true;
      }
      this.createQuestionList(qn);
    }
    this.questionsForm = this.createQuestionForm();
    this.questions.forEach((eachQn, index) => {
      if (eachQn.key !== EventsConstants.eventsOnlyText()) {
        this.toggleSelected(
          eachQn,
          this.questionsForm.at(index).get(eachQn.key).value ? 'Yes' : 'No',
          this.questionsForm.at(index) as FormGroup
        );
      }
    });
    this.setUpdateQuestionsForm();
  }


  disabledAndStudentQuestionForReform() {
    if (getIsSonDaughter(this.selectedRelationship)) {
      //394402
      if (this.isAlive && this.ageOnEligibilityDate >= 21) {
        const qn = getQuestionForHeirReform(QuestionTypes.DISABLED); // change qn params on next step
        if (isHeirDisabled(this.dependentDetails.events) ||
          (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)
        ) {
          qn.disabled = true;
        }
        this.createQuestionList(qn);
      }
      if (this.ageOnEligibilityDate >= 21 && this.ageOnEligibilityDate < 24) {
        let qn: Question;
        qn = getQuestionForHeirReform(QuestionTypes.STUDENT);
        qn.minDate = this.eligibilityStartDateInDateFormat.toDate();
        this.createQuestionList(qn);
      }
    }

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
    this.dependentForm.removeControl('studyStartDate');
    this.dependentForm.removeControl('disabilityStartDate');
    this.dependentForm.removeControl('orphanDate');
    this.resetErrors();
    if (value === 'Yes') {
      if (question.addEventForAnswer === false) {
        eachQuestionGrp.removeControl('eventControls');
        question.events = [];
      }
      if (formControlName === QuestionTypes.EMPLOYED && !this.events.employmentEvents?.length) {
        //Insert wage on eligibility date
        const monthlyWageEvent = new HeirEvent(
          EventsConstants.BEGINNING_OF_EMPLOYMENT(),
          {gregorian: this.eligibilityStartDateInDateFormat.toDate()},
          false,
          QuestionTypes.EMPLOYED
        );
        this.setMonthlyWageQuestionEvents(question, monthlyWageEvent);
        // question.inputControls = getControlsForHeir(QuestionTypes.EMPLOYED, this.totalWage?.toString());
      } else if (formControlName === QuestionTypes.ORPHAN) {
        question.inputControls = getControlsForHeir(
          QuestionTypes.ORPHAN,
          '',
          moment(this.systemRunDate?.gregorian).toDate(),
          this.eligibilityStartDateInDateFormat.toDate()
        );
      } else if (formControlName === QuestionTypes.STUDENT) {
        //If there is beginning of study in nic events show notification date
        const oddBeginningOfStudyEvent = hasOddBeginningOfStudyEvent(question.events);
        if (this.isContributorSaudi && !this.isOverSeasContributor && oddBeginningOfStudyEvent) {
          question.inputControls = getControlsForHeir(
            QuestionTypes.STUDENT,
            moment(this.systemRunDate?.gregorian).add(1, 'y').toDate(),
            moment(this.systemRunDate?.gregorian).add(1, 'y').toDate(),
            moment(oddBeginningOfStudyEvent.eventStartDate?.gregorian).add(1, 'y').toDate()
          );
        }
      }
      this.setEventForDisabled(question, formControlName, value);
    } else if (value === 'No') {
      if (question.addEventForAnswer === true) {
        eachQuestionGrp.removeControl('eventControls');
        question.events = [];
      }
      if (formControlName === QuestionTypes.DISABLED) {
        eachQuestionGrp.removeControl('eventControls');
      } else if (formControlName === QuestionTypes.STUDENT) {
        //394402
        question.inputControls = null;
        question.infoMessage = 'BENEFITS.REFORM-HEIR-STUDENT-INFO';
      }

    }
    this.setEventForMarried(question, eachQuestionGrp);
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

  setRelationAndMaritalStatus(relationshipList: LovList) {
    if (this.dependentDetails.relationship) {
      this.dependentForm.get('relationship').patchValue(this.dependentDetails.relationship);
      this.selectedRelationship = this.getLovFromLovList(relationshipList, this.dependentDetails.relationship);
    }
    this.setMaritalStatusForPensionReform();
  }

  setWidowQuestion() {
    // const maritalEventsAfterEligibility = getTypesOfEventsAfterDate(this.events?.maritalEvents, this.eligibilityStartDateInDateFormat, EventsConstants.MARRIED);
    if (
      this.status.english === MaritalValues.married &&
      (
        this.reasonForBenefit?.reason?.english === BenefitValues.deathOfTheContributor ||
        this.reasonForBenefit?.reason?.english === BenefitValues.ohDeathOfTheContributor
      ) &&
      (
        this.statusDate.isAfter(this.eligibilityStartDateInDateFormat) ||
        getTypesOfEventsAfterDate(this.events?.maritalEvents, this.eligibilityStartDateInDateFormat, EventsConstants.MARRIED).length
      )
    ) {
      const qn: Question = getQuestionForHeirReform(QuestionTypes.REFORM_WIDOWED);
      qn.addEventForAnswer = false;
      qn.value = true;
      qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
      this.createQuestionList(qn);
    }
  }

}
