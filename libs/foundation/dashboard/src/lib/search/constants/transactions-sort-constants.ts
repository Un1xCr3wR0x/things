/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class TransactionsSortConstants {
  public static get SORT_FOR_TRANSACTIONS() {
    return [
      {
        value: { english: 'Initiated Date', arabic: 'تاريخ البدء' },
        sequence: 1,
        column: 'createdDate',
        code: 1000
      },
      {
        value: { english: 'Description', arabic: 'الوصف' },
        sequence: 2,
        column: 'name',
        code: 1001
      },
      {
        value: { english: 'Transaction Number', arabic: 'رقم المعاملة' },
        sequence: 3,
        column: 'transactionTraceId',
        code: 1002
      },
      {
        value: { english: 'Status', arabic: 'الحالة' },
        sequence: 4,
        column: 'status',
        code: 1003
      }
    ];
  }
}
