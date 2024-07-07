/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { ContributorContribution } from './contributor-contribution';

export class MofEstablishmentBreakup {
  establishmentName: BilingualText = new BilingualText();
  registrationNo: Number = undefined;
  establishmentContribution: ContributorContribution = new ContributorContribution();
}
