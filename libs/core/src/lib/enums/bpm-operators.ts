/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum BPMOperators {
  EQUAL = 'EQ',
  NOT_EQUAL = 'NEQ',
  AND = 'AND',
  OR = 'OR',
  NULL = 'NULL',
  DELIMITER = '::',
  LAST_N_DAYS = 'LAST_N_DAYS',
  IN ='IN'
}

export enum BPMUser {
  ADMIN = 'admin'
}

export enum BPMCommentScope {
  BPM = 'BPM',
  TASK = 'Task'
}
