/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum WorkFlowStatusType {
  BASICDETAILS = 'change establishment basic details',
  IDENTIFIER = 'change establishment identification details',
  BANKDETAILS = 'change establishment bank details',
  CONTACTDETAILS = 'change establishment contact details',
  ADDRESSDETAILS = 'change establishment address details',
  OWNER = 'manage establishment owners details',
  LEGALENTITY = 'change establishment legal entity',
  REPLACE_SUPER_ADMIN = 'replace super admin',
  DELINK = 'delink branch from a main establishment',
  CBM = 'change establishment type',
  CLOSE_ESTABLISHMENT = 'Terminate establishment',
  LINK_ESTABLISHMENT = 'link establishment to another establishment',
  FLAG_ESTABLISHMENT = 'Flag establishment',
  COMPLETE_PROACTIVE = 'complete establishment details',
  LATE_FEE = 'change establishment late fee details',
  RECEIVE_CONT_PAYMENT = 'Receive Contribution Payment',
  CANCEL_RECEIPT = 'Cancel Receipt',
  PENALTY_WAIVER = 'Penalty Waiver',
  CREDIT_TRANSFER = 'Credit Management',
  CREDIT_REFUND_ESTABLISHMENT = 'Establishment Credit Refund',
  INSTALLMENT = 'Installment',
  MOF_PAYMENT = 'Change establishment payment type',
  ADD_SUPER_ADMIN = 'Add super admin',
  REOPEN_ESTABLISHMENT = 'reopen establishment'
}
