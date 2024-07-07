/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum HeirStatusType {
  /** Hold benefit. */
  ACTIVE = 'Active',
  /** Stop Benefit. */
  ONHOLD = 'OnHold',
  /** Hold benefit. */
  ON_HOLD = 'On Hold',
  /** Restart Benefit. */
  STOPPED = 'Stopped',
  /** Waive Benefit. */
  WAIVED = 'Waived',
  WAIVED_TOWARDS_GOSI = 'Waived towards GOSI',
  WAIVED_TOWARDS_HEIR = 'Waived towards heir',
  /** Inactive Benefit. */
  INACTIVE = 'Inactive',
  REPAY_LUMPSUM = 'Repay Lumpsum',
  INITIATED = 'Initiated',
  REJECTED = 'Rejected',
  PAID_UP = 'Paid Up'
}
