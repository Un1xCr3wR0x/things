/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum EventsType {
  /** The Beginning of study type. */
  BEGINNING_OF_STUDY = 'Beginning of study',

  /** The End of Study type. */
  END_OF_STUDY = 'End of Study',

  /** The Beginning of Employment type. */
  BEGINNING_OF_EMPLOYMENT = 'Beginning of Employment',

  /** The End of Employment type. */
  END_OF_EMPLOYMENT = 'End of Employment',

  /** The Wage change type. */
  WAGE_CHANGE = 'Wage change',

  /** The Beginning of disability type. */
  BEGINNING_OF_DISABILITY = 'Beginning of disability',

  /** The Marriage type. */
  MARRIAGE = 'Marriage',

  /** The Widowhood type. */
  WIDOWHOOD = 'Widowhood',
  /** The Divorce= ye */
  DIVORCE = 'Divorce',

  /** The Missing type. */
  MISSING = 'Missing',

  /** The Discovered to be alive type. */
  DISCOVERED_TO_BE_ALIVE = 'Discovered to be alive',
  // From Medical Board
  //Recovery
  END_OF_DISABILITY = 'End of disability'
}

export enum BenefitEventSource {
  MANUAL = 'Manual'
}

export enum EventCategory {
  // Refer getQuestionForHeir function
  employed = 'employmentEvents',
  married = 'maritalEvents',
  disabled = 'disabledEvents',
  student = 'studyEvents',
  divorcedOrWidowed = 'maritalEvents',
  marriedWife = 'maritalEvents'
}

export enum QuestionTypes {
  EMPLOYED = 'employed',
  MARRIED = 'married',
  DISABLED = 'disabled',
  STUDENT = 'student',
  DIVORCED_OR_WIDOWED = 'divorcedOrWidowed',
  MARRIED_WIFE = 'marriedWife',
  ORPHAN = 'orphan',
  UNBORN = 'unborn',
  PREGNANT = 'pregnant',
  REFORM_WIDOWED = 'divorcedOrWidowed'
}

export enum EventAddedFrom {
  UI = 'UI',
  API = 'API'
}
