/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export enum Route {
  PROFILE_PRIVATE = 'Profile Private',
  PROFILE_PUBLIC = 'Profile Public',
  ADD_INJURY = 'Add Injury',
  ADD_COMPLICATION = 'Add Complication',
  ADD_DISEASE = 'Disease',
  ALLOWANCE = 'Allowance',
  ALLOWANCE_TRANSACTION = 'Allowance Transaction',
  ALLOWANCE_PAYEE = 'Allowance Payee',
  ALLOWANCE_PAYEE_HISTORY = 'Allowance Payee History',
  CLOSE_COMP = 'Close Complication',
  CLOSE_INJURY = 'Close Injury',
  MODIFY_COMP = 'Modify Complication',
  MODIFY_INJURY = 'Modify Injury',
  REJECT_COMP = 'Reject Complication',
  REJECT_INJURY = 'Reject Injury',
  REOPEN_COMP = 'Reopen Complication',
  REOPEN_INJURY = 'Reopen Injury',
  COMPLICATION = 'Complication',
  REIMBURSEMENT = 'Reimbursement',
  HOLD_ALLOWANCE = 'Hold',
  RESUME_ALLOWANCE = 'Resume',
  HOLD_RESUME_TRACE = 'hold-resume',
  TRANSACTION_TRACE = 'Transaction Trace',
  TRANSACTION_TRACE_COMPLICATION = 'Transaction Trace Complication',
  TRANSACTION_TRACE_DISEASE = 'Transaction Trace Disease',
  TRANSACTION_TRACE_TRANSFER_INJURY = 'Transaction Trace Transfer Injury',
  CLAIMS_VALIDATOR = 'Claims',
  INVOICE = 'invoice',
  AUDITOR = 'Auditor',
  AUDITOR_ALLOWANCE = 'Auditor Allowance',
  AUDITOR_VIEW = 'Auditor View',
  PROFILE_INDIVIDUAL = 'Profile Individual',
  DASBOARD_INDIVIDUAL = 'Dashboard Individual',
  INDIVIDUAL_PROFILE_OVERVIEW = 'Individual Profile Overview',
  INDIVIDUAL_PROFILE_OH = 'Individual Profile OH',
  CONTROLLER_ALLOWANCE_AUDIT = 'Initiate Injury Allowance Auditor Workflow',
  REPATRIATION = 'Add dead body repatriation',
  VALIDATOR_DISEASE = 'Validator Disease',
}
export const routeTo = function (
  route,
  regNo,
  sin,
  id?,
  refId?,
  invoiceId?,
  tpaCode?,
  claimNo?,
  personId?,
  isIndividualApp?: boolean
) {
  if (route === Route.ADD_INJURY) {
    return `home/oh/validator/injury`;
  } else if (route === Route.ADD_COMPLICATION) {
    return `home/oh/validator/complication`;
  } else if (route === Route.REJECT_INJURY) {
    return `home/oh/validator/reject-injury`;
  } else if (route === Route.REJECT_COMP) {
    return `home/oh/validator/reject-complication`;
  } else if (route === Route.MODIFY_INJURY) {
    return `home/oh/validator/modify-injury`;
  } else if (route === Route.MODIFY_COMP) {
    return `home/oh/validator/modify-complication`;
  } else if (route === Route.REOPEN_INJURY) {
    return `home/oh/validator/reopen-injury`;
  } else if (route === Route.REOPEN_COMP) {
    return `home/oh/validator/reopen-complication`;
  } else if (route === Route.CLOSE_INJURY) {
    return `home/oh/validator/close-injury`;
  } else if (route === Route.CLOSE_COMP) {
    return `home/oh/validator/close-complication`;
  } else if (route === Route.ALLOWANCE_PAYEE) {
    return `home/oh/validator/allowance-payee`;
  } else if (route === Route.ALLOWANCE) {
    return `home/oh/validator/allowance`;
  } else if (route === Route.REIMBURSEMENT) {
    return `home/oh/validator/validate-reimbursement`;
  } else if (route === Route.COMPLICATION) {
    return `home/oh/complication/add`;
  } else if (route === Route.REPATRIATION) {
    return `home/oh/validator/repatriation`;
  } else if(route === Route.VALIDATOR_DISEASE){
    return `home/oh/validator/disease`;
  } 
else {
    return routePath(route, regNo, sin, id, refId, invoiceId, tpaCode, claimNo, personId, isIndividualApp);
  }
};
export const routePath = function (
  route,
  regNo,
  sin,
  id?,
  refId?,
  invoiceId?,
  tpaCode?,
  claimNo?,
  personId?,
  isIndividualApp?: boolean
) {
  if (route === Route.PROFILE_PRIVATE) {
    return `home/profile/contributor/${regNo}/${sin}/injury/history/${sin}`;
  } else if (route === Route.PROFILE_PUBLIC) {
    return `home/profile/contributor/${regNo}/${sin}/injury/history/${sin}`;
  } else if (route === Route.HOLD_ALLOWANCE) {
    return `home/oh/validator/hold-allowance`;
  } else if (route === Route.RESUME_ALLOWANCE) {
    return `home/oh/validator/resume-allowance`;
  } else if (route === Route.TRANSACTION_TRACE) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/injury`;
  } else if (route === Route.TRANSACTION_TRACE_COMPLICATION) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/complication`;
  } else if (route === Route.TRANSACTION_TRACE_DISEASE) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/disease`;
  } else if (route === Route.TRANSACTION_TRACE_TRANSFER_INJURY) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/disease`;
  } else if (route === Route.INVOICE) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/invoice`;
  } else if (route === Route.HOLD_RESUME_TRACE) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/hold-resume`;
  } else if (route === Route.ALLOWANCE_PAYEE_HISTORY) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/allowance-payee`;
  } else if (route === Route.ALLOWANCE_TRANSACTION) {
    return `home/transactions/view/${id}/${refId}/oh/transactions/view`;
  } else if (route === Route.CLAIMS_VALIDATOR) {
    return 'home/oh/validator/oh-claims';
  } else if (route === Route.AUDITOR) {
    return 'home/oh/validator/auditor';
  } else if (route === Route.AUDITOR_ALLOWANCE) {
    return 'home/oh/validator/allowance-audit';
  } else if (route === Route.AUDITOR_VIEW) {
    return `home/oh/validator/auditor/claim/${tpaCode}/${invoiceId}/${claimNo}`;
  } else if (route === Route.PROFILE_INDIVIDUAL) {
    return `home/oh/injury/history`;
  } else if (route === Route.DASBOARD_INDIVIDUAL) {
    return `home/dashboard/individual`;
  } else if (route === Route.INDIVIDUAL_PROFILE_OVERVIEW) {
    return `home/profile/individual/internal/${personId}/overview`;
  } else if (route === Route.CONTROLLER_ALLOWANCE_AUDIT) {
    return `home/oh/validator/audit-allowance`;
  } else if (route == Route.INDIVIDUAL_PROFILE_OH) {
    if (personId) {
      return `home/profile/individual/internal/${personId}/occupational-hazards`;
    } else if (sin) {
      return `home/profile/individual/internal/${sin}/occupational-hazards`;
    }
  } else if (isIndividualApp) {
    // if none of the above is true and it is IndApp, it should navigate to txn history (list/history)
    // it should not navigate to list/worklist since its an establishment-private screen
    return `home/transactions/list/history`;
  } else {
    return 'home/transactions/list/worklist';
  }
};
