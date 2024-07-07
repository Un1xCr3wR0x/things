/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {BilingualText, GosiCalendar, Lov, LovList} from '@gosi-ui/core';
import { EventValidated, HeirEvent, Question, ReCalculationDetails } from '../models';
import { ActionType, DependentEventSource } from '../enum';
import moment from 'moment';
import { EventCategory, QuestionTypes } from '../enum';
import { deepCopy } from '../utils/benefitUtil';
import { EventsConstants } from '../constants';
import {BehaviorSubject, Observable} from "rxjs";

export const getMandatoryEventsAdded = function (arr1: BilingualText[], arr2: HeirEvent[]) {
  let res = [];
  res = arr1.filter(el => {
    return arr2.find(element => {
      // return Object.is(el.eventType, element);
      return el.english === element.eventType.english;
    });
  });
  return res;
};

export const getLatestEventFromResponse = function (validatedEvents: EventValidated[] = []): EventValidated[] {
  return validatedEvents?.filter(event => !event?.eventEndDate);
};

export const getOldestEventFromResponse = function (
  validatedEvents: Array<EventValidated | HeirEvent> = []
): EventValidated | HeirEvent {
  const sorted = validatedEvents.sort(function (a, b) {
    const dateA = new Date(a.eventStartDate.gregorian).getTime();
    const dateB = new Date(b.eventStartDate.gregorian).getTime();
    return dateA < dateB ? -1 : 1; // ? -1 : 1 for ascending/increasing order
  });
  return sorted.length ? sorted[0] : null;
};

export const getOldestEventFromNicEvents = function (validatedEvents: HeirEvent[] = []): EventValidated | HeirEvent {
  const sorted = sortEventAscending(validatedEvents);
  return sorted.length ? sorted[0] : null;
};

export const sortEventAscending = function (events: Array<EventValidated | HeirEvent>) {
  return events.sort(function (a, b) {
    const dateA = new Date(a.eventStartDate.gregorian).getTime();
    const dateB = new Date(b.eventStartDate.gregorian).getTime();
    return dateA < dateB ? -1 : 1; // ? -1 : 1 for ascending/increasing order
  });
};

export const sortEventDecending = function (
  events: Array<EventValidated | HeirEvent>
): Array<EventValidated | HeirEvent> {
  return events.sort(function (a, b) {
    const dateA = new Date(a.eventStartDate?.gregorian).getTime();
    const dateB = new Date(b.eventStartDate?.gregorian).getTime();
    if (dateA == dateB) {
      return a?.eventEndDate == null ? -1 : 1;
    } else {
      return dateA > dateB ? -1 : 1; // ? -1 : 1 for descending/decreasing
    }
  });
};

export const getValidEventsExceptLatest = function (validatedEvents: EventValidated[] = []): EventValidated[] {
  return validatedEvents?.filter(event => event?.eventEndDate && event?.valid);
};

export const getTypesOfEventsAfterDate = function (
  events: Array<EventValidated | HeirEvent>,
  date: moment.Moment,
  eventType: BilingualText
): Array<EventValidated | HeirEvent> {
  return sortEventAscending(
    events.filter(
      event =>
        moment(event?.eventStartDate?.gregorian).isSameOrAfter(date) &&
        event.eventType.english === eventType.english &&
        event.actionType !== ActionType.REMOVE &&
        event.actionType !== ActionType.TEMP_REMOVE
    )
  );
};

export const eventsByStartDateDecending = function (
  events: Array<EventValidated | HeirEvent>
): Array<EventValidated | HeirEvent> {
  return sortEventDecending(
    events.filter(
      event =>
        event.actionType !== ActionType.REMOVE &&
        event.actionType !== ActionType.TEMP_REMOVE &&
        event.actionType !== ActionType.TEMP_ADD
    )
  );
};

export const getValidEvents = function (events: EventValidated[]): EventValidated[] {
  return events?.filter(event => event?.valid);
};

export const getInvalidEvents = function (events: EventValidated[]): EventValidated[] {
  return events?.filter(event => !event?.valid);
};

