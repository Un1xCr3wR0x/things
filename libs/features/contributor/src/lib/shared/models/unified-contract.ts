/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { ContractDetails } from './contract-details';
import { FirstPartyInfo } from './first-party-info';
import { SecondPartyInfo } from './second-party-info';

export class UnifiedContract {
  contract: ContractDetails = new ContractDetails();
  secondPartyInfo: SecondPartyInfo = new SecondPartyInfo();
  firstPartyInfo: FirstPartyInfo = new FirstPartyInfo();
  workDomain: string = undefined;
  workType: BilingualText = new BilingualText();
}
