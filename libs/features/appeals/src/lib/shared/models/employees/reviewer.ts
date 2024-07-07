/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from "@gosi-ui/core";

export class Reviewer {
  reviewerIsAcceptedFormally: boolean;
  reviewerComments: string;
  reviewerIsAcceptedObjectively: boolean;
  reviewerObjectionComments: string;
  reviewerDecision: BilingualText;
}
