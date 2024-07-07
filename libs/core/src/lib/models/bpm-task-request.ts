/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Class to hold bpm task request
 * Requires workflowUser as header default it is admin
 * @export
 * @class BpmTaskRequest
 */
export class BpmTaskRequest {
  taskId: string = undefined;
  workflowUser = '';
}
