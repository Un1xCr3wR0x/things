/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Response expected in establishment api when called with query param
 *
 * @export
 * @class MedicalInsurancePolicy
 */
export class MedicalInsurancePolicy {
  policyNumber: number;
  recordNo: number;
  policyStatus: string;
  InsuranceCompanyID: number;
  policyIssueDate: GosiCalendar = new GosiCalendar();
  policyEndDate: GosiCalendar = new GosiCalendar();
  insuranceCompanyName: BilingualText;
  addPolicy?: boolean;
}

export enum PolicyStatusEnum {
  ACTIVE = 'ACTIVE'
}
