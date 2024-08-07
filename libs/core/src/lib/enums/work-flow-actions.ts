/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum WorkFlowActions {
  SUBMIT = 'SUBMIT',
  UPDATE = 'UPDATE',
  REJECT = 'REJECT',
  RETURN = 'RETURN',
  ASSIGN_TO_PREPARATION = 'ASSIGNTOPREPARATION',
  APPROVE = 'APPROVE',
  APPROVE_WITH_DOCS = 'APPROVEBYDOC', 
  RQSTINSPECTION = 'RQSTINSPECTION',
  APPROVE_WITH = 'CLOSEWITHDISABILITY',
  APPROVE_WITHOUT = 'CLOSEWITHOUTDISABILITY',
  FC_APPROVE = 'FINANCIAL CONTROLLER APPROVE',
  CLOSE = 'CLOSE',
  EXTEND = 'EXTEND',
  FLAGGED = 'AUDITABLE',
  SEND_FOR_INSPECTION = 'SENDFORINSPECTION',
  SEND_FOR_CLARIFICATION = 'REQUESTCLARIFICATION',
  REQUEST_CLARIFICATION_FROM_CONTRIBUTOR = 'REQUESTCLARIFICATIONFROMCONTRIBUTOR',
  REQUEST_MEDICAL_REPORTS = 'REQUESTMEDICALREPORTS',
  RE_ASSIGN_DEPARTMENT = 'REASSIGN_TO_DEPT',
  ESCALATE = 'ESCALLATE',
  DELEGATE = 'DELLEGATE',
  RESOLVE = 'RESOLVE',
  PROVIDE_INFORMATION = 'PROVIDE_INFORMATION',
  REQUEST_INFORMATION = 'REQUEST_INFORMATION',
  RETURN_TO_CUSTOMER = 'RETURN',
  RETURN_TO_CUSTOMER_CARE = 'RETURN_TO_CUSTOMER_CARE',
  RESUBMIT = 'RESUBMIT',
  REOPEN = 'REOPEN',
  ACKNOWLEDGE = 'ACKNOWLEDGE',
  REQUEST_ITSM = 'REQUEST_ITSM',
  ASSIGN_TO_SPECIALIST = 'ASSIGNTOSPECIALIST',
  TO_SPECIALIST = 'TOSPECIALIST',
  REASSESSMENT = 'Reassessment',
  BENEFITSNONOCCDISABILITY = 'Benefit Disability Assessment',
  HEIR_DISABILITY_ASSESSMENT = 'Heir Disability Assessment',
  OCC_DISABILITY_REASSESSMENT = 'Occupational Disability Reassessment',
  NON_OCC_DISABILITY_REASSESSMENT = 'Non-Occupational Disability Reassessment',
  HEIR_DISABILITY_REASSESSMENT = 'Heir Disability Reassessment',
  NON_OCC_DISABILITY_ASSESSMENT = 'Non-Occupational Disability Assessment',
  NON_OCC_DEPENDENT_ASSESSMENT = 'Non-Occupational Dependent Disability Assessment',
  CLOSE_INJURY_TPA = 'Close Injury TPA',
  CLOSE_COMPLICATION_TPA = 'Close Complication TPA',
  EARLY_REASSESSMENT = 'Early Re-assessment',
  APPEAL_ASSESSMENT = 'Appeal Assessment',
  ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR = 'Assign Assessment to GOSI Doctor',
  ASSIGN_PARTICIPANT_TO_SESSION = 'Assign participant to Session',
  APPEAL = 'APPEAL',
  MB_BENEFIT_ASSESSMENT = 'MB Benefit Assessment',
  REQUEST_CLARIFICATION = 'Request Clarification from Contributor',
  DEPENDENT_DISABILITY_REASSESSMENT = 'Non-Occupational Dependent Disability Reassessment',
  MODIFY_VISITING_DOCTOR = 'MODIFYVISITINGDOCTOR',
  ASSIGN_ASSESSMENT_TO_HO_DOCTOR = 'Assign Assessment to HO Doctor'
}
