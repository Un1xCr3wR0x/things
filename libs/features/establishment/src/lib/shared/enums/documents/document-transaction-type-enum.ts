/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

//document type and mostly the same value is used as document key
export enum DocumentTransactionTypeEnum {
  REGISTER_ESTABLISHMENT = 'REGISTER_ESTABLISHMENT',
  GOV_MOF = 'GOVERNMENT_MOF',
  GOV_NON_MOF = 'GOVERNMENT_NON_MOF',
  ORG_REGIONAL = 'ORGANIZATIONAL_REGIONAL',
  GCC_EST = 'GCC_ESTABLISHMENT',
  GCC_EST_OWNER = 'GCC_ESTABLISHMENT_WITH_OWNER',
  GCC_EST_WITHOUT_OWNER = 'GCC_ESTABLISHMENT_WITHOUT_OWNER',
  ADD_IBAN = '_IBAN', //append this key with the current key for getting new document
  MOL = 'MOL_EST',
  MOL_WITH_LICENSE = 'MOL_EST_WITH_LICENSE_NUMBER',
  CHANGE_BASIC_DETAILS = 'BASIC_DETAILS_CHANGE_ESTABLISHMENT',
  CHANGE_BANK_DETAILS = 'BANK_DETAILS_CHANGE_ESTABLISHMENT',
  CHANGE_GCC_BASIC_DETAILS = 'GCC_CHANGE_ESTABLISHMENT',
  CHANGE_IDENTIFIER_DETAILS = 'IDENTIFIER_CHANGE_ESTABLISHMENT',
  CHANGE_OWNER = 'MANAGE_OWNER',
  CHANGE_CONTACT_DETAILS = 'CONTACT_CHANGE_ESTABLISHMENT',
  CHANGE_ADDRESS_DETAILS = 'ADDRESS_CHANGE_ESTABLISHMENT',
  CHANGE_LEGAL_ENTITY = 'LEGAL_ENTITY_CHANGE',
  CHANGE_BRANCH_TO_MAIN = 'CHANGE_BRANCH_TO_MAIN',
  DELINK_ESTABLISHMENT = 'DELINK_ESTABLISHMENT',
  LINK_ESTABLISHMENT = 'LINK_ESTABLISHMENT',
  REPLACE_SUPER_ADMIN_KEY = 'REPLACE_SUPER_ADMIN',
  ADD_SUPER_ADMIN = 'ADD_SUPER_ADMIN',
  REPLACE_SUPER_ADMIN_FO_TYPE = 'REPLACE_SUPER_ADMIN_FO',
  REPLACE_SUPER_ADMIN_GCC_TYPE = 'REPLACE_GCC_ADMIN',
  TERMINATE_ESTABLISHMENT = 'TERMINATE_ESTABLISHMENT',
  FLAG_ESTABLISHMENT = 'FLAG_ESTABLISHMENT',
  MODIFY_FLAG_ESTABLISHMENT = 'MODIFY_FLAG_ESTABLISHMENT',
  MODIFY_LATE_FEE = 'LATE_FEE_CHANGE_ESTABLISHMENT',
  SAFETY_INSPECION_CHECK = 'SAFETY_INSPECTION_CHECK',
  ZAKAT_CERTIFICATE = 'ZAKAT_CERTIFICATE',
  GOSI_CERTIFICATE = 'GOOD_PAYMENT_CERTIFICATE',
  RASED_DOCUMENT_UPLOAD = 'RASED_DOCUMENT_UPLOAD',
  PAYMENT_TYPE_CHANGE_ESTABLISHMENT = 'PAYMENTTYPE_CHANGE_ESTABLISHMENT',
  ADD_GCC_ADMIN = 'ADD_GCC_ADMIN',
  OH_CERTIFICATE = 'OH_CERTIFICATE',
  FO_DOCUMENTS_UPLOAD = 'FO_DOCUMENTS_UPLOAD',
  SAFETY_INSPECTION_LETTER = 'SAFETY_INSPECTION_LETTER',
  REOPEN_DOCUMENT = 'REOPEN_ESTABLISHMENT',
  SC_SELF_EVALUATION='SELF_EVALUATION_SAFETY_CHECK_TRANSACTION',
  SC_SELF_EVALUATION_TRANSACTION='SELF_EVALUATION_SAFETY_INSPECTION_LETTER'
}
