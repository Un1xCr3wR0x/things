/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { UpdateWage } from './update-wage';

/**
 * The wrapper class for updated wage  information.
 *
 * @export
 * @class PersonalInformation
 */
export class UpdatedWageListResponse {
  joiningDate: GosiCalendar = new GosiCalendar();
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  transactionRefNo: number = undefined;
  proactive = false;
  updateWageList: UpdateWage[] = [];
  ppaIndicator = false;
}
