import { RejectAllowanceDetails } from './reject-allowance-details';
import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class RejectAllowanceService {
  allowanceRejection: RejectAllowanceDetails[] = [];
  rejectionReason: BilingualText;
  comments: string;
  caseId?: number;
}
