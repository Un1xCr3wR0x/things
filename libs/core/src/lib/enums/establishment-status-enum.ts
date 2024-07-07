/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum EstablishmentStatusEnum {
  UNDER_INSPECTION = 'Under Inspection', //1001,
  REGISTERED = 'Registered', //1002,
  CLOSING_IN_PROGRESS = 'Closed- waiting for settlement', //1003,
  CLOSED = 'Closed', //1004,
  CANCELLED = 'Cancelled', //1005,
  REOPENING_IN_PROGRESS = 'Reopening in Progress', //1006,
  OPENING_IN_PROGRESS = 'Opening in progress', //1007,
  UNDER_CLOSURE_WAITING_SETTLEMENT = 'Under Closure waiting for settlement', //1008,
  OPENING_IN_PROGRESS_INT = 'Opening in Progress GOL', //1009,
  CANCEL_UNDER_INSPECTION = 'Cancelled - Under Inspection', //1010,
  PENDING = 'Pending', //1011,
  DRAFT = 'Draft', //7777,
  OPENING_IN_PROGRESS_GOL_UPDATE = 'Opening in progress for GOL Update', //6666,
  REOPEN = 'Reopened', //1012
  REOPEN_CLOSING_IN_PROGRESS = 'Reopened- closing in progress' //1013
}
