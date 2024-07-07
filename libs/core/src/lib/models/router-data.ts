/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RpaSchemaTypes } from '@gosi-ui/features/contributor/lib/shared/enums/rpa-schema-types';
import { WorkFlowActions } from '../enums';
import { UserComment, TpaComment, RasedComment } from './bpm-comments';
import { TransactionReferenceData } from './transaction-reference-data';
/**
 * Class for Data for Routing
 *
 * @export
 * @class RouterData
 */
export class RouterData {
  taskId: string = undefined; // Task Id For the current transaction
  assigneeId: string = undefined; // Assignee Name - user
  assignedRole: string = undefined; // Assigned Role - Validator,Validator1,estadmin,Validator2
  previousOwnerRole: string = undefined; // Previous Assigned Role - Validator,Validator1,estadmin,Validator2
  resourceType: string = undefined; // Transaction Type - Approve_Establishment,IqamaNo-Update....
  route: string = undefined; //Multiple identifiers (registrationNo & social insurance number)
  resourceId: string = undefined; // If single identifier (registrationNo)
  tabIndicator: number = undefined;
  payload = undefined;
  previousOutcome?: string = undefined;
  assigneeName: string = undefined;
  tabId = 1;
  transactionId: number = undefined;
  sourceChannel: string = undefined;
  channel: string = undefined;
  state: string = undefined;
  idParams = new Map();
  documentFetchTypes: string[] = [];
  customActions: WorkFlowActions[] = [];
  userComment: UserComment[] = [];
  tpaComments?: TpaComment[] = [];
  rasedComments?: RasedComment[] = [];
  initiatorUserId: string = undefined;
  initiatorRoleId: string = undefined;
  initiatorCommentDate: string = undefined;
  initiatorComment: string = undefined;
  comments: TransactionReferenceData[] = [];
  selectWizard: string;
  priority: number = undefined;
  schema: number = undefined;
  content: object = undefined;
  draftRequest = false;
  stopNavigationToValidator? = false;
  fromJsonToObject(json) {
    Object.keys(new RouterData()).forEach(key => {
      if (key in json) {
        if (key === 'payload' && json[key]) {
          this[key] = json[key];
          const payload = JSON.parse(json.payload);
          Object.keys(payload).forEach(payloadKey => {
            this.idParams.set(payloadKey, payload[payloadKey]);
          });
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
