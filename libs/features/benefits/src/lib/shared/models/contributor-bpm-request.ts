/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BPMUpdateRequest } from '@gosi-ui/core';
/**
 * This class is a modal for bpm update request
 */
export class ContributorBPMRequest extends BPMUpdateRequest {
  socialInsuranceNo: number = undefined;
  assignedRole: string = undefined;
  engagementId: number = undefined;
  workflowType: string = undefined;
}
