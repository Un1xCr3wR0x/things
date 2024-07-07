/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AppealContributor } from '@gosi-ui/features/violations/lib/shared/models/appeal-contributor';

/**
 * Wrapper class to hold Appeal Request Payload
 *
 *
 */
export class AppealRequest {
  appealType: number;
  documents?: string[] = [];
  edited: boolean = true;
  initiatorComment: string;
  objector: number;
  reason?: string;
  registrationNo: string;
  transactionRefNumber: number;
  transactionSource: string;
  contributors?: AppealContributor[];
}
