import { SearchColumn } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to delclare work lsit module constants.
 *
 * @export
 * @class TodoListConstants
 */
export class InboxConstants {
  public static get ERR_EST_NO_RECORD_MESSAGE(): string {
    return 'The requested establishment is unavailable.';
  }

  //Transaction states: Assigned, Completed ....
  public static get TRN_STATE_ASSIGNED(): string {
    return 'ASSIGNED';
  }
  public static get TRN_STATE_REASSIGNED(): string {
    return 'REASSIGNED';
  }
  public static get TRN_STATE_COMPLETED(): string {
    return 'COMPLETED';
  }
  public static get TRN_STATE_WITHDRAWN(): string {
    return 'WITHDRAWN';
  }
  public static get TRN_STATE_RETURNED(): string {
    return 'RETURNED';
  }
  public static get STATE_LIST() {
    return [
      {
        english: InboxConstants.TRN_STATE_ASSIGNED,
        arabic: 'مسندة'
      },
      {
        english: InboxConstants.TRN_STATE_REASSIGNED,
        arabic: 'معاد تعيينها'
      },
      {
        english: InboxConstants.TRN_STATE_RETURNED,
        arabic: 'معادة'
      }
    ];
  }
  public static get STATE_LIST_NEW() {
    return [
      {
        english: 'Assigned',
        arabic: 'مسندة'
      },
      {
        english: 'Reassigned',
        arabic: 'معاد تعيينها'
      }
    ];
  }

  public static get TRN_DEFAULT_ASSIGNEEID(): string {
    return 'sabin';
  }

  public static get TRN_DEFAULT_ADMIN(): string {
    return 'estadmin';
  }

  //Transaction types : TODO and NOTIFICATIONS
  public static get TRN_TYPE_TODOLIST(): string {
    return 'WorkList';
  }
  public static get SORT_FOR_INBOX() {
    return [
      {
        value: { english: 'Priority', arabic: 'الأولوية' },
        sequence: 1,
        column: 'priority',
        code: 1000
      },
      {
        value: { english: 'Description', arabic: 'الوصف' },
        sequence: 2,
        column: SearchColumn.TITLEENGLISH,
        code: 1001
      },
      {
        value: { english: 'Date', arabic: 'التاريخ' },
        sequence: 3,
        column: 'assignedDate',
        code: 1002
      },
      {
        value: { english: 'Transaction #', arabic: 'معاملة' },
        sequence: 4,
        column: SearchColumn.TRANSACTIONID,
        code: 1003
      },
      {
        value: { english: 'Status', arabic: 'الحالة' },
        sequence: 5,
        column: 'state',
        code: 1004
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
      }
    ];
  }
}
