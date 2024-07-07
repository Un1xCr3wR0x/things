/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import moment, { Moment } from 'moment';
import { EventsConstants } from '../constants';
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { Question, Control, HeirEvent, DependentDetails } from '../models';
import { EventCategory, EventsType, QuestionTypes, InputControlType, MaritalValues } from '../enum';
import { getDuplicateEvents, getEventFromEventsAfterDelete, sortEventAscending } from './eventsUtils';
import { deepCopy } from './benefitUtil';

/**
 *
 * @param qnType Get Question based on relation ship
 */
export const getQuestionForHeir = function (qnType?: string): Question {
  switch (qnType) {
    case QuestionTypes.MARRIED:
      return new Question(QuestionTypes.MARRIED, 'BENEFITS.HAS-HEIR-MARRIED');
    case QuestionTypes.DIVORCED_OR_WIDOWED:
      return new Question(QuestionTypes.MARRIED, 'BENEFITS.HAS-HEIR-MARRIED-WIDOW-DIVORCEE');
    case QuestionTypes.DISABLED:
      return new Question(QuestionTypes.DISABLED, 'BENEFITS.IS-HEIR-DISABLED', null, null, true, false);
    case QuestionTypes.EMPLOYED:
      return new Question(
        QuestionTypes.EMPLOYED,
        'BENEFITS.HAS-HEIR-EMPLOYED',
        'BENEFITS.HAS-HEIR-EMPLOYED-ARABIC-FEMALE'
      );
    case QuestionTypes.STUDENT:
      return new Question(QuestionTypes.STUDENT, 'BENEFITS.HAS-HEIR-STUDENT', null, null, true, false);
    case QuestionTypes.ORPHAN:
      return new Question(QuestionTypes.ORPHAN, 'BENEFITS.HEIR-ORPHAN');
    case 'missing':
      return new Question('missing', 'BENEFITS.IS-HEIR-MISSING');
    case QuestionTypes.PREGNANT:
      return new Question(QuestionTypes.PREGNANT, 'BENEFITS.IS-HEIR-CURRENTLY-PREGNANT');
    case QuestionTypes.REFORM_WIDOWED:
      return new Question(QuestionTypes.REFORM_WIDOWED, 'BENEFITS.REFORM-HEIR-WIDOW');
    default:
      return new Question(qnType || null, null);
  }
};

export const getLumpsumQuestionForHeir = function (qnType?: string): Question {
  switch (qnType) {
    case QuestionTypes.STUDENT:
      return new Question(QuestionTypes.STUDENT, 'BENEFITS.WAS-HEIR-STUDENT', null, null, true, false);
    case QuestionTypes.EMPLOYED:
      //TODO: Arabic for this label
      return new Question(QuestionTypes.EMPLOYED, 'BENEFITS.HEIR-LUMPSUM-EMPLOYED');

    default:
      return new Question(qnType || null, null);
  }
};

export const getQuesInfoForHeir = function (qnType: string): string {
  switch (qnType) {
    case QuestionTypes.ORPHAN:
      return 'BENEFITS.INFO-MESSAGE-ORPHAN';
    default:
      return '';
  }
};

