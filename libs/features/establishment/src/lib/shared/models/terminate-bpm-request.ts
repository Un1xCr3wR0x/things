import { BPMUpdateRequest } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class TerminateBPMRequest extends BPMUpdateRequest {
  establishmentAction: string;
  finalApprove? = false;
}
