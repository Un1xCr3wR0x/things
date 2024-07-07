/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class TransactionsFilterConstants {
  public static get FILTER_FOR_TRANSACTIONS() {
    return [
      {
        value: {
          english: 'Completed',
          arabic: 'مكتملة'
        },
        sequence: 1
      },
      {
        value: {
          english: 'In Progress',
          arabic: 'قيد المعالجة'
        },
        sequence: 2
      },
      {
        value: {
          english: 'Draft',
          arabic: 'مسودة'
        },
        sequence: 3
      }
    ];
  }
}
