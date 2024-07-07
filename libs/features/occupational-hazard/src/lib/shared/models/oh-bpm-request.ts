/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BPMUpdateRequest, BilingualText, RasedComment, TpaComment, UserComment, WorkFlowActions } from '@gosi-ui/core';
/**
 * This class is a modal for bpm update request
 */
export class OhBPMRequest extends BPMUpdateRequest {
  closingStatus?: BilingualText = undefined;
  selectedInspection?: BilingualText;
  reasonForRejection?: string;
  inspectionType?: string;
  customActions: WorkFlowActions[] = [];
  initiatorUserId: string = undefined;
  initiatorRoleId: string = undefined;
  initiatorCommentDate: string = undefined;
  initiatorComment: string = undefined;
  userComment: UserComment[] = [];
  tpaComments?: TpaComment[] = [];
  rasedComments?: RasedComment[] = [];
  rejectionIndicator?: boolean;
  foregoExpenses = false;
  channel: string = undefined;
  visitingDocRequired? : boolean;
  establishmentId?: string;
}
