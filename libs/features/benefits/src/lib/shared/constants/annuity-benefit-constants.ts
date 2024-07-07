/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AnnuityBenefitTypes {
  public static get AnnuityTypes(): string[] {
    return [
      'Retirement Pension Benefit',
      'Retirement Lumpsum Benefit',
      'Old Age-Woman Retirement Pension', // As told by BE, changing "Woman Pension Benefit" to "Old Age-Woman Retirement Pension"
      'Woman Lumpsum Benefit',
      'Retirement Pension Benefit (Hazardous Occupation)',
      'Retirement Lumpsum Benefit (Hazardous Occupation)',
      'Non-Occupational Disability Pension Benefit',
      'Non-Occupational Disability Lumpsum Benefit',
      'Heir Pension Dead Contributor Benefit',
      'Heir Lumpsum Dead Contributor Benefit',
      'Heir Pension Missing Contributor Benefit',
      'Heir Lumpsum Missing Contributor Benefit',
      'Jailed Contributor Pension Benefit',
      'Jailed Contributor Lumpsum Benefit',
      'Early Retirement Pension Benefit',
      'Non-Occupational Disability Benefit',
      'Funeral grant',
      'Non-Saudi Lumpsum',
      'Occupational Disability Pension Benefit',
      'Occupational Disability Lumpsum Benefit'
    ];
  }
  public static get OccTypes(): string[] {
    return [
      'Occupational Disability Pension Benefit',
      'Occupational Disability Lumpsum Benefit',
      'Occupational Disability Benefit'
    ];
  }
  public static get ModifyBenefits(): string[] {
    return [
      'Modify Benefit',
      'Repay Benefit',
      'Adjustment Modification',
      'Heir Adjustment Modification',
      'Adjustment Repayment',
      'Benefit Adjustment',
      'Third Party Adjustment Modification',
      'Modify Third Party Adjustment',
      'Modify Payee',
      'Hold Benefit',
      'Stop Benefit',
      'Funeral Grant',
      'Restart Benefit',
      'Remove Bank Commitment',
      'Modify Bank Account',
      'Cancel Request Occupational Benefit',
      'UI Modify Bank Account'
    ];
  }
}