// export const getEventsForHeir = function (type: string, eventDate: GosiCalendar): HeirEvent[] {
//   switch (type) {
//     case QuestionTypes.DISABLED:
//       return [new HeirEvent(EventsConstants.BEGINNING_OF_DISABILITY, eventDate, false, type)];
//   }
// };
//
// export const getDuplicateEvents = function (event: HeirEvent, events: HeirEvent[] = []): HeirEvent[] {
//   return events.filter(eachEvent => {
//     return (
//       eachEvent.eventType &&
//       eachEvent.eventType.english === event?.eventType?.english &&
//       moment(eachEvent.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day')
//     );
//   });
// };
//
// export const removeDuplicateEvents = function (events: HeirEvent[] = []) {
//   const result = events;
//   for (var i = 0; i <= events?.length; i++) {
//     for (var j = i + 1; j <= events?.length; j++) {
//       if (result[i]?.eventType.english == result[j]?.eventType.english) {
//         result.splice(i, 1);
//       }
//     }
//   }
//   return result;
// };
//
// export const getEventsForDependent = function (type: string, eventDate: GosiCalendar): HeirEvent[] {
//   switch (type) {
//     case QuestionTypes.DISABLED:
//       return [new HeirEvent(EventsConstants.BEGINNING_OF_DISABILITY, eventDate, false, type)];
//   }
// };
//
// export const addEventToQuestion = function (questions: Question[] = [], event: HeirEvent, eventKey: string) {
//   const eventIndex = questions.findIndex(eachQn => eachQn.key === eventKey);
//   questions[eventIndex].events.push(event[0]);
// };
//
// export const removeEventFromQuestion = function (questions: Question[] = [], event: HeirEvent, eventKey: string) {
//   const eventIndex = questions.findIndex(eachQn => eachQn.key === eventKey);
//   const eventToRemoveIndex = questions[eventIndex].events.findIndex(eachEvent => {
//     return (
//       eachEvent.eventCategory === event[0].eventCategory &&
//       moment(eachEvent.eventStartDate.gregorian).isSame(event[0].eventStartDate.gregorian)
//     );
//   });
//   questions[eventIndex].events.splice(eventToRemoveIndex, 1);
// };

export const getLumpsumControlsForHeir = function (
  qnType: string,
  defaultValue: boolean | string | Date,
  maxDate?: Date,
  minDate?: Date
): Control[] {
  switch (qnType) {
    case QuestionTypes.STUDENT:
      return [
        new Control('studyStartDate', 'BENEFITS.STUDY_START_DATE', defaultValue, 'date', true, maxDate, minDate, true)
      ];
    case QuestionTypes.EMPLOYED:
      // return [
      //   new Control(
      //     'employmentStartDate',
      //     'BENEFITS.EMPLOYEMENT-START-DATE',
      //     defaultValue,
      //     'date',
      //     true,
      //     maxDate,
      //     minDate
      //   )
      // ];
  }
};

export const getControlsForHeir = function (
  qnType: string,
  defaultValue: boolean | string | Date | BilingualText,
  maxDate?: Date,
  minDate?: Date
): Control[] {
  // let maxNotificationDate = moment(this.systemRunDate?.gregorian).add(1, 'y').toDate();
  switch (qnType) {
    case QuestionTypes.DISABLED:
      return [
        new Control('disabilityDescription', 'BENEFITS.DESCRIBE-DISABILITY', defaultValue, InputControlType.TEXT)
        // new Control('disabilityStartDate', 'BENEFITS.DISABILITY_START_DATE', new Date(), 'date')
      ];
    case QuestionTypes.STUDENT:
      return [
        // No study start date needed
        // new Control('studyStartDate', 'BENEFITS.STUDY_START_DATE', '', 'date'),
        new Control(
          'notificationDate',
          'BENEFITS.ANNUAL-NOTIFICATION-DATE-STUDENT',
          defaultValue,
          InputControlType.DATE,
          false,
          maxDate,
          minDate,
          false,
          true
        )
      ];
    case QuestionTypes.EMPLOYED:
      return [new Control('monthlyWage', 'BENEFITS.HEIR-MONTHLY-WAGE', defaultValue, InputControlType.TEXT, true)];
    case QuestionTypes.ORPHAN:
      return [
        new Control('orphanDate', 'BENEFITS.ORPHAN-DATE', defaultValue, InputControlType.DATE, false, maxDate, minDate)
      ];
    case 'motherId':
      return [new Control('motherId', 'BENEFITS.SELECT-MOTHER', defaultValue, InputControlType.DROPDOWN, true)];
  }
};

