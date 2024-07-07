/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { PreviousClaimsDetails } from './previous-claims-details';

export class PreviousClaims {
  message: BilingualText = new BilingualText();
  previousClaims: PreviousClaimsDetails[];
}
