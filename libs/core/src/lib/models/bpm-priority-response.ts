/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BPMPriorityResponse {
  high: number;
  medium: number;
  low: number;
  pending: number;
  olaExceeded: number;
  constructor() {
    this.low = this.high = this.medium = this.pending = this.olaExceeded = 0;
  }
}
