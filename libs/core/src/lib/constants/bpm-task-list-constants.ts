/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TransactionState, BPMOperators, BPMTransactionStatus, AssignmentFilter, SearchColumn } from '../enums';
export class BPMTaskConstants {
  /**
   * To get assigned constant
   */
  public static get TRN_STATE_ASSIGNED(): string {
    return 'ASSIGNED';
  }
  /**
   * To get group constant
   */
  public static get TRN_STATE_T(): string {
    return 'T';
  }
  /*
   * To get Reassigned constant
   */
  public static get TRN_STATE_REASSIGNED(): string {
    return 'REASSIGNED';
  }
  /**
   * To get completed constant
   */
  public static get TRN_STATE_COMPLETED(): string {
    return 'COMPLETED';
  }
  /**
   * To get withdrawn constant
   */
  public static get TRN_STATE_WITHDRAWN(): string {
    return 'WITHDRAWN';
  }
  /**
   * To get Returned constant
   */
  public static get TRN_STATE_RETURNED(): string {
    return 'RETURNED';
  }
  /**
   * To get return constant
   */
  public static get TRN_STATE_RETURN(): string {
    return 'RETURN';
  }
  /**
   * To get OLA Exceeded constant
   */
  public static get TRN_OLA_EXCEEDED(): string {
    return 'OLABREACHED';
  }
  /**
   * To get Stale constant
   */
  public static get TRN_STATE_STALE(): string {
    return 'STALE';
  }
  public static get TRN_ACQUIRED(): string {
    return 'ACQUIRED';
  }
  public static get TRN_TASKVERSION_REASON_ACQUIRED(): string {
    return 'TASK_VERSION_REASON_ACQUIRED';
  }
  public static get TRN_CLAIMED(): string {
    return 'Claimed';
  }
  /**
   * To get payload constant
   */
  public static get OptionalTaskInfoPayload() {
    return 'Payload';
  }
  /**
   * To get suspended constant
   */
  public static get TRN_STATE_SUSPENDED() {
    return 'SUSPENDED';
  }
  /**
   * To get filter list for inbox
   */
  public static get STATE_LIST() {
    return [
      {
        english: BPMTaskConstants.TRN_STATE_ASSIGNED,
        arabic: 'مسندة'
      },
      {
        english: BPMTaskConstants.TRN_STATE_REASSIGNED,
        arabic: 'معاد تعيينها'
      },
      {
        english: BPMTaskConstants.TRN_STATE_RETURNED,
        arabic: 'معادة'
      }
    ];
  }
  /**
   * To get descending sort order for bpm request
   */
  public static get SORT_ITEM_DESCENDING_DIRECTION() {
    return 'DESCENDING';
  }
  /**
   * TO get ascending sort order for bpm request
   */
  public static get SORT_ITEM_ASCENDING_DIRECTION() {
    return 'ASCENDING';
  }
  /**
   * To get true constant
   */
  public static get BPM_IGNORECASE() {
    return 'TRUE';
  }
  /**
   * To get bpm table name
   */
  public static get WFTASK() {
    return 'WFTask';
  }
  /**
   * To get sort list for inbox
   */
  public static get SORT_FOR_BPM_LIST() {
    return [
      {
        value: { english: 'Priority', arabic: 'الأولوية' },
        sequence: 1,
        column: 'priority',
        code: 1000
      },
      {
        value: { english: 'Date', arabic: 'التاريخ' },
        sequence: 3,
        column: 'assignedDate',
        code: 1002
      },
      {
        value: { english: 'Due Date', arabic: 'استكمال الطلب قبل' },
        sequence: 6,
        column: 'dueDate',
        code: 1005
      },
      {
        value: { english: 'Creation Date', arabic: 'تاريخ الإنشاء' },
        sequence: 7,
        column: 'CompositeCreatedTime',
        code: 1006
      },
    ];
  }
  /**
   * TO get completed count request for inbox
   */
  public static get COMPLETED_COUNT_REQUEST() {
    return {
      predicate: {
        predicate: {
          clause: [
            {
              column: {
                columnName: TransactionState.UPDATEDDATE
              },
              value: '1',
              operator: BPMOperators.LAST_N_DAYS
            },
            {
              column: {
                columnName: TransactionState.STATE
              },
              value: BPMTransactionStatus.COMPLETED,
              operator: BPMOperators.EQUAL
            }
          ]
        },
        assignmentFilter: AssignmentFilter.PREVIOUS
      },
      join: {
        ignoreCase: BPMTaskConstants.BPM_IGNORECASE,
        joinOperator: BPMOperators.AND,
        tableName: BPMTaskConstants.WFTASK
      }
    };
  }
  /**
   * To get assigned count request for bpm
   */
  public static get COUNT_REQUEST() {
    return {
      join: {
        ignoreCase: BPMTaskConstants.BPM_IGNORECASE,
        joinOperator: BPMOperators.AND,
        tableName: BPMTaskConstants.WFTASK
      },
      predicate: {
        assignmentFilter: AssignmentFilter.MY,
        predicate: {
          clause: [
            {
              operator: BPMOperators.EQUAL,
              value: BPMTaskConstants.TRN_STATE_ASSIGNED,
              column: { columnName: TransactionState.STATE }
            },
            {
              operator: BPMOperators.NOT_EQUAL,
              value: BPMTransactionStatus.STALE,
              column: { columnName: TransactionState.STATE }
            }
          ]
        }
      }
    };
  }
  public static get COUNT_REQUEST_UNCLAIMED() {
    return {
      join: {
        ignoreCase: BPMTaskConstants.BPM_IGNORECASE,
        joinOperator: BPMOperators.AND,
        tableName: BPMTaskConstants.WFTASK
      },
      predicate: {
        assignmentFilter: AssignmentFilter.GROUP,
        predicate: {
          clause: [
            {
              operator: BPMOperators.EQUAL,
              value: BPMTaskConstants.TRN_STATE_ASSIGNED,
              column: { columnName: TransactionState.STATE }
            },
            {
              operator: BPMOperators.EQUAL,
              value: BPMTaskConstants.TRN_STATE_T,
              column: { columnName: TransactionState.ISGROUP }
            },
            {
              operator: BPMOperators.NOT_EQUAL,
              value: BPMTaskConstants.TRN_CLAIMED,
              column: { columnName: TransactionState.PROTECTEDTEXTATTRIBUTE1 }
            }
          ]
        }
      }
    };
  }
  /**
   * To get pending count request for bpm
   */
  public static get PENDING_COUNT_REQUEST() {
    return {
      predicate: {
        assignmentFilter: AssignmentFilter.MY,
        predicate: {
          clause: [
            {
              column: {
                columnName: TransactionState.ASSIGNEDDATE
              },
              value: '1',
              operator: BPMOperators.LAST_N_DAYS
            },
            {
              column: {
                columnName: TransactionState.STATE
              },
              value: BPMTransactionStatus.ASSIGNED,
              operator: BPMOperators.EQUAL
            },
            {
              column: {
                columnName: TransactionState.STATE
              },
              value: BPMTransactionStatus.STALE,
              operator: BPMOperators.NOT_EQUAL
            }
          ]
        }
      },
      join: {
        ignoreCase: BPMTaskConstants.BPM_IGNORECASE,
        joinOperator: BPMOperators.AND,
        tableName: BPMTaskConstants.WFTASK
      }
    };
  }
  /**
   * To get system constant
   */
  public static get BPM_SYSTEM(): string {
    return 'System';
  }
  /**
   * To get itsm constant
   */
  public static get ITSM_GROUP(): string {
    return 'itsm-prj.ITSM';
  }
  public static get ITSM(): string {
    return 'ITSM';
  }
  /**
   * To get reportee filter for bpm request
   * @param user
   */
  public static ASSIGNEES_FILTER(user: string) {
    return {
      column: {
        columnName: TransactionState.ASSIGNEES
      },
      value: `${user},user`,
      operator: BPMOperators.EQUAL
    };
  }
  /**
   * To get reassigned filter for bpm request
   * @param operator
   */
  public static REASSIGNED_FILTER(operator: string = BPMOperators.EQUAL) {
    return {
      column: {
        columnName: TransactionState.SUBSTATE
      },
      value: BPMTaskConstants.TRN_STATE_REASSIGNED,
      operator: operator
    };
  }
  /**
   * To get returned filter for bpm request
   */
  public static get RETURNED_FILTER() {
    return {
      column: {
        columnName: TransactionState.TEXTATTRIBUTE6
      },
      value: BPMTaskConstants.TRN_STATE_RETURN,
      operator: BPMOperators.EQUAL
    };
  }
  /**
   * To get Ola Exceeded filter for bpm request
   */
  public static get OLA_EXCEEDED_FILTER() {
    return {
      column: {
        columnName: TransactionState.PROTECTEDTEXTATTRIBUTE7
      },
      value: BPMTaskConstants.TRN_OLA_EXCEEDED,
      operator: BPMOperators.EQUAL
    };
  }
  public static TRANSACTION_FILTER(element: string[]) {
    return {
      column: {
        columnName: SearchColumn.TITLEENGLISH
      },
      valueList: {
        value: element
        },
      operator: BPMOperators.IN
    };
  }

