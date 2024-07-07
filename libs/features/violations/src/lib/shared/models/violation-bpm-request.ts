import { BPMUpdateRequest } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ViolationBPMRequest extends BPMUpdateRequest {
  assignedRole: string = undefined;
  engagementAction: string;
  engagementId: number = undefined;
  penaltyIndicator: number;
  socialInsuranceNo: number = undefined;
}
