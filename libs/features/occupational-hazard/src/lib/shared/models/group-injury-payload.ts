import { BilingualText, GosiCalendar, MobileDetails } from '@gosi-ui/core';


/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class GroupInjuryPayload { 
  accidentType: BilingualText = new BilingualText();
  allowancePayee: number;
  contributorId: number;
  socialInsuranceNo: number;
  deathDate: GosiCalendar = new GosiCalendar();
  treatmentCompleted: boolean;
  emergencyContactNo: MobileDetails = new MobileDetails();
  injuryLeadsToDeathIndicator: boolean;
  injuryReason: BilingualText = new BilingualText();
  occupation: BilingualText = new BilingualText();
  isEdited?:Boolean;
  isDeleted?:Boolean;
  bulkInjuryRequestItemId: number;

}
