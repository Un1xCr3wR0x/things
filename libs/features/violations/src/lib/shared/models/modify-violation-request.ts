import { BilingualText } from '@gosi-ui/core';
import { ModifyContributor } from './modify-contributor';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ModifyViolationRequest {
  channel: string;
  contributors?: ModifyContributor[];
  reasonForModification: BilingualText = new BilingualText();
  totalCurrentPenaltyAmount: number;
  totalNewPenaltyAmount: number;
  initiatorName?: string;
  initiatorRole: string;
  violationId: number = undefined;
  transactionTraceId: number;
  comments: string;
}
