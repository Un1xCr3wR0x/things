import { LovList } from '@gosi-ui/core';

export class ViolationConstants {
  public static get CANCEL_VIOLATION(): string {
    return 'VIOLATIONS.VIOLATION-DETAILS';
  }
  public static get DOCUMENTS(): string {
    return 'VIOLATIONS.DOCUMENTS';
  }
  public static get JUSTIFICATION_MAX_LENGTH(): number {
    return 300;
  }
  public static get DESCRIPTION_MAX_LENGTH(): number {
    return 200;
  }
  public static get SIMIS_TRANSACTION_DATE(): Date {
    // 01-feb-2022
    return new Date('2022-02-01');
  }
  public static get REPETETION_TIER_LIST(): LovList {
    return {
      items: [
        { value: { english: 'First', arabic: 'الأولى' }, sequence: 0 },
        { value: { english: 'Second', arabic: 'الثانية' }, sequence: 1 },
        { value: { english: 'Third or more', arabic: 'الثالثة فأكثر' }, sequence: 2 }
      ]
    };
  }
  public static get REPETITION_TIER_LIST_WRONG_BENEFITS(): LovList {
    return {
      items: [
        { value: { english: 'First', arabic: 'الأولى' }, sequence: 0 },
        { value: { english: 'Second or more', arabic: 'الثانية فأكثر' }, sequence: 1 }
      ]
    };
  }
  public static get BENEFIT_TYPE_LUMPSUM_LIST(): string[] {
 
    return [
      'Oldage-NormalRetirementLumpsum',
      'Oldage-WomanRetirementLumpsum',
      'Oldage-HazardousOccLumpsum',
      'Non-occupational Disability Lumpsum',
      'Occupational Disability Lumpsum',
      'Survivors Lumpsum',
      'Survivors Lumpsum(Missing Worker)',
      'Jailed worker Lumpsum',
      'Non-Saudi Lumpsum'
    ];
  }
  public static get VIOLATION_TYPE_LIST(): LovList {
    return {
      items: [
        { value: { english: 'Letter Date', arabic: 'تاريخ الإشعار' }, sequence: 0 },
        { value: { english: 'Penalty Amount', arabic: 'مقدار الغرامة' }, sequence: 1 },
        { value: { english: 'Amount Paid', arabic: 'المبلغ المدفوع' }, sequence: 2 }
      ]
    };
  }
  public static get CONTRIBUTOR_DATA(): string {
    return 'VIOLATIONS.CONTRIBUTOR_DATA';
  }
  public static get APPEAL_DETAILS(): string {
    return 'VIOLATIONS.APPEAL_DETAILS';
  }
}