  public static ROLES_FILTER(element: string[]) {
    return {
      column: {
        columnName: SearchColumn.SWIMLANEROLE
      },
      valueList: {
        value: element
        },
      operator: BPMOperators.IN
    };
  }


  /**
   * To get assigned filter for bpm request
   */
  public static get ASSIGNED_FILTER() {
    return {
      column: {
        columnName: TransactionState.STATE
      },
      value: BPMTaskConstants.TRN_STATE_ASSIGNED,
      operator: BPMOperators.EQUAL
    };
  }
  public static get GROUP_FILTER() {
    return {
      column: {
        columnName: TransactionState.ISGROUP
      },
      value: BPMTaskConstants.TRN_STATE_T,
      operator: BPMOperators.EQUAL
    };
  }
  public static get VERSIONREASON_FILTER() {
    return {
      column: {
        columnName: TransactionState.VERSIONREASON
      },
      value: BPMTaskConstants.TRN_TASKVERSION_REASON_ACQUIRED,
      operator: BPMOperators.NOT_EQUAL
    };
  }
  public static get PROTECTEDTEXT_FILTER() {
    return {
      column: {
        columnName: TransactionState.PROTECTEDTEXTATTRIBUTE1
      },
      value: BPMTaskConstants.TRN_CLAIMED,
      operator: BPMOperators.NOT_EQUAL
    };
  }
  /**
   * To get stale filter for bpm request
   */
  public static get STALE_FILTER() {
    return {
      column: {
        columnName: TransactionState.STATE
      },
      value: BPMTaskConstants.TRN_STATE_STALE,
      operator: BPMOperators.NOT_EQUAL
    };
  }
  public static get SUB_STALE_FILTER() {
    return {
      column: {
        columnName: TransactionState.SUBSTATE
      },
      value: BPMTaskConstants.TRN_ACQUIRED,
      operator: BPMOperators.NOT_EQUAL
    };
  }
  /**
   * To get suspended filter for bpm request
   */
  public static get SUSPENDED_FILTER() {
    return {
      column: {
        columnName: TransactionState.STATE
      },
      value: BPMTaskConstants.TRN_STATE_SUSPENDED,
      operator: BPMOperators.EQUAL
    };
  }
}
