/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Alert } from '@gosi-ui/core';

/** This class is modal for contributor wage details update response */
export class UpdateWageError {
  socialInsuranceNo: number = undefined;
  engagementId: number = undefined;
  message: Alert = new Alert();
  hasError = false;
}
