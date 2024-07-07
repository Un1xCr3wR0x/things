/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EngagementPeriod } from './engagement-period';

/** This class is modal for contributor wage details  */

export class UpdateWageRequest {
  socialInsuranceNo: number = undefined;
  engagementId: number = undefined;
  wageDetails: EngagementPeriod = new EngagementPeriod();
}
