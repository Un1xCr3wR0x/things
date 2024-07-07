/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ContractDetails } from '../../../shared//models';
import { StatusDateEnum } from '../../../shared/enums';
import { BilingualText } from '@gosi-ui/core';
@Component({
  selector: 'cnt-individual-contract-summary',
  templateUrl: './individual-contract-summary.component.html',
  styleUrls: ['./individual-contract-summary.component.scss']
})
export class IndividualContractSummaryComponent implements OnInit {
  /** Local variables */
  dateByStatus = StatusDateEnum;
  contributorAbroadList: BilingualText[];
  /** Input variables */
  @Input() contract: ContractDetails;

  /** Method to return national address
   * @param addresses
   */
  ngOnInit(): void {}
  getNationalAddress(addresses) {
    if (addresses && addresses.length > 0) {
      const national = addresses.filter(address => address['type'] === 'NATIONAL');
      if (national.length > 0) {
        return national[0];
      }
    }
  }
}
