import { Directive, Input } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import {GosiCalendar, Lov, NationalityTypeEnum, Role, startOfDay} from '@gosi-ui/core';
import moment from 'moment';
import {
  createControlsForm,
  deepCopy,
  deleteNonRemovableEvent,
  disableLovItems,
  getControlsForHeir,
  getDuplicateEvents,
  getEligibilityStatusForHeirPensionLumpsumFromValidateApi,
  getEventsForHeir,
  getEventsForMaritalStatus,
  getEventsFormArray,
  getIndexOfAnEvent,
  getIsSonDaughter,
  getIsWifeUnborn,
  getLumpsumControlsForHeir,
  getLumpsumQuestionForHeir,
  getQuesInfoForHeir,
  getQuestionForHeir,
  getQuestionKeyValue,
  hasOddBeginningOfStudyEvent,
  isDaughterSisterWifeGranddaughter,
  isFatherGrandfatherHusband,
  isFemale,
  isHeirDisabled,
  isHeirLumpsum,
  isOverSeas,
  isSaudiMother,
  isSonGrandsonBrother,
  isSonGrandsonBrotherOrphanson,
  setMariatalEvent
} from '../../utils';
import { EventsConstants, DependentHeirConstants } from '../../constants';
import { Question, DependentDetails, HeirDetailsRequest, HeirEvent } from '../../models';
import {
  QuestionTypes,
  RelationShipCode,
  InputControlType,
  BenefitValues,
  MaritalValues,
  ActionType
} from '../../enum';
import { HeirAddModifyBaseComponent } from '../../component/base/heir-add-modify-base.component';

@Directive()
export abstract class HeirAddBaseComponent extends HeirAddModifyBaseComponent {
  isSmallScreen: boolean;
  reason: string;
  isHeirLumpsum: boolean;
  isContributorSaudi: boolean;
  isMotherOverseas = false;
  isOverSeasContributor: boolean;
  benefitReason: HeirDetailsRequest;
  dependentHeirConstants = DependentHeirConstants;
  updateFirstTime: boolean;
  maxDate: Date;

  // isSameDate = false;

  setSavedValues() {
    if (this.dependentDetails) {
      this.personDetailsForm.get('name').patchValue(this.dependentDetails.name);
      this.personDetailsForm.get('gender.english').patchValue(this.dependentDetails?.gender?.english);
    }
  }

