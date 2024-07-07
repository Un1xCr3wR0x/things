/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BPMUpdateRequest, BilingualText } from '@gosi-ui/core';

export class IReviewer_1_1Request extends BPMUpdateRequest {
  ReviewerIsAcceptedFormally: boolean;
  ReviewerComments: string;
  ReviewerIsAcceptedObjectively: boolean;
  ReviewerObjectionComments: string;
  ReviewerDecision: BilingualText;
}