export const replaceWageOnEligibilityToBegining = function (
  events: HeirEvent[],
  eligibilityDate: GosiCalendar
): HeirEvent[] {
  const monthlyWageEvent = new HeirEvent(
    EventsConstants.WAGE_AS_ON_ELIGIBILITY_DATE(),
    eligibilityDate,
    false,
    QuestionTypes.EMPLOYED
  );
  const index = getIndexOfAnEvent(events, monthlyWageEvent);
  if (index >= 0) {
    events[index].eventType = EventsConstants.BEGINNING_OF_EMPLOYMENT();
  }
  return events;
};

export const replaceBeginingOfEmploymentToWageOnEligibility = function (
  events: HeirEvent[],
  eligibilityDate: GosiCalendar
) {
  const begeningOfEmployment = new HeirEvent(
    EventsConstants.BEGINNING_OF_EMPLOYMENT(),
    eligibilityDate,
    false,
    QuestionTypes.EMPLOYED
  );
  const index = getIndexOfAnEvent(events, begeningOfEmployment);
  if (index >= 0) {
    events[index].eventType = EventsConstants.WAGE_AS_ON_ELIGIBILITY_DATE();
  }
  return events;
};

export const setManualEventFlag = function (qn: Question, events: HeirEvent[]): HeirEvent[] {
  // Manual event flag to be set true, if there is add event functionality for user when study, employed,
  // married, divorced question is asked
  const keys: string[] = [QuestionTypes.MARRIED, QuestionTypes.EMPLOYED, QuestionTypes.STUDENT, QuestionTypes.STUDENT];
  if (keys.includes(qn.key)) {
    if (qn.addEventForAnswer === qn.value) {
      return events.map(event => {
        return { ...event, manualEvent: true };
      }) as HeirEvent[];
    } else {
      return events.map(event => {
        return { ...event, manualEvent: false };
      }) as HeirEvent[];
    }
  } else {
    return events;
  }
};

export const getLatestEventByStatusDate = function (events: HeirEvent[]): HeirEvent {
  const sorted = events.sort(function (a, b) {
    const dateA = new Date(a.statusDate?.gregorian).getTime();
    const dateB = new Date(b.statusDate?.gregorian).getTime();
    return dateA > dateB ? -1 : 1; // Descending
  });
  return sorted.length ? sorted[0] : null;
};
export const getLatestEventByEventStartDate = function (events: HeirEvent[]): HeirEvent {
  const sorted = events.sort(function (a, b) {
    const dateA = new Date(a.eventStartDate.gregorian).getTime();
    const dateB = new Date(b.eventStartDate.gregorian).getTime();
    return dateA > dateB ? -1 : 1; // Descending
  });
  return sorted.length ? sorted[0] : null;
};
export const getLatestEventForReCalculation = function (events: ReCalculationDetails[]): ReCalculationDetails {
  const sorted = events.sort(function (a, b) {
    const dateA = new Date(a.startDate.gregorian).getTime();
    const dateB = new Date(b.startDate.gregorian).getTime();
    return dateA > dateB ? -1 : 1; // Descending
  });
  return sorted.length ? sorted[0] : null;
};
export const getMaritalEventToPopulate = function (events: HeirEvent[], isPension: boolean): HeirEvent {
  const eventsFiltered = events?.filter(event => event?.eventCategory === EventCategory.married);
  if (isPension) {
    const latestEvent = getLatestEventByEventStartDate(eventsFiltered);
    return deepCopy(latestEvent);
  } else {
    // for lumpsum, display oldest marital event
    const oldestEvent = getOldestEventFromNicEvents(eventsFiltered);
    return deepCopy(oldestEvent);
  }
};

export const addActionTypeToEvents = function (events: HeirEvent[] = [], existingEvents: HeirEvent[] = []) {
  return events
    .filter(event => {
      return getDuplicateEvents(event, existingEvents).length === 0;
    })
    .map(item => {
      item.actionType = ActionType.ADD;
      return item;
    });
};

export const getEventsForHeir = function (type: string, eventDate: GosiCalendar): HeirEvent[] {
  switch (type) {
    case QuestionTypes.DISABLED:
      return [new HeirEvent(EventsConstants.BEGINNING_OF_DISABILITY, eventDate, false, type)];
  }
};

