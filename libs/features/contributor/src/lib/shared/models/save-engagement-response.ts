import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class for save engagement api response
 */
export class SaveEngagementResponse {
  backDatedEngagementId: number = undefined;
  backDatedTransactionReferenceNo: number = undefined;
  contributoryWage: number = undefined;
  coverageType: BilingualText[] = [];
  id: number = undefined;
  message: BilingualText = new BilingualText();
  transactionReferenceNo: number = undefined;
}
