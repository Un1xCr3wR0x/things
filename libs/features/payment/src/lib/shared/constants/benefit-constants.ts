/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GccCountryEnum } from '@gosi-ui/core';

export class BenefitConstants {
  /*SAR Bilingual Value to remove after fixing the chart */
  public static get CURRENCY_SAR(): BilingualText {
    const SAR = new BilingualText();
    SAR.english = 'SAR';
    SAR.arabic = 'ر.س';
    return SAR;
  }
  public static get GCC_NATIONAL(): string[] {
    return [
      GccCountryEnum.KUWAIT,
      GccCountryEnum.UAE,
      GccCountryEnum.QATAR,
      GccCountryEnum.BAHRAIN,
      GccCountryEnum.OMAN
    ];
  }

  public static get ACTIVE_BILINGUAL_TEXT(): BilingualText {
    return { arabic: 'مستحق', english: 'Active' };
  }

  public static get INACTIVE_BILINGUAL_TEXT(): BilingualText {
    return { arabic: 'غير مستحق', english: 'Inactive' };
  }

  // route to apply for benefits screen
  public static get ROUTE_APPLY_BENEFIT(): string {
    return 'home/benefits/saned/apply';
  }
  // route to reopen for benefits screen
  public static get ROUTE_REOPEN_BENEFIT(): string {
    return 'home/benefits/saned/reopen';
  }

  public static get ROUTE_SANED_BENEFIT_HISTORY(): string {
    return 'home/benefits/saned/sanedbenefithistory';
  }

  public static get ROUTE_SANED_PAYMENT_DETAILS(): string {
    return 'home/benefits/saned/sanedpaymentdetails';
  }

  public static get ROUTE_APPEAL_DETAILS(): string {
    return 'home/benefits/saned/apply';
  }

  public static get TRANSACTIONID_SANED(): string {
    return '201548';
  }

  public static get TRANSACTIONID_WOMEN(): string {
    return '302000';
  }

  public static get TRANSACTIONID_PENSION(): string {
    return '302002';
  }

  public static get TRANSACTIONID_PENSION_LUMPSUM(): string {
    return '302001';
  }

