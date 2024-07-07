/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class GosiScope {
  establishment: number;
  individualId: number;
  role: number[] = [];
  constructor(establishment: number, roles: number[], individualId: number = null) {
    this.establishment = establishment;
    this.role = roles;
    this.individualId = individualId;
  }
}
