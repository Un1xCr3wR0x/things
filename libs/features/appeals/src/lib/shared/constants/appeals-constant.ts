import { Lov } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AppealConstants {
  public static get APPROVE_REJECT(): Lov[] {
    return [
      {
        value: { english: 'Approve', arabic: 'قبول' },
        sequence: 0
      },
      {
        value: { english: 'Reject', arabic: 'رفض' },
        sequence: 1
      }
    ];
  }
  public static get AGREE_DISAGREE(): Lov[] {
    return [
      {
        value: { english: 'Approve', arabic: 'اتفق' },
        sequence: 0
      },
      {
        value: { english: 'Reject', arabic: 'لا اتفق' },
        sequence: 1
      }
    ];
  }
  public static get PROCESSED_LIST(): Lov[] {
    return [
      {
        value: { english: 'Approve', arabic: 'نعم تمت المعالجه' },
        sequence: 0
      },
      {
        value: { english: 'Reject', arabic: 'لم تتم المعالجه' },
        sequence: 1
      }
    ];
  }
  public static get SPECIALIST_LIST(): Lov[] {
    return [
      { sequence: 1, code: 210, value: { arabic: 'مختص جهات عام', english: 'Public Entities Specialist' } },
      { sequence: 2, code: 211, value: { arabic: 'مختص منشآت خاص', english: 'Private Establishments Specialist' } },
      {
        sequence: 3,
        code: 212,
        value: { arabic: 'مختص منشآت مخالفات', english: 'Violation Establishments Specialist' }
      },
      {
        sequence: 4,
        code: 213,
        value: { arabic: 'مختص اخطار ومعاشات خاص', english: 'Private Warnings and Pensions Specialist' }
      },
      {
        sequence: 5,
        code: 214,
        value: { arabic: 'مختص اخطار ومعاشات مخالفات', english: 'Violation Warnings and Pensions Specialist' }
      },
      {
        sequence: 6,
        code: 215,
        value: { arabic: 'مختص تحصيل أفراد عام', english: 'Public Individual Collection Specialist' }
      },
      {
        sequence: 7,
        code: 216,
        value: { arabic: 'مختص تهيئة الافراد خاص', english: 'Private Individuals Preparation Specialist' }
      },
      {
        sequence: 8,
        code: 217,
        value: { arabic: 'مختص تهيئة الافراد عام', english: 'Public Individuals Preparation Specialist' }
      },
      {
        sequence: 9,
        code: 218,
        value: { arabic: 'مختص تهيئة الافراد مخالفات', english: 'Violation Individuals Preparation Specialist' }
      },
      { sequence: 10, code: 219, value: { arabic: 'مختص تحصيل خاص', english: 'Private Collection Specialist' } },
      { sequence: 11, code: 220, value: { arabic: 'مختص تحصيل مخالفات', english: 'Violation Collection Specialist' } },
      { sequence: 12, code: 221, value: { arabic: 'مختص تحصيل عام', english: 'Public Collection Specialist' } }
    ];
  }
}
