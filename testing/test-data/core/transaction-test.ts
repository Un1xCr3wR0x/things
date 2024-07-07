/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
export class Transaction {
  transactionId: number;
  transactionType: BilingualText;
  contributorId: number;
  establishmentId: number;
  initiationDate: Date;
  lastActionDate: Date;
  transactionStatus: BilingualText;
  entryChannel: BilingualText;
}
export const transactionTraceData = {
  items: [
    {
      title: {
        arabic: 'إبلاغ عن أخطار مهنية',
        english: 'Report Occupational Hazard'
      },
      description: {
        arabic: '10000602 :للمنشأة رقم',
        english: 'for Establishment: 10000602'
      },
      transactionRefNo: 492050,
      initiatedDate: {
        gregorian: '2020-07-24T08:23:53.000Z',
        hijiri: '1441-12-03'
      },
      lastActionedDate: {
        gregorian: '2020-07-24T08:23:53.000Z',
        hijiri: '1441-12-03'
      },
      status: {
        arabic: 'قيد المعالجة',
        english: 'In Progress'
      },
      channel: {
        arabic: '',
        english: 'unknown'
      },
      registrationNo: '10000602',
      sin: '601336235',
      businessId: '1001963886',
      transactionId: 101501
    }
  ]
};
export const transactionListData = {
  items: [
    {
      transactionId: 100017,
      transactionType: {
        english: 'Report Injury',
        arabic: 'الابلاغ عن اصابة'
      },
      contributorId: 1826262,
      establishmentId: 1826262,
      intiationDate: '2020-02-02T10:48:49.112Z',
      lastActionDate: '2020-04-02T10:48:49.112Z',
      transactionStatus: {
        english: 'In Progress',
        arabic: 'بلاغ قيد المعالج'
      },
      entryChannel: {
        english: 'Online',
        arabic: 'متصل'
      }
    },
    {
      transactionId: 100018,
      transactionType: {
        english: 'Register Contributor',
        arabic: 'تسجيل مشترك'
      },
      contributorId: 1826262,
      establishmentId: 1826262,
      intiationDate: '2020-03-02T10:48:49.112Z',
      lastActionDate: '2020-05-02T10:48:49.112Z',
      transactionStatus: {
        english: 'Approved',
        arabic: 'اعتماد'
      },
      entryChannel: {
        english: 'Field Office',
        arabic: 'المكتب الميداني'
      }
    }
  ]
};
export const transactionListFilterData = {
  items: [
    {
      transactionId: 100018,
      transactionType: {
        english: 'Register Contributor',
        arabic: 'تسجيل مشترك'
      },
      contributorId: 1826262,
      establishmentId: 1826262,
      intiationDate: '2020-03-02T10:48:49.112Z',
      lastActionDate: '2020-05-02T10:48:49.112Z',
      transactionStatus: {
        english: 'Approved',
        arabic: 'اعتماد'
      },
      entryChannel: {
        english: 'System',
        arabic: 'متصل'
      }
    },
    {
      transactionId: 100017,
      transactionType: {
        english: 'Report Injury',
        arabic: 'الابلاغ عن اصابة'
      },
      contributorId: 1826262,
      establishmentId: 1826262,
      intiationDate: '2020-02-02T10:48:49.112Z',
      lastActionDate: '2020-04-02T10:48:49.112Z',
      transactionStatus: {
        english: 'In Progress',
        arabic: 'بلاغ قيد المعالج'
      },
      entryChannel: {
        english: 'Online',
        arabic: 'متصل'
      }
    },

    {
      transactionId: 100018,
      transactionType: {
        english: 'Register Contributor',
        arabic: 'تسجيل مشترك'
      },
      contributorId: 1826262,
      establishmentId: 1826262,
      intiationDate: '2020-03-02T10:48:49.112Z',
      lastActionDate: '2020-05-02T10:48:49.112Z',
      transactionStatus: {
        english: 'Approved',
        arabic: 'اعتماد'
      },
      entryChannel: {
        english: 'Field Office',
        arabic: 'المكتب الميداني'
      }
    }
  ]
};
