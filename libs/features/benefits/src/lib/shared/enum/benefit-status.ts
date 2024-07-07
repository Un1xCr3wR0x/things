/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum BenefitStatus {
  /** Hold benefit. */
  ACTIVE = 'Active',
  /** Draft benefit */
  DRAFT = 'Draft',
  /** Stop Benefit. */
  ONHOLD = 'OnHold',
  /** Restart Benefit. */
  STOPPED = 'Stopped',
  /** Waive Benefit. */
  WAIVED = 'Waived',
  /** Inactive Benefit */
  INACTIVE = 'Inactive',
  /** InProgress Benefit */
  INPROGRESS = 'In Progress'
}
