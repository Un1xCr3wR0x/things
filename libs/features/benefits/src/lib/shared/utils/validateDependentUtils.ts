/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DependentDetails, DependentModify } from '../models/dependent-details';
import { FormArray, FormGroup } from '@angular/forms';
import { GosiCalendar, startOfDay } from '@gosi-ui/core';
import { HeirEvent, Question } from '../models/questions';
import {
  HeirTransactionIdValidator,
  HeirTransactionId,
  DependentTransactionIdValidator,
  DependentTransactionId
} from '../constants/transactionTypeId-constants';
import { getDuplicateEvents } from './eventsUtils';
import { deepCopy } from './benefitUtil';
import { ActionType } from '../enum';
import { EventValidated } from '../models/event';
import moment from 'moment-timezone';

export const getObjForValidate = function (list: DependentDetails[], skipPersonIds = []): DependentModify[] {
  const arrayOfDependents: DependentModify[] = [];
  list?.forEach(eachDep => {
    if (!skipPersonIds.includes(eachDep.personId) && eachDep.personId) {
      const tempDependentValidateObj = new DependentModify();
      tempDependentValidateObj.assignValues(eachDep);
      arrayOfDependents.push(tempDependentValidateObj);
    }
  });
  list?.forEach(eachDep => {
    if (eachDep.nonSaudiHeirAdded) {
      const tempDependentValidateObj = new DependentModify();
      tempDependentValidateObj.assignValues(eachDep);
      arrayOfDependents.push(tempDependentValidateObj);
    }
  });
  return arrayOfDependents;
};

export const getStatusDate = function (form: FormGroup): GosiCalendar {
  let date = null;
  const studyStartDate = form.get('studyStartDate') ? form.get('studyStartDate').value : null;
  const disabilityStartDate = form.get('disabilityStartDate') ? form.get('disabilityStartDate').value : null;
  if (studyStartDate) {
    date = new GosiCalendar();
    date.gregorian = startOfDay(studyStartDate?.gregorian);
    date.hijiri = studyStartDate?.hijiri;
  } else if (disabilityStartDate) {
    date = new GosiCalendar();
    date.gregorian = startOfDay(disabilityStartDate?.gregorian);
    date.hijiri = disabilityStartDate?.hijiri;
  }
  return date;
};

export const setMariatalEvent = function (question: Question, marriageEvent: HeirEvent, allQuestions: Question[]) {
  const duplicateEvents = getDuplicateEvents(marriageEvent, question.events);
  if (!duplicateEvents.length && question.events) {
    const eventClone = deepCopy(question.events);
    eventClone.push(marriageEvent);
    question.events = eventClone;
  }
};

export const getTransactionTypeOrId = function (isHeir: boolean, actionType: string, isValidator: boolean): string {
  if (isHeir) {
    if (isValidator) {
      return HeirTransactionIdValidator[actionType];
    } else {
      return HeirTransactionId[actionType];
    }
  } else {
    if (isValidator) {
      return DependentTransactionIdValidator[actionType];
    } else {
      return DependentTransactionId[actionType];
    }
  }
};

export const getObjForValidateUnborn = function (list: DependentDetails[], skipMotherIds = []): DependentModify[] {
  const arrayOfDependents: DependentModify[] = [];
  list?.forEach(eachDep => {
    if (!skipMotherIds.includes(eachDep.motherId)) {
      const tempDependentValidateObj = new DependentModify();
      tempDependentValidateObj.assignValues(eachDep);
      arrayOfDependents.push(tempDependentValidateObj);
    }
  });
  return arrayOfDependents;
};

export const hasValidModifiedEventsAfterOdmRemove = function (
  validateEvents: EventValidated[] = [],
  addedEvents: HeirEvent[] = []
) {
  const events = filterOutOdmRemovedEventsFromEvents(validateEvents, addedEvents);
  return events.filter(
    event =>
      event.actionType === ActionType.MODIFY ||
      event.actionType === ActionType.REMOVE ||
      event.actionType === ActionType.ADD
  ).length;
};

export const filterOutOdmRemovedEventsFromEvents = function (
  validateEvents: Array<EventValidated | HeirEvent> = [],
  addedEvents: HeirEvent[] = []
): Array<HeirEvent | EventValidated> {
  if (addedEvents.length) {
    return addedEvents.filter(event => {
      return !validateEvents.find(item => {
        return (
          item.actionType === ActionType.ODM_REMOVE &&
          moment(item.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian)) &&
          item.eventType.english === event.eventType.english
        );
      });
    });
  } else {
    return validateEvents.filter(item => {
      return item.actionType !== ActionType.ODM_REMOVE;
    });
  }
};

export const modifyEventsAfterOdmValidation = function (
  questionFormsArray: FormArray,
  validatedEvents: EventValidated[]
) {
  questionFormsArray.controls.forEach(eachQuestionGrp => {
    const eventControls = eachQuestionGrp.get('eventControls') as FormArray;
    if (eventControls) {
      eventControls.controls.map(eachEventControl => {
        const odmModifiedEvent = validatedEvents.find(
          item =>
            (item.startDateModified &&
              item.eventType?.english === eachEventControl.value.eventType?.english &&
              moment(item.originalEventDate.gregorian).isSame(
                moment(eachEventControl.value.eventStartDate.gregorian),
                'day'
              )) ||
            (item.actionType === ActionType.ODM_REMOVE &&
              item.eventType?.english === eachEventControl.value.eventType?.english &&
              moment(item.eventStartDate.gregorian).isSame(
                moment(eachEventControl.value.eventStartDate.gregorian),
                'day'
              ))
        );
        if (odmModifiedEvent) {
          eachEventControl.value['odmRemovedEvent'] = odmModifiedEvent.actionType === ActionType.ODM_REMOVE;
          eachEventControl.value.message = odmModifiedEvent.message;
          eachEventControl.value['startDateModified'] = odmModifiedEvent.startDateModified;
          eachEventControl.value['originalEventDate'] = odmModifiedEvent.originalEventDate;
          // eachEventControl.value.actionType = ActionType.ODM_REMOVE;
          // eachEventControl.value["startDateModified"] = true;
          // eachEventControl.value["originalEventDate"] = moment().toDate();
        }
        return eachEventControl;
      });
    }
  });
};

export const hasOdmAddedEventForHeirAdd = function (heir: DependentDetails, events: EventValidated[] = []) {
  if (heir.actionType === ActionType.ADD) {
    if (
      events.filter(item => {
        return item.actionType === ActionType.ADD;
      }).length
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
