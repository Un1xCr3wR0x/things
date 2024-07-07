/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { HoldPensionDetails } from '.';
import { Contributor } from './contributor';
import { HeirsDetails } from './heirs';

export class ModifyPaymentDetails {
  contributor: Contributor;
  isDirectPaymentOpted: boolean;
  modifyPayee: HeirsDetails;
  pension: HoldPensionDetails;
  samaVerification?: BilingualText = new BilingualText();
  deathDatePresent?: boolean;
}
