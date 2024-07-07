/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum ViolationsType {
  TRANSACTION_INCORRECT_TERMINATION = 'Incorrect termination reason violation',
  TRANSACTION_INCORRECT_WAGE = 'Incorrect wage violation',
  TRANSACTION_MODIFY_JOINING_DATE = 'Modify joining date violation',
  TRANSACTION_ADD_NEW_ENGAGEMENT = 'Add engagement violation',
  TRANSACTION_CANCEL_ENGAGEMENT = 'Cancel engagement violation',
  TRANSACTION_MODIFY_LEAVING_DATE = 'Modify leaving date violation',
  TRANSACTION_MODIFY_VIOLATION = 'change violation',
  TRANSACTION_CANCEL_VIOLATION = 'cancel violation',
  TRANSACTION_RAISE_VIOLATION = 'Report Violation',
  TRANSACTION_WRONG_BENEFITS = 'Wrong benefits violation',
  TRANSACTION_OTHER_VIOLATION = 'Other violation',
  TRANSACTION_APPEAL_ON_VIOLATION = 'Appeal On Violation',
  TRANSACTION_INJURY_VIOLATION ='Injury violation'
}