  /**
   *
   * @param value
   * @param maritalStatusChanged
   */
  selectRelationShipForHeir(value: Lov, maritalStatusChanged = false) {
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
    this.setMaritalStatus(maritalStatusChanged);
    if (!this.dependentForm.valid) return;
    // this.setStatusAndDate();
    const heir: DependentDetails = deepCopy(this.dependentDetails);
    this.isContributorSaudi = heir?.nationality?.english === NationalityTypeEnum.SAUDI_NATIONAL;
    this.isOverSeasContributor = isOverSeas(heir.contactDetail);
    this.isMotherOverseas = isSaudiMother(this.selectedRelationship, heir.contactDetail, heir.nationality);
    if (this.isPension) {
      this.setWorkQuestion();
      this.setDisabledAndStudentQuestion();
      this.setOrphanQuestion();
      if (this.selectedRelationship && isFemale(this.selectedRelationship)) {
        this.setEventByMaritalStatus();
        if (isDaughterSisterWifeGranddaughter(this.selectedRelationship)) {
          this.setMaritalQuesionAndEvents();
        }
      }
      // if (this.isAlive && isFatherGrandfatherHusband(this.selectedRelationship)) {
      //   //392226
      //   const qn: Question = getQuestionForHeir(QuestionTypes.DISABLED); // change qn params on next step
      //   qn.value = false;
      //   this.createQuestionList(qn);
      // }
    } else {
      //Lumpsum
      if (!this.isDeathOrMissingDateInNewLaw) {
        //US: 403181
        this.annuityRelationShipList = disableLovItems(
          [RelationShipCode.GRAND_MOTHER, RelationShipCode.GRAND_DAUGHTER],
          this.annuityRelationShipList
        );
      }
      this.setWorkQuestion();
      this.setEventByMaritalStatus();
      this.setDisabledAndStudentQuestionForLumpsum();
      if (isFatherGrandfatherHusband(this.selectedRelationship)) {
        this.setFatherGrandFatherQuestions();
      }
      // if (isFemale(this.selectedRelationship)) {
      //Defect 519728
      // this.statusDate =
      //   this.dependentForm.get('maritalStatusDate') && this.dependentForm.get('maritalStatusDate').value
      //     ? moment(this.dependentForm.get('maritalStatusDate.gregorian').value)
      //     : null;
      // this.status = this.dependentForm.get('maritalStatus') ? this.dependentForm.get('maritalStatus').value : null;
      this.setWifeQuestions();
      // }
    }
    //Defect 512930
    if (this.isAlive && isFatherGrandfatherHusband(this.selectedRelationship)) {
      //392226
      const qn: Question = getQuestionForHeir(QuestionTypes.DISABLED); // change qn params on next step
      qn.value = false;
      // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator) {
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

  setWorkQuestion() {
    if (!getIsWifeUnborn(this.selectedRelationship) || this.events?.employmentEvents?.length) {
      //US: 393299, 416651, 393334
      const qn: Question = getQuestionForHeir(QuestionTypes.EMPLOYED); // change qn params on next step
      qn.minDate = moment(this.reasonForBenefit?.eventDate.gregorian).toDate();
      // qn.maxDate = this.requestDateInMoment.toDate();
      qn.maxDate = moment(this.systemRunDate?.gregorian).toDate();
      //Defect 627844 if ((this.events && this.events?.employmentEvents && this.events?.employmentEvents.length) || this.totalWage) {
      if ((this.events && this.events?.employmentEvents && this.events?.employmentEvents.length)) {
        qn.value = true;
        qn.disabled = true;
        qn.events = this.events?.employmentEvents;
      }
      this.createQuestionList(qn);
    }
  }

  setEventByMaritalStatus() {
    if (this.status && this.statusDate && this.maritalStatusEvents.includes(this.status.english)) {
      const qn: Question = getQuestionForHeir(EventsConstants.eventsOnlyText());
      qn.showAddeventButton = false;
      qn.events =
        this.selectedRelationship.code.toString() !== RelationShipCode.MOTHER && this.events?.maritalEvents
          ? [...this.events?.maritalEvents]
          : [];
      const marriageEvent = getEventsForMaritalStatus(
        this.status.english,
        {
          gregorian: this.statusDate.toDate()
        },
        this.eligibilityStartDateInDateFormat
      );
      const duplicateEvents = getDuplicateEvents(marriageEvent, qn.events);
      if (!duplicateEvents.length) qn.events?.push(marriageEvent);
      this.createQuestionList(qn);
    }
  }

  setMaritalQuesionAndEvents() {
    //US: 393318 396632 393328
    // lumpsum - oldest on or before eligibility date
    //  pension - latest
    // const oldestMaritalEvent = getOldestEventFromNicEvents(this.events?.maritalEvents);
    // if (oldestMaritalEvent && oldestMaritalEvent.eventType && oldestMaritalEvent.eventStartDate) {
    //   this.statusDate = moment(oldestMaritalEvent.eventStartDate.gregorian);
    //   // this.status = new EventTypeToMaritalStatus().getStatus(oldestMaritalEvent.eventType);
    //   this.status = oldestMaritalEvent.eventType;
    // }
    if (this.statusDate && this.statusDate.isSameOrBefore(this.eligibilityStartDateInDateFormat)) {
      const qn: Question = getQuestionForHeir(EventsConstants.eventsOnlyText());
      qn.value = true;
      qn.showAddeventButton = false;
      qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
      this.createQuestionList(qn);
    } else if (this.statusDate && this.statusDate.isAfter(this.eligibilityStartDateInDateFormat)) {
      if (this.status.english === MaritalValues.married) {
        const qn: Question = getQuestionForHeir(QuestionTypes.MARRIED);
        qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
        this.createQuestionList(qn);
      } else if (
        this.status.english === MaritalValues.widower ||
        (this.status.english === MaritalValues.divorcee &&
          !this.statusDate.isSame(this.eligibilityStartDateInDateFormat, 'd'))
      ) {
        const qn: Question = getQuestionForHeir(QuestionTypes.DIVORCED_OR_WIDOWED);
        qn.value = true;
        qn.addEventForAnswer = false;
        qn.events = this.events?.maritalEvents ? [...this.events?.maritalEvents] : [];
        this.createQuestionList(qn);
      }
    }
    this.setWifeQuestions();
  }

  setDisabledAndStudentQuestion() {
    if (isSonGrandsonBrotherOrphanson(this.selectedRelationship)) {
      //392228
      if (this.isAlive) {
        const qn = getQuestionForHeir(QuestionTypes.DISABLED); // change qn params on next step
        if (isHeirDisabled(this.dependentDetails.events) ||
          (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)
        ) {
          qn.disabled = true;
        }
        this.createQuestionList(qn);
      }
      if (this.getIsDeathOrMissingDateInLaw()) {
        let qn: Question;
        qn = getQuestionForHeir(QuestionTypes.STUDENT);
        qn.minDate = this.eligibilityStartDateInDateFormat.toDate();
        this.createQuestionList(qn);
      }
    }
  }

  setOrphanQuestion() {
    if (getIsSonDaughter(this.selectedRelationship)) {
      const eligibilityDate = moment(deepCopy(this.eligibilityStartDateInDateFormat));
      if (!this.isDeathOrMissingDateInNewLaw) {
        const qn: Question = getQuestionForHeir(QuestionTypes.ORPHAN); // change qn params on next step
        qn.value = false;
        qn.isQuesInfoRequired = true;
        qn.eventsCanbeAdded = false;
        qn.quesInfo = getQuesInfoForHeir(QuestionTypes.ORPHAN);
        qn.isQuesInfoRequired = true;
        this.createQuestionList(qn);
      }
      this.setMotherControl(eligibilityDate);
    }
  }

  setMotherControl(eligibilityDate) {
    if (
      this.birthdate.isAfter(this.eligibilityStartDateInDateFormat) &&
      this.birthdate.isBefore(eligibilityDate.add(10, 'M'))
    ) {
      //US: 376082
      const qn: Question = getQuestionForHeir(EventsConstants.controlsOnly()); // change qn params on next step
      qn.quesInfo = getQuesInfoForHeir(QuestionTypes.UNBORN);
      qn.inputControls = getControlsForHeir('motherId', '');
      qn.infoMessage = 'BENEFITS.SELECT-MOTHER-INFO-MSG';
      qn.dropDownList = this.mothersList;
      this.createQuestionList(qn);
    }
  }

  setDisabledAndStudentQuestionForLumpsum() {
    if (isSonGrandsonBrotherOrphanson(this.selectedRelationship)) {
      //US: 403183
      if (
          (this.isDeathOrMissingDateInNewLaw && this.ageOnEligibilityDate < 26 && this.ageOnEligibilityDate >= 21) ||
          (this.ageOnEligibilityDate < 25 && this.ageOnEligibilityDate >= 20)
      ) {
        const qn: Question = getLumpsumQuestionForHeir(QuestionTypes.STUDENT);
        qn.minDate = this.eligibilityStartDateInDateFormat.toDate();
        // qn.inputControls = getLumpsumControlsForHeir(
        //   QuestionTypes.STUDENT,
        //   this.eligibilityStartDateInDateFormat.toDate()
        // );
        this.createQuestionList(qn);
      }
      if (this.isAlive) {
        const qn: Question = getQuestionForHeir(QuestionTypes.DISABLED); // change qn params on next step
        // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator) {
        if (
            isHeirDisabled(this.dependentDetails.events) ||
            (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)
        ) {
          qn.disabled = true;
        }
        this.createQuestionList(qn);
      }
    }
  }

  setUpdateQuestionsForm() {
    if (this.update && this.updateFirstTime) {
      this.setPreselectedQuestionsAndControls(this.dependentDetails, this.questionsForm);
    }
  }

  setWifeQuestions() {
    if (this.selectedRelationship.code.toString() === RelationShipCode.WIFE) {
      //US: 393328, 416653, 396632
      // const eligibilityDate = moment(deepCopy(this.eligibilityStartDateInDateFormat));
      const eligibilityDate = moment(deepCopy(this.eligibilityStartDateInDateFormat));
      if (
        this.status.english === MaritalValues.widower &&
        this.statusDate.isSame(this.eligibilityStartDateInDateFormat, 'day') &&
        this.requestDateInMoment.isBefore(eligibilityDate.add(10, 'M'))
      ) {
        const qn: Question = getQuestionForHeir(QuestionTypes.PREGNANT);
        qn.value = this.dependentDetails?.pregnant || false;
        qn.eventsCanbeAdded = false;
        this.createQuestionList(qn);
      }
    }
  }

  getIsDeathOrMissingDateInNewLaw() {
    return (
      (this.isDeathOrMissingDateInNewLaw && this.ageOnEligibilityDate < 26 && this.hijiriAgeInMonths < 249) ||
      (!this.isDeathOrMissingDateInNewLaw &&
        this.isAgeInNewLaw(20) &&
        this.ageOnEligibilityDate < 25 &&
        this.hijiriAgeInMonths < 252) ||
      (!this.isDeathOrMissingDateInNewLaw &&
        !this.isAgeInNewLaw(20) &&
        this.ageOnEligibilityDate < 25 &&
        this.hijiriAgeInMonths < 240)
    );
  }

  getIsDeathOrMissingDateInLaw() {
    return (
      (
          this.isDeathOrMissingDateInNewLaw &&
          this.ageOnEligibilityDate < 26 &&
          this.hijiriAgeInMonths >= 249
      ) ||
      (!this.isDeathOrMissingDateInNewLaw &&
        this.isAgeInNewLaw(20) &&
        this.ageOnEligibilityDate < 25 &&
        this.hijiriAgeInMonths >= 252) ||
      (!this.isDeathOrMissingDateInNewLaw &&
        !this.isAgeInNewLaw(20) &&
        this.ageOnEligibilityDate < 25 &&
        this.hijiriAgeInMonths >= 240)
    );
  }

  setFatherGrandFatherQuestions() {
    //US: 403183
    if (this.ageOnEligibilityDate >= 60) {
      if (this.isPension) {
        const qn: Question = getQuestionForHeir(QuestionTypes.EMPLOYED);

        if (this.totalWage) {
          //If contributor has active wage
          qn.value = true;
          qn.disabled = true;
        }
        this.createQuestionList(qn);
      } else {
        const qn: Question = getLumpsumQuestionForHeir(QuestionTypes.EMPLOYED);
        // qn.value = true;
        this.createQuestionList(qn);
      }
      //Defect 512930
      // if (this.isAlive) {
      //   const qn: Question = getQuestionForHeir(QuestionTypes.DISABLED);
      //   qn.value = false;
      //   this.createQuestionList(qn);
      // }
    }
  }

  /**
   *
   * @param dependentDetails
   * When edit the added Heir
   */
  setPreselectedQuestionsAndControls(dependentDetails: DependentDetails, questionsForm: FormArray) {
    //TODO: set question, inputcontrols, events
    this.questions.forEach((eachQn, index) => {
      if (
        eachQn.key &&
        questionsForm?.at(index)?.get('key') &&
        eachQn.key === questionsForm.at(index).get('key').value
      ) {
        questionsForm?.at(index)?.get(eachQn.key).patchValue(getQuestionKeyValue(dependentDetails, eachQn));
        if (eachQn.key !== EventsConstants.eventsOnlyText()) {
          this.changeToggleForQuestion(
            eachQn,
            questionsForm?.at(index)?.get(eachQn.key).value,
            questionsForm?.at(index) as FormGroup
          );
        }
        if (eachQn.inputControls && eachQn.inputControls.length) {
          eachQn.inputControls.forEach((control, controlIndex) => {
            let value = dependentDetails[control.key];
            if (control.controlType === InputControlType.DROPDOWN) {
              const lov = eachQn.dropDownList.items.filter(item => item.code === value);
              value = lov[0].value;
            } else if (control.controlType === InputControlType.DATE && value.gregorian) {
              value.gregorian = moment(value.gregorian).toDate();
            }
            questionsForm
              .at(index)
              ?.get('inputControls')
              ['controls'].at(controlIndex)
              .get(control.key)
              .patchValue(value);
          });
        }
        this.setEventsInFormAndQnObject(dependentDetails, questionsForm, index, eachQn);
      }
    });
    this.updateFirstTime = false;
  }

  changeToggleForQuestion(question: Question, value: boolean, eachQuestionGrp: FormGroup) {
    this.disableSave = false;
    this.disableVerify = false;
    this.validateApiResponse = null;
    this.eligibilityStatusAfterValidation = null;
    this.eventErrorWithoutEventCategory = null;
    const yesOrNo = value ? BenefitValues.yes : BenefitValues.no;
    // this.isHeirDisabled = yesOrNo === BenefitValues.yes ? true : false;
    this.toggleSelected(question, yesOrNo, eachQuestionGrp);
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
      if (this.isPension) {
        // Defect 644165 prev code is without setWorkQn and events if (formControlName === QuestionTypes.EMPLOYED && !this.events.employmentEvents?.length) {
       /*  if (formControlName === QuestionTypes.EMPLOYED && this.events?.employmentEvents?.length) {
          this.setWorkQuestion();
          
          
        } */ 
         if (formControlName === QuestionTypes.ORPHAN) {
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
              // moment(this.systemRunDate?.gregorian).add(1, 'y').toDate()
            );
          }
        }
      } else {
        //is Lumpsum
        if (formControlName === QuestionTypes.EMPLOYED) {
          question.inputControls = getLumpsumControlsForHeir(
            QuestionTypes.EMPLOYED,
            '',
            this.eligibilityStartDateInDateFormat.toDate()
          );
        } else if (formControlName === QuestionTypes.STUDENT) {
          // Defect 488508 study start date not autopopulated fix
          question.inputControls = getLumpsumControlsForHeir(
            QuestionTypes.STUDENT,
            this.eligibilityStartDateInDateFormat.toDate(),
            null
          );
          const index = this.questions.findIndex(query => query.key === QuestionTypes.DISABLED);
          if (index >= 0) {
            this.questions.splice(index, 1);
            this.questionsForm.removeAt(index);
          }
        }
      }
      this.setEventForDisabled(question, formControlName, value);
    } else if (value === 'No') {
      if (question.addEventForAnswer === true) {
        eachQuestionGrp.removeControl('eventControls');
        question.events = [];
      }
      if (this.isPension) {
        if (formControlName === QuestionTypes.DISABLED) {
          eachQuestionGrp.removeControl('eventControls');
        } else if (formControlName === QuestionTypes.STUDENT) {
          question.inputControls = null;
          if (this.isAgeInNewLaw(25)) {
            question.infoMessage = 'BENEFITS.HEIR-SON-NEW-LAW-MSG';
          } else {
            question.infoMessage = 'BENEFITS.HEIR-SON-OLD-LAW-MSG';
          }
        }
      } else {
        //is Lumpsum
        if (formControlName === QuestionTypes.EMPLOYED) {
          eachQuestionGrp.removeControl('inputControls');
        }
        this.setEventForStudent(question, formControlName);
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

  setMonthlyWageQuestionEvents(question: Question, monthlyWageEvent: HeirEvent) {
    if (this.totalWage && getIndexOfAnEvent(question.events, monthlyWageEvent) < 0) {
      monthlyWageEvent.wage = this.totalWage;
      monthlyWageEvent.eventSource = EventsConstants.EVENT_SYSTEM;
      question.events ? question.events.push(monthlyWageEvent) : (question.events = [monthlyWageEvent]);
    }
  }

  setEventForDisabled(question: Question, formControlName: string, value: string) {
    if (formControlName === QuestionTypes.DISABLED) {
      // Applicable for both pension and Lumpsum
      if (value === 'Yes') {
        this.isHeirDisabled = true;
        const date = new GosiCalendar();
        date.gregorian = this.eligibilityStartDateInDateFormat.toDate();
        const event = getEventsForHeir(formControlName, date);
        const duplicateEvents = getDuplicateEvents(event[0], question.events);
        if (!duplicateEvents.length && !this.updateFirstTime) {
          question.events = event;
          question.showAddeventButton = false;
        }
      }
    } else {
      this.isHeirDisabled = false;
    }
  }

  setEventForStudent(question: Question, formControlName: string) {
    if (formControlName === QuestionTypes.STUDENT) {
      if (this.isDeathOrMissingDateInNewLaw) {
        question.infoMessage = 'BENEFITS.HEIR-LUMPSUM-SON-NEW-LAW-MSG';
      } else {
        question.infoMessage = 'BENEFITS.HEIR-LUMPSUM-SON-OLD-LAW-MSG';
      }
      const qnControl = this.questionsForm.controls.filter(
        control => control?.get('key').value === QuestionTypes.DISABLED
      );
      if (!qnControl.length && this.isAlive) {
        const qn: Question = getQuestionForHeir(QuestionTypes.DISABLED);
        qn.value = false;
        // if(isHeirDisabled(this.dependentDetails.events) || this.isValidator) {
        if (isHeirDisabled(this.dependentDetails.events) ||
          (this.routerData.assignedRole === Role.VALIDATOR_1 && !this.isDraft)
        ) {
          qn.disabled = true;
        }
        this.createQuestionList(qn);
        this.questionsForm = this.createQuestionForm();
        if (this.update) {
          this.setPreselectedQuestionsAndControls(this.dependentDetails, this.questionsForm);
        }
      }
    }
  }

  // setEventForMarried(question: Question, eachQuestionGrp: FormGroup) {
  //   if (
  //     [QuestionTypes.MARRIED, QuestionTypes.DIVORCED_OR_WIDOWED, QuestionTypes.MARRIED_WIFE].includes(question.key as QuestionTypes) &&
  //     question.eventsCanbeAdded) {
  //     const maritalStatus = this.status;
  //     const maritalStatusDate = {gregorian: this.statusDate.toDate()};
  //     const marriageEvent = getEventsForMaritalStatus(
  //       maritalStatus.english,
  //       maritalStatusDate,
  //       this.eligibilityStartDateInDateFormat
  //     );
  //     if (eachQuestionGrp?.get(question.key)?.value === question.addEventForAnswer) {
  //       if (this.events?.maritalEvents) {
  //         this.events?.maritalEvents.forEach(event => {
  //           if (!getDuplicateEvents(event, question.events).length) question.events.push(event);
  //         })
  //         // question.events = question.events.length ? [...question.events, ...this.events?.maritalEvents] : [...this.events?.maritalEvents];
  //       }
  //       setMariatalEvent(question, marriageEvent, this.questions);
  //       //Delete events from event only key
  //       deleteNonRemovableEvent(this.questions, marriageEvent);
  //       // question.events.forEach(events => events.manualEvent = true);
  //     } else {
  //       const index = this.questions.findIndex(qn => qn.key === EventsConstants.eventsOnlyText());
  //       if (index >= 0) {
  //         if (this.events?.maritalEvents) {
  //           this.events?.maritalEvents.forEach(event => {
  //             if (!getDuplicateEvents(event, this.questions[index].events).length)
  //               this.questions[index]?.events?.push(event);
  //           });
  //           // this.questions[index].events = this.questions[index].events.length ? [...this.questions[index].events, ...this.events?.maritalEvents] : [...this.events?.maritalEvents];
  //         }
  //         if (marriageEvent) {
  //           const duplicateEvents = getDuplicateEvents(marriageEvent, this.questions[index].events);
  //           if (!duplicateEvents.length) this.questions[index]?.events?.push(marriageEvent);
  //         }
  //       }
  //     }
  //   }
  // }

  checkAlive() {
    const grp = this.fb.group({
      gregorian: [null, { updateOn: 'blur', validators: Validators.compose([Validators.required]) }],
      hijiri: [null, { updateOn: 'blur' }]
    });
    if (this.dependentForm.get('checkBoxForAlive')?.value) {
      this.isAlive = false;
      this.dependentForm.addControl('deathDate', grp);
      this.selectRelationShipForHeir(this.selectedRelationship);
    } else {
      this.isAlive = true;
      this.dependentForm.removeControl('deathDate');
      this.depHeirDeadBeforeEligibility = null;
      this.dependentDetails.deathDate = null;
      this.depHeirDeathDate = null;
      this.selectRelationShipForHeir(this.selectedRelationship);
    }
  }

  watchForms() {
    const payeeForm = this.parentForm?.get('payeeForm')?.valueChanges?.subscribe(form => {
      if (!this.parentForm.get('payeeForm').pristine) {
        this.disableSave = false;
        payeeForm.unsubscribe();
      }
    });
    const bankForm = this.parentForm?.get('payeeForm.bankAccount')?.valueChanges?.subscribe(form => {
      if (!this.parentForm.get('payeeForm.bankAccount').pristine) {
        this.disableSave = false;
        bankForm.unsubscribe();
      }
    });
    const annualNotificaionForm = this.parentForm?.get('extendAnnualNotification')?.valueChanges?.subscribe(form => {
      if (!this.parentForm.get('extendAnnualNotification').pristine) {
        this.disableSave = false;
        annualNotificaionForm.unsubscribe();
      }
    });
  }

  setValues() {
    this.maxDate = moment(new Date()).toDate();
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    Object.assign(this.dependentDetailsBeforeValidation, this.dependentDetails);
    this.eligibilityStatusAfterValidation = getEligibilityStatusForHeirPensionLumpsumFromValidateApi(
      this.dependentDetails.eligibilityList || [],
      this.dependentDetails.valid,
      this.benefitType,
      this.systemRunDate
    );
    if (
      this.reasonForBenefit?.reason?.english === BenefitValues.deathOfTheContributor ||
      this.reasonForBenefit?.reason?.english === BenefitValues.ohDeathOfTheContributor
    ) {
      this.reason = 'BENEFITS.CONTRIBUTOR-DEATH-DATE';
    }
    if (
      this.reasonForBenefit?.reason?.english === BenefitValues.missingContributor ||
      this.reasonForBenefit?.reason?.english === BenefitValues.ohMissingContributor
    ) {
      this.reason = 'BENEFITS.CONTRIBUTOR-MISSING-DATE';
    }
    this.isHeirLumpsum = isHeirLumpsum(this.benefitType);
    if (this.update) {
      // this.getEvents.emit(this.dependentDetails.personId);
      this.disableSave = true;
      this.disableVerify = true;
      const qnForm = this.questionsForm.valueChanges.subscribe(qn => {
        if (!this.questionsForm.pristine) {
          this.disableVerify = false;
          this.disableSave = false;
          qnForm.unsubscribe();
        }
      });

      const contactForm = this.contactForm.valueChanges.subscribe(form => {
        if (!this.contactForm.pristine) {
          this.disableSave = false;
          contactForm.unsubscribe();
        }
      });
      const dependentForm = this.dependentForm.valueChanges.subscribe(form => {
        if (!this.dependentForm.pristine) {
          this.disableVerify = false;
          this.disableSave = false;
          dependentForm.unsubscribe();
        }
      });
      if(this.dependentDetails?.showMandatoryDetails && (this.disableVerify || this.disableSave)) {
        this.disableVerify = false;
        this.disableSave = false;
      }  
    }
  }

  maritalStatusDateChanged() {
    this.setStatusAndDate();
    // if (
    //   this.dependentForm.get('maritalStatusDate').valid
    // ) {
    // &&
    //   (!this.statusDate ||
    //     !this.statusDate.isSame(moment(this.dependentForm.getRawValue().maritalStatusDate?.gregorian)))
    if (this.statusDate) {
      this.maritalStatusDateUpdatedFromUi = true;
      this.dependentForm.get('maritalStatusDate.gregorian').patchValue(startOfDay(this.statusDate.toDate()));
      this.selectRelationShipForHeir(this.selectedRelationship, true);
    }
    // }
  }
}
