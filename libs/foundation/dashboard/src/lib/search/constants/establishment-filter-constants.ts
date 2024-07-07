/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EstablishmentFilterConstants {
  public static get TYPE_FILTER_FOR_ESTABLISHMENT() {
    return [
      {
        code: true,
        value: {
          arabic: '',
          english: 'GCC'
        }
      },
      {
        code: false,
        value: {
          arabic: '',
          english: 'All'
        }
      }
    ];
  }

  public static get COUNTRY_FLAG() {
    return [
      {
        country: 'Saudi Arabia',
        flagClass: 'flag-icon-sa'
      },
      {
        country: 'Kuwait',
        flagClass: 'flag-icon-kw'
      },
      {
        country: 'Bahrain',
        flagClass: 'flag-icon-bh'
      },
      {
        country: 'Oman',
        flagClass: 'flag-icon-om'
      },
      {
        country: 'Qatar',
        flagClass: 'flag-icon-qa'
      },
      {
        country: 'United Arab Emirates',
        flagClass: 'flag-icon-ae'
      }
    ];
  }
}
