/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { ContractDetails } from '../../../shared//models';
import { StatusDateEnum } from '../../../shared/enums';

@Component({
  selector: 'cnt-contract-summary',
  templateUrl: './contract-summary.component.html',
  styleUrls: ['./contract-summary.component.scss']
})
export class ContractSummaryComponent {
  /** Local variables */
  dateByStatus = StatusDateEnum;

  /** Input variables */
  @Input() contract: ContractDetails;
}
