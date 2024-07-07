/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ConfigurationFilterConstants {
  public static get FILTER_FOR_SESSION_CHANNEL() {
    return [
      {
        english: 'GOSI Office',
        arabic: 'مكتب التأمينات '
      },
      {
        english: 'Virtual',
        arabic: 'افتراضية'
      },
      {
        english: 'Semi Virtual',
        arabic: 'شبه افتراضية'
      }
    ];
  }
  public static get FILTER_FOR_SESSION_TYPE() {
    return [
      {
        value: {
          english: 'Regular',
          arabic: 'دورية'
        },
        sequence: 1
      },
      {
        value: {
          english: 'Ad Hoc',
          arabic: 'محددة'
        },
        sequence: 2
      }
    ];
  }
  public static get FILTER_FOR_STATUS() {
    return [
      {
        english: 'Active',
        arabic: 'نشط'
      },
      {
        english: 'Inactive',
        arabic: 'غير نشط'
      },
      {
        english: 'Hold',
        arabic: 'معلق'
      }
    ];
  }
  public static get FILTER_FOR_SESSION_STATUS() {
    return [
      {
        english: 'Completed',
        arabic: 'منتهي'
      },
      {
        english: 'Upcoming',
        arabic: 'القادمة'
      }
    ];
  }
  public static get FILTER_FOR_SLOT_AVAILABILITY() {
    return [
      {
        value: {
          english: 'Available',
          arabic: 'متوفر'
        },
        sequence: 1
      },
      {
        value: {
          english: 'Unavailable',
          arabic: 'غير متوفر'
        },
        sequence: 2
      }
    ];
  }
}
