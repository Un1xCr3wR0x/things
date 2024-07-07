/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export interface EstablishmentWorkFlowStatus {
  type: string;
  message: BilingualText;
  referenceNo: number;
  count?: number;
  recordActionType?: string;
  status?: string;
  isDraft?: boolean;
  transactionId?: number;
  transactionStatus?: string;
  isSameLoggedInUser?: boolean;
}