  public static get TRANSACTIONID_EARLY_PENSION(): string {
    return '302005';
  }
  public static get TRANSACTIONID_NON_OCCUPATIONAL_DISABILITY(): string {
    return '302009';
  }
  public static get TRANSACTIONID_NON_OCCUPATIONAL_PENSION(): string {
    return '302007';
  }
  public static get TRANSACTIONID_NON_OCCUPATIONAL_LUMPSUM(): string {
    return '302010';
  }
  public static get TRANSACTIONID_JAILED_PENSION(): string {
    return '302006';
  }
  public static get TRANSACTIONID_JAILED_LUMPSUM(): string {
    return '302011';
  }
  public static get TRANSACTIONID_HAZARDOUS_PENSION(): string {
    return '302012';
  }
  public static get TRANSACTIONID_HAZARDOUS_LUMPSUM(): string {
    return '302013';
  }
  public static get TRANSACTIONID_HEIR_PENSION(): string {
    return '302014';
  }
  public static get TRANSACTIONID_HEIR_LUMPSUM(): string {
    return '302015';
  }
  public static get REQUEST_HEIR_ACCOUNT(): string {
    return '302016';
  }
  public static get REQUEST_JAILED_IMPRISONMENT_ID(): string {
    return '302025';
  }
  public static get RETURN_LUMPSUM_TRANSACTION_CONSTANT(): string {
    return '302020';
  }
  public static get RESTORE_LUMPSUM_TRANSACTION_CONSTANT(): string {
    return '302022';
  }
  public static get REQUEST_MODIFY_DEPENDENT(): string {
    return '302019';
  }
  public static get REQUEST_MODIFY_HEIR(): string {
    return '302021';
  }
  public static get REQUEST_MODIFY_BENEFIT(): string {
    return '302024';
  }
  public static get TRANSACTION_REJECT_SANED(): string {
    return 'Reject Saned';
  }
  public static get TRANSACTION_REQUEST_INSPECTION(): string {
    return 'Request Inspection';
  }
  public static get ROUTE_VALIDATOR_APPROVE_SANED(): string {
    return 'home/benefits/validator/approve-saned';
  }
  public static get ROUTE_VALIDATOR_APPROVE_WOMAN_LUMPSUM(): string {
    return 'home/benefits/validator/approve-women-lumpsum';
  }
  public static get ROUTE_REQUEST_RETIREMENT(): string {
    return 'home/benefits/annuity/pension';
  }
  public static get ROUTE_MODIFY_RETIREMENT(): string {
    return 'home/benefits/annuity/pensionAcitve';
  }
  public static get ROUTE_REQUEST_DISABILITY_ASSESSMENT(): string {
    return 'home/benefits/annuity/disability-assessment';
  }
  public static get ROUTE_REQUEST_RETIREMENT_LUMPSUM(): string {
    return 'home/benefits/annuity/lumpsum';
  }
  public static get ROUTE_REQUEST_FUNERAL_GRANT(): string {
    return 'home/benefits/annuity/funeral-grant';
  }
  public static get ROUTE_MODIFY_RETIREMENT_LUMPSUM(): string {
    return 'home/benefits/annuity/lumpsumAcitve';
  }
  public static get ROUTE_RETURN_LUMPSUM_BENEFIT(): string {
    return 'home/benefits/annuity/return-lumpsum';
  }
  public static get ROUTE_RESTORE_LUMPSUM_BENEFIT(): string {
    return 'home/benefits/annuity/return-lumpsum/restore';
  }
  public static get ROUTE_INJURY_DETAILS(): string {
    return 'home/benefits/annuity/injury';
  }
  public static get ROUTE_LINKED_CONTRIBUTORS(): string {
    return 'home/benefits/annuity/linkedContributors';
  }
  public static get ROUTE_REGISTER_HEIR(): string {
    return 'home/benefits/annuity/register-heir';
  }
  public static get ROUTE_BENEFIT_ADJUSTMENT(): string {
    return '/home/benefits/validator/benefit-recalculate';
  }
  public static get ROUTE_SANED_BENEFIT_RECALCULATE(): string {
    return '/home/benefits/validator/saned-benefit';
  }
  public static get ROUTE_CONTRIBUTOR_BENEFIT_TYPE(): string {
    return '/home/benefits/validator/benefit-type-edit';
  }
  public static get ROUTE_CONTRIBUTOR_VALIDATOR_BENEFIT_TYPE(): string {
    return '/home/benefits/validator/benefit-type';
  }
  public static get ROUTE_MODIFY_PENSION(): string {
    return '/home/benefits/annuity/pensionModify';
  }
  public static get ROUTE_MODIFY_IMPRISONMENT_DETAILS(): string {
    return '/home/benefits/annuity/imprisonmentModify';
  }
  public static get ROUTE_DEPENDENT_DETAILS(): string {
    return '/home/benefits/annuity/dependentEligibility';
  }
  public static get BENEFIT_RECALCULATION_ID(): number {
    return 302026;
  }
  public static get SANED_BENEFIT_RECALCULATION_ID(): number {
    return 302027;
  }
  public static get TRANSACTION_ID(): number {
    return 201548;
  }
  public static get REJECT_TRANSACTION_ID(): number {
    return 101553;
  }
  public static get UI_SANED_WORKFLOW_TYPE(): string {
    return 'REQUEST_UNEMPLOYMENT';
  }
  public static get UI_SANED_DETAILS(): string {
    return 'BENEFITS.SANED-DETAILS';
  }
  public static get UI_RAISE_APPEAL(): string {
    return 'BENEFITS.APPEAL-DETAILS';
  }
  public static get UI_DOCUMENTS(): string {
    return 'BENEFITS.DOCUMENTS';
  }
  public static get BENEFIT_DETAILS(): string {
    return 'BENEFITS.BENEFIT-DETAILS';
  }
  public static get DEPENDENTS_DETAILS(): string {
    return 'BENEFITS.DEPENDENTS-DETAIL';
  }
  public static get WAIVE_BENEFIT(): string {
    return 'BENEFITS.WAIVE-DETAILS-CAPS';
  }
  public static get IMPRISONMENT_DETAILS(): string {
    return 'BENEFITS.IMPRISONMENT-DETAILS_HEADING';
  }
  public static get DISABILITY_DETAILS(): string {
    return 'BENEFITS.DISABILITY-DETAILS';
  }
  public static get HEIR_DETAILS(): string {
    return 'BENEFITS.HEIR-DETAIL';
  }
  public static get RESTORE_DETAILS(): string {
    return 'BENEFITS.UPPER-LUMPSUM-RETURN-DETAILS';
  }
  public static get BENEFIT_COVERAGE_DETAILS(): string {
    return 'BENEFITS.COVERAGE-DETAILS';
  }
  public static get REASON_FOR_BENEFIT(): string {
    return 'BENEFITS.REASON-FOR-BENEFIT-HEADING';
  }
  public static get CONTACT_DETAILS(): string {
    return 'BENEFITS.CONTACT-DETAILS';
  }
  public static get CONTRIBUTOR_CONTACT_DETAILS(): string {
    return 'BENEFITS.CONTRIBUTOR-CONTACT-DETAILS';
  }
  public static get AUTHORISED_CONTACT_DETAILS(): string {
    return 'BENEFITS.AUTHORISED-CONTACT-DETAILS';
  }
  public static get APPLIED_BENEFIT(): string {
    return 'applied';
  }
  public static get NEW_BENEFIT(): string {
    return 'new';
  }
  public static get VAL_EDIT_BENEFIT(): string {
    return 'vedit';
  }
  public static get EDIT_BENEFIT(): string {
    return 'edit';
  }
  public static get BANK_INFO_MESSAGE_DETAILS() {
    return [
      { key: 'BENEFITS.IBAN-VERIFICATION-INFO', param: null },
      { key: 'BENEFITS.BANK-DETAILS-INFO', param: null }
    ];
  }
  //Workflow types
  public static get REQUEST_WOMAN_WORKFLOW_TYPE(): string {
    return 'REQUEST_WOMAN_LUMPSUM';
  }
  public static get REQUEST_UNEMPLOYMENT_WORKFLOW_TYPE(): string {
    return 'REQUEST_UNEMPLOYMENT';
  }