export const getDuplicateEvents = function (event: HeirEvent, events: HeirEvent[] = []): HeirEvent[] {
  return events.filter(eachEvent => {
    return (
      eachEvent.eventType &&
      eachEvent.eventType.english === event?.eventType?.english &&
      moment(eachEvent.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day')
    );
  });
};

export const removeDuplicateEvents = function (events: HeirEvent[] = []) {
  const result = events;
  for (var i = 0; i <= events?.length; i++) {
    for (var j = i + 1; j <= events?.length; j++) {
      if (result[i]?.eventType.english == result[j]?.eventType.english) {
        result.splice(i, 1);
      }
    }
  }
  return result;
};

export const getEventsForDependent = function (type: string, eventDate: GosiCalendar): HeirEvent[] {
  switch (type) {
    case QuestionTypes.DISABLED:
      return [new HeirEvent(EventsConstants.BEGINNING_OF_DISABILITY, eventDate, false, type)];
  }
};

export const addEventToQuestion = function (questions: Question[] = [], event: HeirEvent, eventKey: string) {
  const eventIndex = questions.findIndex(eachQn => eachQn.key === eventKey);
  questions[eventIndex].events.push(event[0]);
};

export const removeEventFromQuestion = function (questions: Question[] = [], event: HeirEvent, eventKey: string) {
  const eventIndex = questions.findIndex(eachQn => eachQn.key === eventKey);
  const eventToRemoveIndex = questions[eventIndex].events.findIndex(eachEvent => {
    return (
      eachEvent.eventCategory === event[0].eventCategory &&
      moment(eachEvent.eventStartDate.gregorian).isSame(event[0].eventStartDate.gregorian)
    );
  });
  questions[eventIndex].events.splice(eventToRemoveIndex, 1);
};

export const deleteNonRemovableEvent = function (questions: Question[], event: HeirEvent) {
  questions.forEach(element => {
    if (element.key === EventsConstants.eventsOnlyText()) {
      element.events = element?.events?.filter(eachEvent => {
        !eachEvent.eventCanBeDeleted &&
          eachEvent.eventCategory &&
          eachEvent.eventCategory === event.eventCategory &&
          moment(eachEvent.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day');
      });
    }
  });
};

export const getEventFromEventsAfterDelete = function (events: HeirEvent[] = [], eventToBeRemoved: HeirEvent) {
  const index = events.findIndex(
    event =>
      event.eventCategory === eventToBeRemoved.eventCategory &&
      moment(event.eventStartDate?.gregorian).isSame(moment(eventToBeRemoved.eventStartDate?.gregorian), 'day')
  );
  if (eventToBeRemoved && index >= 0) {
    events.splice(index, 1);
  }
  // else {
  return events;
  // }
  // return events.filter(eachEvent => {
  //   // return eachEvent.eventCategory &&
  //   return eachEvent.eventCategory !== event.eventCategory ||
  //     !moment(eachEvent.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day');
  // });
};

export const getEventsInPeriod = function (events: HeirEvent[] = [], startDate: GosiCalendar, endDate: GosiCalendar) {
  const startDateObj = moment(startDate.gregorian);
  return events.filter(eachEvent => {
    return moment(eachEvent.eventStartDate.gregorian).isSameOrAfter(startDateObj);
  });
};

export const getEventsForCategory = function (events: HeirEvent[], eventCategory: string) {
  return events.filter(item => item.eventCategory === eventCategory);
};

export const findOddEvent = function (event1: HeirEvent[] = [], event2: HeirEvent[] = []) {
  return event1.filter(object1 => {
    return !event2.some(object2 => {
      return (
        object1.eventCategory === object2.eventCategory &&
        moment(object1.eventStartDate.gregorian).isSame(moment(object2.eventStartDate.gregorian), 'day')
      );
    });
  });
};

export const getIndexOfAnEvent = function (events: HeirEvent[] = [], event: HeirEvent): number {
  return events.findIndex(
    item =>
      item.eventType.english === event.eventType.english &&
      moment(item.eventStartDate.gregorian).isSame(moment(event.eventStartDate.gregorian), 'day')
  );
};

export const isHeirDisabled = function (events: HeirEvent[] = []): number {
  return events?.filter(
    item =>
      item.eventType?.english === EventsConstants.BEGINNING_OF_DISABILITY.english &&
      item.dependentEventSource === DependentEventSource.EXISTING_EVENT
  ).length;
};

export const getEventTypesForQuestion = function (question: Question) {
  return EventsConstants.EVENT_TYPES_BILINGUAL_FOR_QUESTION(question).map((value, index) => {
    const lov = new Lov();
    lov.sequence = index;
    lov.value = value;
    return lov;
  });
}