export const getQuestionForDependent = function (qnType?: string): Question {
  switch (qnType) {
    case QuestionTypes.MARRIED:
      return new Question(QuestionTypes.MARRIED, 'BENEFITS.HAS-DEPENDENT-MARRIED');
    case QuestionTypes.DIVORCED_OR_WIDOWED:
      return new Question(QuestionTypes.DIVORCED_OR_WIDOWED, 'BENEFITS.HAS-DEPENDENT-MARRIED-WIDOW-DIVORCEE');
    case QuestionTypes.MARRIED_WIFE:
      return new Question(QuestionTypes.MARRIED_WIFE, 'BENEFITS.HAS-DEPENDENT-MARRIED-WIFE');
    case QuestionTypes.DISABLED:
      return new Question(QuestionTypes.DISABLED, 'BENEFITS.IS-DEPENDENT-DISABLED');
    //  <-------------- no employement qn for dependent ------------------>
    case QuestionTypes.STUDENT:
      return new Question(QuestionTypes.STUDENT, 'BENEFITS.HAS-DEPENDENT-STUDENT');
    default:
      //Mainly for marriage events
      return new Question(qnType || null, null);
  }
};

export const getControlsForDependent = function (qnType: string): Control[] {
  //If changes in control update in setValidatedValues function and update() funtion in base
  let maxDate = new Date();
  maxDate = moment(new Date()).toDate();
  switch (qnType) {
    case QuestionTypes.STUDENT:
      return [new Control('studyStartDate', 'BENEFITS.STUDY_START_DATE', '', 'date', false, maxDate)];
    case QuestionTypes.EMPLOYED:
      return [new Control('monthlyWage', 'BENEFITS.HEIR-MONTHLY-WAGE', '', 'text', true)];
  }
};

export const getTheQuestion = function (qns: Question[], qn: Question): Array<Question> {
  //if doing changes to this filter do consider toQuestionsFormArray filter changes also
  // return qns.filter(eachQn => eachQn.key === qn.key);
  return qns.filter(eachQn => Object.is(eachQn, qn));
};

export const toQuestionsFormArray = function (questions: Question[], qnForm: FormArray = new FormArray([])): FormArray {
  //questions length and qnForm length should be same
  const formArray = qnForm;
  const qns = deepCopy(questions);
  qns.forEach(question => {
    //Checking if there is any duplicate questions
    if (question.key) {
      const qnControl = qnForm.controls.filter(
        control =>
          control?.get('key').value === question.key &&
          control?.get('label').value === question.label &&
          question.key !== EventsConstants.eventsOnlyText()
      );
      if (!qnControl.length) {
        const group: any = {};
        group['key'] = new FormControl(question.key);
        group['label'] = new FormControl(question.label);
        group[question.key] = question.required
          ? new FormControl(question.value, Validators.required)
          : new FormControl(question.value);
        if (question.inputControls?.length) {
          group['inputControls'] = createControlsForm(question);
        }
        group['eventControls'] = question.events?.length ? getEventsFormArray(question.events) : new FormArray([]);
        formArray.push(new FormGroup(group));
      }
    }
    // else {
    //   formArray.push(new FormGroup({}));
    // }
  });
  return formArray;
};

export const createControlsForm = function (question: Question): FormArray {
  if (question.inputControls?.length) {
    // Get input controls
    const controlsFormArray = new FormArray([]);
    question.inputControls.forEach(control => {
      const group = {};
      if (control.controlType === InputControlType.TEXT) {
        group[control.key] = control.required
          ? new FormControl(control.value || '', [Validators.required, Validators.pattern(control.pattern)])
          : new FormControl(control.value || '');
      } else if (control.controlType === InputControlType.DATE) {
        group[control.key] = new FormGroup({
          gregorian: control.required
            ? new FormControl(control.value || null, Validators.required)
            : new FormControl(control.value || null),
          hijiri: new FormControl()
        });
      } else if (control.controlType === InputControlType.DROPDOWN) {
        group[control.key] = new FormGroup({
          english: control.required
            ? new FormControl(control.value || '', Validators.required)
            : new FormControl(control.value || ''),
          arabic: new FormControl()
        });
      }
      controlsFormArray.push(new FormGroup(group));
    });
    return controlsFormArray;
  }
};

