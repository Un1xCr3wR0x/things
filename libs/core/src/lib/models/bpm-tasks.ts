import { WorkFlowActions } from '../enums';
import { BPMComments } from './bpm-comments';
import { SystemAttributes } from './bpm-task-response';
import { TransactionReferenceData } from './transaction-reference-data';
import { TransactionContent } from './transaction-content';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BPMResponse {
  tasks: BPMTask[];
}

export class BPMTask extends BPMComments {
  taskId: string = undefined;
  taskNumber: number = undefined;
  state: string = undefined;
  subState: string = undefined;
  assignees: BPMAssignee;
  systemAttributes: SystemAttributes;
  assigneeName: string = undefined;
  assigneeId: string = undefined;
  createdDate: Date;
  assignedDate: Date;
  workflowPattern: string = undefined;
  dueDate: Date;
  olaDueDate: Date;
  updatedDate: Date;
  updatedBy: string = undefined;
  priority: number = undefined;
  titleEnglish: string = undefined;
  titleArabic: string = undefined;
  descriptionEnglish: string = undefined;
  descriptionArabic: string = undefined;
  payload: string = undefined;
  assignedRole: string = undefined;
  transactionId: string = undefined;
  resourceId: string = undefined;
  registrationNo: number = undefined;
  resourceType: string = undefined;
  route: string = undefined;
  title: string = undefined;
  swimlaneRole: string;
  dateTime: string = undefined;
  timeTasks: string = undefined;
  valueNow: number = undefined;
  customActions: WorkFlowActions[] = [];
  previousOutcome: string;
  returnToCustomerUser: string;
  olaDuration: string;
  olaAvailable: boolean;
  referenceNo: string;
  content: TransactionContent = undefined;
  comments: TransactionReferenceData[] = [];
  channel: string = undefined;
  isReopened?: boolean = false;
  slaAvailable: boolean = false;
  slaDueDate: Date;
  transactionCreationDate: Date;
  compositeCreatedTime?: Date;

  /**
   * mapping values into model
   */
  mergeJsonToObject(firstJson: BPMTask, secondJson: BPMTask) {
    Object.keys(new BPMTask()).forEach(key => {
      this[key] = firstJson[key] ? firstJson[key] : secondJson[key];
    });
    return this;
  }
}

/***
 * export class SystemAttributes {
  createdDate: Date;
  assignedDate: Date;
  taskId: string = undefined;
  taskNumber: number = undefined;
  state: string = undefined;
  aassignees: BPMAssignee;
  updatedBy: BPMUpdatedBy;
}
 *
 */

export class BPMUpdatedBy {
  id: string = undefined;
  type: string = undefined;
}

export class BPMAssignee {
  id: string = undefined;
  displayName: string = undefined;
  type: string = undefined;
}

export class TaskCountResponse {
  taskCountResponse: number = undefined;
}

export class TaskQuery {
  ordering = new Ordering();
  predicate = new Predicates();
  optionalInfoList = new TaskOptionalInfo();
  displayColumnList = new DisplayColumnList();
}

export class TaskOptionalInfo {
  taskOptionalInfo: string;
}

export class Join {
  ignoreCase: string = undefined;
  joinOperator: string = undefined;
  tableName: string = undefined;
}

export class Ordering {
  clause = new SortClause();
}

export class Predicates {
  assignmentFilter: string = undefined;
  predicate = new PredicateValue();
}

export class PredicateValue {
  clause: FilterClause[] = [];
}

export class FilterClause {
  column = new Column();
  operator: string = undefined;
  value?: string = undefined;
  valueList?: { value : string[] };
}

export class SortClause {
  column: string;
  sortOrder: string = undefined;
}
export class DisplayColumnList {
  displayColumn = 'CompositeCreatedTime';
}

export class Column {
  columnName: string;
}

export class Limit {
  end: number = undefined;
  start: number = undefined;
}

export const request = {
  join: {
    ignoreCase: 'TRUE',
    joinOperator: 'OR',
    tableName: 'WFTASK'
  },
  limit: {
    end: '10',
    start: '5'
  },
  taskQuery: {
    ordering: {
      clause: {
        column: 'assigneddate',
        sortOrder: 'DESCENDING'
      }
    },
    predicate: {
      assignmentFilter: 'MY_AND_GROUP',
      predicate: {
        clause: [
          {
            column: {
              columnName: 'state'
            },
            operator: 'EQ',
            value: 'ASSIGNED'
          }
        ]
      }
    }
  }
};
