/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

/**
 * This class is to declare occupational-hazard module constants.
 *
 * @export
 * @class OhConstants
 */

export class OhConstants {
  public static get DOCUMENT_TRANSACTION_KEY(): string {
    return 'MANAGE_OH';
  }
  public static get NO_ALLOWANCE(): string {
    return 'There is no occupational hazard allowance for the contributor case.';
  }
  public static get VALIDATOR_ROUTE(): string {
    return '/home/oh/validator';
  }
  public static get PAYEE_MSG() {
    return 'bank account details';
  }
  public static get WIZARD_DOCUMENTS() {
    return 'OCCUPATIONAL-HAZARD.WIZARD-DOCUMENTS';
  }
  public static get WIZARD_REIMBURSEMENT() {
    return 'OCCUPATIONAL-HAZARD.WIZARD_REIMBURSEMENT';
  }

  public static get SEC_CONTACT_DETAILS(): string {
    return 'OCCUPATIONAL-HAZARD.SEC-CONTACT-DETAILS';
  }
  public static get REOPEN_WIZARD() {
    return 'OCCUPATIONAL-HAZARD.REOPENING-DETAILS';
  }
  public static get TRANSACTION_ADD_INJURY(): string {
    return 'Injury';
  }
  public static get MANAGE_OH_CLAIMS(): string {
    return 'Initiate Invoice Payment';
  }
  public static get MANAGE_AUDITOR_FLOW(): string {
    return 'Initiate Auditor Workflow';
  }
  public static get ALLOWANCE_AUDITOR_FLOW(): string {
    return 'Initiate Allowance Auditor Workflow';
  }
  public static get TRANSACTION_REJECT_INJURY(): string {
    return 'OH Rejection Injury';
  }
  public static get TRANSACTION_REJECT_COMPLICATION(): string {
    return 'OH Rejection Complication';
  }

