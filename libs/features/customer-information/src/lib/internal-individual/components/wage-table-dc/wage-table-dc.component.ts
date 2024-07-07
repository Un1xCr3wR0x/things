/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { EngagementPeriod } from '@gosi-ui/features/contributor';

@Component({
  selector: 'cim-wage-table-dc',
  templateUrl: './wage-table-dc.component.html',
  styleUrls: ['./wage-table-dc.component.scss']
})
export class WageTableDcComponent {
  /** Input variables */
  @Input() engagementPeriod: EngagementPeriod = new EngagementPeriod();
  @Input() purposeOfReg: BilingualText;
  @Input() showLastUpdate = false;
  @Input() isVic = false;
  @Input() disableSection = false; //To disable  the section in future period scenario of vic

  /**
   * This method creates a instance of WageTableDcComponent
   * @memberof WageTableDcComponent
   */
  constructor() {}
}
