/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
/**
 *
 * This class is to declare complaints module constants.
 *
 * @export
 * @class SuggestionListSortConstants
 */
export class SuggestionListSortConstants {
  public static get SORT_FOR_SUGGESTION_LIST() {
    return [
      {
        value: { english: 'Date', arabic: 'Date' },
        sequence: 1,
        column: 'createdDate',
        code: 1000
      },
      {
        value: { english: 'Transaction ID', arabic: 'Transaction ID' },
        sequence: 2,
        column: 'transaction',
        code: 1001
      },
      {
        value: { english: 'Description', arabic: 'Description' },
        sequence: 3,
        column: 'description',
        code: 1002
      },
      {
        value: { english: 'Status', arabic: 'Status' },
        sequence: 3,
        column: 'status',
        code: 1003
      }
    ];
  }
}
