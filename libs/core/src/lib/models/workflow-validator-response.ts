/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ProcessInfo, SystemAttributes } from './bpm-task-response';

export class Task {
  title: string = undefined;
  taskDefinitionURI: string = undefined;
  ownerRole: string = undefined;
  priority: number = undefined;
  identityContext: string = undefined;
  processInfo: ProcessInfo;
  systemAttributes: SystemAttributes;
  isPublic: boolean;
  percentageComplete: number = undefined;
  applicationContext: string = undefined;
  taskDefinitionId: string = undefined;
  correlationId: string = undefined;
  mdsLabel: string = undefined;
  customAttributes: string = undefined;
}
/**
 * Wrapper class to hold Workflow Validator response.
 *
 * @export
 * @class WorkflowValidatorResponse
 */
export class WorkflowValidatorResponse {
  task: Task;
}