export const getControlFormsArray = function (control: Control) {
  const controlsFormArray = new FormArray([]);
  const group = {};
  if (control.controlType === InputControlType.TEXT) {
    group[control.key] = control.required
      ? new FormControl(control.value || '', Validators.required)
      : new FormControl(control.value || '');
  } else if (control.controlType === InputControlType.DATE) {
    group[control.key] = new FormGroup({
      gregorian: control.required
        ? new FormControl(control.value || '', Validators.required)
        : new FormControl(control.value || ''),
      hijiri: new FormControl()
    });
  }

  controlsFormArray.push(new FormGroup(group));
};

export const getEventsFormArray = function (events: HeirEvent[]): FormArray {
  const eventsFormArray = new FormArray([]);
  events.forEach(event => {
    eventsFormArray.push(new FormControl(event));
  });
  return eventsFormArray;
};

export const getEventsFormArrayForKey = function (events: HeirEvent[], key: string): FormArray {
  const eventsFormArray = new FormArray([]);
  events?.forEach(event => {
    if (event.eventCategory === EventCategory[key]) {
      eventsFormArray.push(new FormControl(event));
    }
  });
  return eventsFormArray;
};

export const getEventsForMaritalStatus = function (maritalStatus: string, date: GosiCalendar, eligibilityDate: Moment) {
  let event: HeirEvent;
  const maritalStatusDate = moment(date.gregorian);
  const eventDate = maritalStatusDate.isSameOrBefore(eligibilityDate) ? eligibilityDate : maritalStatusDate;
  switch (maritalStatus) {
    case MaritalValues.married:
      event = new HeirEvent(EventsConstants.MARRIED, { gregorian: eventDate.toDate() }, false, QuestionTypes.MARRIED);
      break;
    case MaritalValues.widower:
      event = new HeirEvent(EventsConstants.WIDOWHOOD, { gregorian: eventDate.toDate() }, false, QuestionTypes.MARRIED);
      break;
    case MaritalValues.divorcee:
      event = new HeirEvent(EventsConstants.DIVORCE, { gregorian: eventDate.toDate() }, false, QuestionTypes.MARRIED);
      break;
  }
  return event;
};

// export const deleteNonRemovableEvent = function (questions: Question[], event: HeirEvent) {
//   questions.forEach(element => {
//     if (element.key === EventsConstants.eventsOnlyText()) {
//       element.events = element?.events?.filter(eachEvent => {
//         !eachEvent.eventCanBeDeleted &&
//           eachEvent.eventCategory &&
//           eachEvent.eventCategory === event.eventCategory &&
//           moment(eachEvent.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day');
//       });
//     }
//   });
// };
//
// export const getEventFromEventsAfterDelete = function (events: HeirEvent[] = [], event: HeirEvent) {
//   return events.filter(eachEvent => {
//     return eachEvent.eventCategory &&
//       eachEvent.eventCategory !== event.eventCategory &&
//       !moment(eachEvent.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day');
//   });
// };

export const deleteQuestionFromQuestionsAndForm = function (
  question: Question,
  questionsList: Question[],
  formArray: FormArray
) {
  const index = questionsList.findIndex(value => value.key === question.key);
  if (index < 0) return;
  questionsList.splice(index, 1);
  formArray.removeAt(index);
  return { qns: questionsList, frmGrp: formArray };
};

// export const getEventsInPeriod = function (events: HeirEvent[] = [], startDate: GosiCalendar, endDate: GosiCalendar) {
//   const startDateObj = moment(startDate.gregorian);
//   return events.filter(eachEvent => {
//     return moment(eachEvent.eventStartDate.gregorian).isSameOrAfter(startDateObj);
//   });
// };

export const hasOddBeginningOfStudyEvent = function (events: HeirEvent[] = []): HeirEvent {
  const sortedEvents = sortEventAscending(events);
  const beginningOfStudy = sortedEvents.filter(event => event.eventType?.english === EventsType.BEGINNING_OF_STUDY);
  const endOfStudy = sortedEvents.filter(event => event.eventType.english === EventsType.END_OF_STUDY);
  if (beginningOfStudy.length === endOfStudy.length) {
    return;
  } else {
    return beginningOfStudy[beginningOfStudy.length - 1];
  }
};