  public static get TRANSACTION_REJECT_INJURY_TPA(): string {
    return 'OH Rejection Injury TPA';
  }
  public static get TRANSACTION_REJECT_COMPLICATION_TPA(): string {
    return 'OH Rejection Complication TPA';
  }
  public static get TRANSACTION_MODIFY_INJURY(): string {
    return 'Modify Injury';
  }
  public static get TRANSACTION_CLOSE_INJURY(): string {
    return 'Close Injury TPA';
  }
  public static get TRANSACTION_CLOSE_COMPLICATION(): string {
    return 'Close Complication TPA';
  }
  public static get TRANSACTION_MODIFY_COMPLICATION(): string {
    return 'Modify Complication';
  }
  public static get TRANSACTION_REOPEN_INJURY(): string {
    return 'OH Reopen Injury';
  }
  public static get TRANSACTION_REOPEN_COMPLICATION(): string {
    return 'Reopen Complication';
  }
  public static get TRANSACTION_ALLOWANCE_PAYEE(): string {
    return 'Update OH Allowance Payee';
  }
  public static get TRANSACTION_ADD_COMPLICATION(): string {
    return 'Complication';
  }
  public static get TRANSACTION_ADD_ALLOWANCE(): string {
    return 'Add allowance';
  }
  public static get TRANSACTION_REIMBURSEMENT_CLAIM(): string {
    return 'REIMBURSEMENT_CLAIM';
  }
  public static get TRANSACTION_ADD_DEADBODY_CLAIMS(): string {
    return 'Add dead body repatriation';
  }
  public static get TRANSACTION_ADD_DIABILITY_CLAIMS(): string {
    return 'Add total disability repatriation';
  }
  public static get DOCUMENTS(): string {
    return 'OCCUPATIONAL-HAZARD.DOCUMENTS-INDIVIDUAL';
  }
  public static get ASSESSMENT_DETAILS(): string {
    return 'OCCUPATIONAL-HAZARD.ASSESSMENT-DETAILS';
  }
  public static get HOLD_ALLOWANCE(): string {
    return 'Hold Allowance';
  }
  public static get REIMBURSMENT_CLAIM(): string {
    return 'Reimbursement Claim';
  }
  public static get TRANSACTION_VALIDATE_REIMBURSMENT(): string {
    return 'Validate Reimbursement';
  }
  public static get RESUME_ALLOWANCE(): string {
    return 'Resume Allowance';
  }
  public static get TRANSACTION_ID(): number {
    return 101501;
  }
  public static get REQUEST_MB_APPEAL(): number {
    return 302050;
  }
  public static get REQUEST_MB_WITHDRAW(): number {
    return 302049;
  }
  public static get REQUEST_MB_RE_ASSESSMENT(): number {
    return 300386;
  }
  public static get PAYEE_TRANSACTION_ID(): number {
    return 101575;
  }
  public static get UPDATE_ALLOWANCE_PAYEE(): string {
    return 'UPDATE_ALLOWANCE_PAYEE';
  }
  public static get REJECT_TRANSACTION_ID(): number {
    return 101553;
  }
  public static get WORKFLOW_ADD_INJURY(): string {
    return 'ADD_INJURY';
  }
  public static get WORKFLOW_ADD_COMPLICATION(): string {
    return 'ADD_COMPLICATION';
  }
  public static get WORKFLOW_MODIFY_COMPLICATION(): string {
    return 'MODIFY_COMPLICATION';
  }
  public static get WORKFLOW_MODIFY_INJURY(): string {
    return 'MODIFY_INJURY';
  }
  public static get WORKFLOW_CLOSE_INJURY(): string {
    return 'CLOSE_INJURY';
  }
  public static get WORKFLOW_CLOSE_COMPLICATION(): string {
    return 'CLOSE_COMPLICATION';
  }
  public static get WORKFLOW_REJECT_INJURY(): string {
    return 'REJECT_INJURY';
  }
  public static get WORKFLOW_REJECT_COMPLICATION(): string {
    return 'REJECT_COMPLICATION';
  }
  public static get WORKFLOW_ADD_REIMBURSEMENT_CLAIM(): string {
    return 'ADD_REIMBURSEMENT_CLAIM';
  }
  public static get WORKFLOW_REOPEN_INJURY(): string {
    return 'REOPEN_INJURY';
  }
  public static get WORKFLOW_REOPEN_COMPLICATION(): string {
    return 'REOPEN_COMPLICATION';
  }
  public static get WORKFLOW_ADD_ALLOWANCE(): string {
    return 'ADD_ALLOWANCE';
  }
  public static get WORKFLOW_ADD_TOTAL_DISABILITY_REPATRIATION(): string {
    return 'ADD_TOTAL_DISABILITY_REPATRIATION';
  }
  public static get WORKFLOW_ADD_DEAD_BODY_REPATRIATION(): string {
    return 'ADD_DEAD_BODY_REPATRIATION';
  }
  public static DATE_ERROR_MESSAGE(): BilingualText {
    return {
      english: 'Start Date should be less than or equal to  End Date',
      arabic: 'يجب أن يكون تاريخ البداية أقل من تاريخ النهاية أو مساويًا له'
    };
  }
  public static SELECT_MAIN_SPECIALTY(): BilingualText {
    return {
      english: 'There should be atleast one main speciality',
      arabic: 'يجب أن يكون هناك تخصص رئيسي واحد على الأقل'
    };
  }
  public static get TRANSACTION_MB_NON_OCC_DISABILITY_ASSESSMENT(): string {
    return 'Benefit Disability Assessment';
  }
  public static MIN_SPECIALITY_ERROR_MESSAGE(): BilingualText {
    return {
      english: 'There should be atleast one speciality',
      arabic: 'يجب أن تختار تخصص واحد على الأقل'
    };
  }
  public static DUPLICATE_SPECILAITY(): BilingualText {
    return {
      english: 'You can’t add same specialties in specialty section',
      arabic: 'لا يمكن إضافة نفس التخصصات في قسم التخصص '
    };
  }
  public static DUPLICATE_BODY_PART(): BilingualText {
    return {
      english: 'You can’t add same body parts in disabled body part section. ',
      arabic: 'لا يمكن إضافة نفس أعضاء الجسم في قسم العجز'
    };
  }
  public static NULL_CATEGORY(): BilingualText {
    return {
      english: 'There should be atleast one Body Part Category',
      arabic: ''
    };
  }
  public static get SUCCESS_MESSAGE(): string {
    return 'OCCUPATIONAL-HAZARD.SUCCESS-MESSAGE';
  }
  public static get TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Occupational Disability Reassessment';
  }
  public static get TRANSACTION_REASSESSMENT(): string {
    return 'Reassessment';
  }
  public static get TRANSACTION_NON_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Non-Occupational Disability Reassessment';
  }
  public static get TRANSACTION_OCC_DISABILITY_REASSESSMENT(): string {
    return 'Occupational Disability Reassessment';
  }
  public static get TRANSACTION_HEIR_DISABILITY_REASSESSMENT(): string {
    return 'Heir Disability Reassessment';
  }
  public static get MEDICAL_REPORT_REQUEST_FORM(): string {
    return 'Medical_report_Request_Form.pdf';
  }
  public static get PSYCHIATRIC_FORM(): string {
    return 'psychiatricAssessment.pdf';
  }
}
