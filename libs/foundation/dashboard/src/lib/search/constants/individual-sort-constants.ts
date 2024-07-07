/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class IndividualSortConstants {
  public static get SORT_FOR_CONTRIBUTOR() {
    return [
      {
        value: { english: 'Name', arabic: 'اسم' },
        sequence: 1,
        column: 'name',
        code: 1000
      },
      {
        value: { english: 'National ID', arabic: 'الهوية الوطنية' },
        sequence: 2,
        column: 'idType',
        code: 1001
      },
      {
        value: { english: 'Status', arabic: 'الحالة' },
        sequence: 3,
        column: 'status',
        code: 1002
      }
    ];
  }
}