export const addEventToEventsOnlyQuestion = function (questions: Question[], eventToBeAdded: HeirEvent): Question[] {
  const index = questions.findIndex(qn => qn.key === EventsConstants.eventsOnlyText());
  if (index >= 0 && eventToBeAdded) {
    const duplicateEvents = getDuplicateEvents(eventToBeAdded, questions[index].events);
    if (!duplicateEvents.length) {
      if (questions[index]?.events) {
        questions[index]?.events?.push(eventToBeAdded);
      } else {
        questions[index].events = [eventToBeAdded];
      }
    }
  }
  return questions;
};

export const removeEventForQuestionKeyFromQuestions = function (
  eventToBeRemoved: HeirEvent,
  questions: Question[],
  questionKey: string
): Question[] {
  const index = questions.findIndex(qn => qn.key === questionKey);
  const duplicateEvents = getDuplicateEvents(eventToBeRemoved, questions[index].events);
  if (index >= 0 && eventToBeRemoved && duplicateEvents.length) {
    questions[index].events = getEventFromEventsAfterDelete(questions[index].events, eventToBeRemoved);
  }
  return questions;
};

export const removeEventsAddedFromCurrentSession = function (questions: Question[], question: Question) {
  const index = questions.findIndex(item => item.key === question.key);
  if (index >= 0) {
    questions[index].events = questions[index].events.filter(item => !item.eventAddedFromUi);
  }
  return questions;
};

// export const getEventsForCategory = function (events: HeirEvent[], eventCategory: string) {
//   return events.filter(item => item.eventCategory === eventCategory);
// }

export const getAllEventsFromQuestions = function (questions: Question[]) {
  return questions.reduce((events, question) => {
    return [...events, ...(question.events || [])];
  }, []);
};

// export const findOddEvent = function (event1: HeirEvent[], event2: HeirEvent[]) {
//   return event1.filter(object1 => {
//     return !event2.some(object2 => {
//       return object1.eventCategory === object2.eventCategory && moment(object1.eventStartDate.gregorian).isSame(moment(object2.eventStartDate.gregorian), 'day');
//     });
//   });
// }

export const getQuestionKeyValue = function (dependentDetails: DependentDetails, eachQn: Question) {
  if (dependentDetails[eachQn.key] !== null && dependentDetails[eachQn.key] !== undefined) {
    return dependentDetails[eachQn.key];
  } else if (eachQn.value !== null && eachQn.value !== undefined) {
    return eachQn.value;
  } else {
    return false;
  }
};

/*
* @param qnType Get Question based on relation ship
*/
export const getQuestionForHeirReform = function (qnType?: string): Question {
  switch (qnType) {
    case QuestionTypes.MARRIED:
      return new Question(QuestionTypes.MARRIED, 'BENEFITS.HAS-HEIR-MARRIED');
    case QuestionTypes.DISABLED:
      return new Question(QuestionTypes.DISABLED, 'BENEFITS.IS-HEIR-DISABLED', null, null, true, false);
    case QuestionTypes.STUDENT:
      return new Question(QuestionTypes.STUDENT, 'BENEFITS.HAS-HEIR-STUDENT', null, null, true, false);
    case QuestionTypes.ORPHAN:
      return new Question(QuestionTypes.ORPHAN, 'BENEFITS.HEIR-ORPHAN');
    case 'missing':
      return new Question('missing', 'BENEFITS.IS-HEIR-MISSING');
    case QuestionTypes.PREGNANT:
      return new Question(QuestionTypes.PREGNANT, 'BENEFITS.IS-HEIR-CURRENTLY-PREGNANT');
    case QuestionTypes.REFORM_WIDOWED:
      return new Question(QuestionTypes.REFORM_WIDOWED, 'BENEFITS.REFORM-HEIR-WIDOW');
    default:
      return new Question(qnType || null, null);
  }
};

