/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { OccupationDetail } from '../models';

/**
 * Interface defining occupation lookup values.
 */
export class OccupationDetailList {
  items: OccupationDetail[];

  constructor(items: OccupationDetail[]) {
    this.items = items;
  }
}
