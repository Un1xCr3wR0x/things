/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { RouterData, WorkFlowActions, TransactionReferenceData } from '@gosi-ui/core';

export class ComplaintRouterData {
  businessKey: number;
  transactionTraceId: number;
  requestType: string;
  taskId: string;
  assigneeId: string;
  assignedRole: string;
  departmentId: string;
  deptHead: string;
  customActions: WorkFlowActions[];
  comments: TransactionReferenceData[];
  returnToCustomerUser: string;
  previousOutcome: string;
  priority: number = undefined;
  content: object;
  complainant: number;
  channel: string;
  constructor(routerData: RouterData) {
    this.businessKey = Number(routerData.resourceId);
    this.transactionTraceId = routerData.transactionId;
    this.requestType = routerData.resourceType;
    this.taskId = routerData.taskId;
    this.assigneeId = routerData.assigneeId;
    this.assignedRole = routerData.assignedRole;
    this.customActions = routerData.customActions;
    this.comments = routerData.comments;
    this.priority = routerData.priority;
    this.content = routerData.content;
    this.channel = routerData.channel;
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.departmentId = payload.organization;
      this.deptHead = payload.deptHead;
      this.returnToCustomerUser = payload.returnToCustomerUser;
      this.previousOutcome = payload.previousOutcome;
      this.complainant = payload.complainant;
    }
  }
}
