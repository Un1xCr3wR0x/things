/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { DependentDetails } from '@gosi-ui/features/benefits/lib/shared';

export class UnbornEdit {
  unbornModificationReason: BilingualText;
  deathDate: GosiCalendar;
  dateOfBirth: GosiCalendar;
  noOfChildren: number;
  unbornDetails: DependentDetails;
}
