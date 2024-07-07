/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';

/**
 * The wrapper class for add contributor engagement period details.
 *
 * @export
 * @class AddContEngagementDetails
 */
export class AddContEngagementPayload {
  companyWorkerNumber: string = undefined;
  engagementPeriod: EngagementPeriod[] = [];
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  proactive = false;
  student = false;
  prisoner = false;
  skipContract = true;
  workType: BilingualText = new BilingualText();
  //Added for change engagement module
  leavingReason: BilingualText = new BilingualText();
  editFlow? = false; //To indicate validator edit mode
  penaltyIndicator: number = undefined;
  backdatingIndicator?: boolean;
}