  public static get REQUEST_RP_WORKFLOW_TYPE(): string {
    return 'REQUEST_RETIREMENT_PENSION';
  }

  public static get REQUEST_RPL_WORKFLOW_TYPE(): string {
    return 'REQUEST_RETIREMENT_LUMPSUM';
  }

  public static get REQUEST_NON_OCC_BENEFIT_WORKFLOW_TYPE(): string {
    return 'REQUEST_NON_OCCUPATIONAL_BENEFIT';
  }
  public static get ROUTE_ACTIVE_HEIR_DETAILS(): string {
    return 'home/benefits/annuity/heir-details-active';
  }
  public static get TRANSACTION_APPROVE_SANED(): string {
    return 'Request Unemployment';
  }
  public static get TRANSACTION_WOMAN_LUMPSUM(): string {
    return 'Request Woman Lumpsum';
  }
  public static get TRANSACTION_RETIREMENT_PENSION(): string {
    return 'Request Retirement Pension';
  }
  public static get TRANSACTION_EARLY_RETIREMENT_PENSION(): string {
    return 'Request Early Retirement Pension';
  }
  public static get TRANSACTION_RETIREMENT_LUMPSUM(): string {
    return 'Request Retirement Lumpsum';
  }
  public static get TRANSACTION_NON_OCC_DISABILITY_BENEFIT(): string {
    return 'Request Non Occupational Disability Benefit';
  }
  public static get TRANSACTION_NON_OCC_DISABILITY_LUMPSUM(): string {
    return 'Request Non Occupational Disability Lumpsum Benefit';
  }
  public static get TRANSACTION_NON_OCC_DISABILITY_PENSION(): string {
    return 'Request Non Occupational Disability Pension Benefit';
  }
  public static get TRANSACTION_HEIR_PENSION(): string {
    return 'Request Heir Pension Benefit';
  }
  public static get TRANSACTION_HEIR_LUMPSUM(): string {
    return 'Request Heir Lumpsum Benefit';
  }
  public static get TRANSACTION_JAILED_PENSION(): string {
    return 'Request Jailed Contributor Pension Benefit';
  }
  public static get TRANSACTION_JAILED_LUMPSUM(): string {
    return 'Request Jailed Contributor Lumpsum Benefit';
  }
  public static get TRANSACTION_HAZARDS_RETIRMENT(): string {
    return 'Request Retirement Pension Benefit (Hazardous Occupation)';
  }
  public static get TRANSACTION_HAZARDS_LUMPSUM(): string {
    return 'Request Retirement Lumpsum Benefit (Hazardous Occupation)';
  }
  public static get TRANSACTION_OCC_PENSION(): string {
    return 'Request Occupational Pension Benefit';
  }
  public static get TRANSACTION_OCC_LUMPSUM(): string {
    return 'Request Occupational Lumpsum Benefit';
  }
  public static get TRANSACTION_HEIR_REGISTER(): string {
    return 'Register Heir';
  }
  public static get TRANSACTION_REPAY_BENEFIT(): string {
    return 'Repay Benefit';
  }
  public static get TRANSACTION_HOLD_BENEFIT(): string {
    return 'hold benefit';
  }
  public static get MODIFY_BENEFIT(): string {
    return 'Modify Dependents - Retirement Pension Benefit';
  }
  public static get ADD_BENEFIT(): string {
    return 'Add Dependents - Retirement Pension Benefit';
  }
  public static get MODIFY_BENEFITS(): string {
    return 'Modify Benefit';
  }
  public static get MODIFY_HEIR(): string {
    return 'Modify Heir';
  }
  public static get ADD_HEIR(): string {
    return 'Add Heir';
  }
  public static get TRANSACTION_BENEFIT_ADJUSTMENT(): string {
    return 'Benefit Adjustment';
  }
  public static get TRANSACTION_UI_BENEFIT_ADJUSTMENT(): string {
    return 'UI Benefit Adjustment';
  }
  public static get TO_BE_SELECTED() {
    return 'To be Selected';
  }
  public static get PENSION_CONTRIBUTOR() {
    return 'Lumpsum to Pension Acted by Contributor';
  }
  public static get LUMPSUM_CONTRIBUTOR() {
    return 'Lumpsum to Lumpsum Acted by Contributor';
  }
  public static ROUTE_BENEFIT_LIST(regNo, sin): string {
    if (regNo) {
      return `home/profile/contributor/${regNo}/${sin}/benefits/saned/list`;
    } else {
      return `home/profile/contributor/${sin}/benefits/saned/list`;
    }
  }

  public static get TRANSACTION_NUMBER_MAX_LENGTH(): number {
    return 15;
  }

  public static get BANK_NAME_MAX_LENGTH(): number {
    return 50;
  }
  public static get AMOUNT_RECEIVED_SEPARATOR_LIMIT(): number {
    return 10000000000000;
  }
  public static get ADDITIONAL_DETAILS_MAX_LENGTH(): number {
    return 200;
  }
  public static get REPAY_NOTES_MAX_LENGTH(): number {
    return 300;
  }
  public static get DESCRIPTION_MAX_LENGTH(): number {
    return 1500;
  }
  public static get TRANSACTION_MINDATE(): string {
    return '2004-03-01';
  }
  //Constant for other in the bank list.
  public static get OTHER_LIST(): string {
    return 'Other';
  }
  //Constant for other in the bank list.
  public static get BILLER_CODE(): string {
    return '060';
  }
}
