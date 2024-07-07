/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BpmPendingCount {
  pending: number;
  completed: number;
  olaExceeded: number;
  constructor() {
    this.pending = this.completed = this.olaExceeded = 0;
  }
}
