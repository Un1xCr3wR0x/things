import { BilingualText } from '@gosi-ui/core';
import { ChangeViolationContributors } from './change-violation-contributors';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ChangeViolationValidator {
  contributors: ChangeViolationContributors[];
  currentPenaltyAmount: number;
  establishmentDetails: {
    name: BilingualText;
    registrationNo: number;
    isReopenClosingInProgress?: boolean;
  };
  modificationReason: BilingualText;
  cancellationReason: BilingualText;
  newPenaltyAmount: number;
  requestedBy: string;
  role: BilingualText;
  violationId: number;
  violationType: BilingualText;
  isSimisViolation?: boolean;
  comments: string;
}
