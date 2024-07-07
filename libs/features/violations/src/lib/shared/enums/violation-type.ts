/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum ViolationTypeEnum {
  CANCEL_ENGAGEMENT = 'Register a contributor without a real labour relationship',
  INCORRECT_REASON = 'Providing leave reason that does not correspond to actual reason',
  ADD_NEW_ENGAGEMENT = 'Failure to register a contributor with a real labour relationship',
  INCORRECT_WAGE = 'Failure to register the actual contributory wage of a contributor',
  MODIFY_TERMINATION_DATE = 'Keeping a contributor registered after the labour relationship has ended and after the grace period',
  MODIFY_JOINING_DATE = 'Modifying the joining date of a contributor after the grace period',
  VIOLATING_PROVISIONS = 'Violating the provisions of the law and its regulations',

  RAISE_CANCEL_ENGAGEMENT = 'REGISTER A CONTRIBUTOR WITHOUT A REAL LABOUR RELATIONSHIP',
  RAISE_INCORRECT_REASON = 'Providing Termination Reason That Does Not Correspond To Actual Reason',
  RAISE_ADD_NEW_ENGAGEMENT = 'FAILURE TO REGISTER A CONTRIBUTOR WITH A REAL LABOUR RELATIONSHIP',
  RAISE_INCORRECT_WAGE = 'FAILURE TO REGISTER THE ACTUAL CONTRIBUTORY WAGE OF A CONTRIBUTOR',
  RAISE_VIOLATING_PROVISIONS = 'VIOLATING THE PROVISIONS OF THE LAW AND ITS REGULATIONS',
  RAISE_WRONG_BENEFITS = 'RECEIVING UNLAWFUL BENEFITS DUE TO VIOLATION OF GOSI LAW AND REGULATIONS'
}
