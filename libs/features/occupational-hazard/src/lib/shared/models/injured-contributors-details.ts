/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, MobileDetails } from '@gosi-ui/core';

/**
 * Model class to hold contributor details.
 *
 * @export
 * @class Contributor
 */

export class InjuredContributorsDetails {
  accidentType: BilingualText = new BilingualText();
  allowancePayee: number;
  bulkInjuryRequestItemId?: number;
  contributorId: number;
  deathDate: GosiCalendar = new GosiCalendar();
  emergencyContactNo: MobileDetails = new MobileDetails();
  injuryLeadsToDeathIndicator : boolean;
  injuryReason: BilingualText = new BilingualText();
  isEdited?: Boolean;
  isDeleted?: Boolean;
  occupation: BilingualText = new BilingualText();
  socialInsuranceNo: number;
  treatmentCompleted: boolean;
}
