/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EstablishmentSortConstants {
  public static get SORT_FOR_ESTABLISHMENT() {
    return [
      {
        value: { english: 'Establishment Name', arabic: 'اسم المنشأة' },
        sequence: 1,
        column: 'name',
        code: 1000
      },
      {
        value: { english: 'Registartion Number', arabic: 'رقم اشتراك المنشأة' },
        sequence: 2,
        column: 'registrationNo',
        code: 1001
      }
    ];
  }
}
