/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Occupation } from '../models';

/**
 * Interface defining occupation lookup values.
 */
export class OccupationList {
  items: Occupation[];

  constructor(items: Occupation[]) {
    this.items = items;
  }
}
