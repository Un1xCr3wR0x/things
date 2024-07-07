/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export interface Body {
  EstablishmentId?: number;
  id: number;
}

export interface Header {
  CorrelationId: number;
  BusinessContext: string;
}

export interface Request {
  Body: Body;
  Header: Header;
}

export interface Payload {
  Request: Request;
}

export interface ProcessInfo {
  instanceId: number;
  processId: string;
  processName: string;
}

export interface FromUser {
  type: string;
}

export interface SystemActions {
  action: string;
  displayName: string;
}

export interface UpdatedBy {
  id: string;
  displayName: string;
  type: string;
}

export interface Reviewers {
  id: string;
  displayName: string;
  type: string;
}

export interface Assignees {
  id: string;
  displayName: string;
  type: string;
}

export interface SystemAttributes {
  assignedDate: Date;
  createdDate: Date;
  digitalSignatureRequired: boolean;
  fromUser: FromUser;
  hasSubTasks: boolean;
  inShortHistory: boolean;
  isGroup: boolean;
  numberOfTimesModified: number;
  passwordRequiredOnUpdate: boolean;
  pushbackSequence: string;
  secureNotifications: boolean;
  state: string;
  systemActions: SystemActions;
  customActions: CustomActions;
  taskId: string;
  taskNumber: number;
  updatedBy: UpdatedBy;
  updatedDate: Date;
  version: number;
  versionReason: string;
  taskDefinitionId: string;
  taskDefinitionName: string;
  workflowPattern: string;
  isTestTask: boolean;
  participantName: string;
  reviewers: Reviewers;
  assignees: Assignees;
  rootTaskId: string;
  systemStringActions: string;
  stage: string;
  isTemplateTask: boolean;
  taskNamespace: string;
  componentType: string;
  activityName: string;
  activityId: string;
  thread: number;
  parentThread: number;
  swimlaneRole: string;
  timersSuspended: boolean;
  isDecomposedTask: boolean;
  formName: string;
}

export interface CustomActions {
  action: string;
  displayName: string;
}
export interface BPMResponseTask {
  title: string;
  payload: Payload;
  taskDefinitionURI: string;
  ownerRole: string;
  processInfo: ProcessInfo;
  systemAttributes: SystemAttributes;
}
export interface BPMTaskResponse {
  task: BPMResponseTask;
}
