/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum HeirStatus {
  /** Hold benefit. */
  HOLD = 'HOLD',
  /** Stop Benefit. */
  STOP = 'STOP',
  /** Restart Benefit. */
  RESTART = 'RESTART',
  ADD = 'ADD',
  /** Remove/delete record. */
  REMOVE = 'REMOVE',
  /** Replace record. */
  MODIFY = 'MODIFY',
  /** No action record. */
  NO_ACTION = 'NO_ACTION',
  /** Start Waive Benefit. */
  START_WAIVE = 'START_WAIVE',
  /** Stop Waive Benefit. */
  STOP_WAIVE = 'STOP_WAIVE',
  /** For request body */
  START_WAIVE_STRING = 'Start Waive',
  /** Stop Waive Benefit. */
  STOP_WAIVE_STRING = 'Stop Waive',
  /** OnHold Benefit */
  ON_HOLD = 'On Hold'
}
