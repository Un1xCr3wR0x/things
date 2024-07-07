/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class BranchList {
  establishmentName: BilingualText;
  registrationNumber: number;
  status: BilingualText;
  location: BilingualText;
  billStatus: string;
  billAmount: number;
  certificateStatus: boolean;

  /**
   * Initialize values inside constructor
   */
  constructor() {
    this.establishmentName = new BilingualText();
    this.registrationNumber = 0;
    this.status = new BilingualText();
    this.location = new BilingualText();
    this.billAmount = 0;
    this.billStatus = '';
  }
}
