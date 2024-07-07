/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
import { WorkFlowActions, WorkFlowPriorityType, WorkFlowPriority, BPMCommentScope } from '../enums';
import { DocumentNameList } from './document-name';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BPMUpdateRequest {
  action?: string;
  assignedRole?: string;
  // TODO: Remove taskId and user. this should be passed only in header
  taskId?: string;
  outcome: string = WorkFlowActions.UPDATE;
  comments?: string;
  inspectionType?: string;
  registrationNo?: number;
  reasonForRejection?: string;
  rejectionReason?: BilingualText;
  returnReason?: BilingualText;
  establishmentId?:string;
  status?: string;
  user?: string;
  route?: string;
  referenceNo?: string;
  resourceType?: string;
  workflowType?: string = undefined;
  organizationUser?: string = undefined;
  organization?: string = undefined;
  updateType?: WorkFlowPriorityType = undefined;
  priority?: WorkFlowPriority = undefined;
  itsmNumber?: string;
  foregoExpenses?: boolean;
  document?: DocumentNameList[];
  tpaCode?: string;
  commentScope?: string = BPMCommentScope.BPM;
  bypassLateBenefitRequest?: boolean;
  ackComment?: string;
  returnComment?: string;
  resolveComment?: string;
  resource?: string;
  updateMap? = new Map();
  payload?: object = undefined;
  isExternalComment = false;
  isGccEstablishment?: boolean;
  roleId?: number;

  diseaseId?: number;
  visitingDocRequired?: boolean;
  sessionId?: number = undefined;
  sessionSlot?: number = undefined;
  rejectReason?:string;
  constructor() {}
}
