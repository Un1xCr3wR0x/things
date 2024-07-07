/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
// import { Employer } from '../models';

import { Employer } from './employer';

/**
 * Interface defining employer-list values of a contributor.
 */
export class EmployerList {
  items: Employer[];

  constructor(items: Employer[]) {
    this.items = items;
  }
}
