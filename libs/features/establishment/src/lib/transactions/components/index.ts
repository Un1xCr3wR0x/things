/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { MEDICAL_INSURANCE_COMPONENT } from '@gosi-ui/features/establishment/lib/transactions/components/medical-insurance';
import { CHANGE_ADDRESS_CHANGE_COMPONENT } from './change-establishment/establishment-address-details';
import { BANK_ACCOUNT_DETAILS_TRANSACTIONS_COMPONENTS } from './change-establishment/establishment-bank-account-details';
import { BASIC_DETAILS_TRANSACTIONS_COMPONENTS } from './change-establishment/establishment-basic-details';
import { CONTACT_DETAILS_TRANSACTIONS_COMPONENTS } from './change-establishment/establishment-contact-details';
import { IDENTIFIER_DETAILS_TRANSACTIONS_COMPONENTS } from './change-establishment/establishment-identifier-details';
import { LATE_FEE_TRANSACTIONS_COMPONENT } from './change-establishment/establishment-late-fee';
import { CHANGE_LEGALENTITY_TRANSACTIONS_COMPONENT } from './change-establishment/establishment-legalentity-change';
import { MANAGE_OWNER_TRANSACTIONS_COMPONENT } from './change-establishment/establishment-manage-owner-change';
import { PAYMENT_TYPE_TRANSACTIONS_COMPONENT } from './change-establishment/establishment-payment-type';
import { CLOSE_ESTABLISMENT_TRANSACTIONS_COMPONENTS } from './close-establishment';
import { COMPLETE_PROACTIVE_TRANSACTIONS_COMPONENTS } from './complete-proactive-reg';
import { ADD_FLAG_TRANSACTIONS_COMPONENTS } from './flag-establishment/add-flag';
import { MODIFY_FLAG_TRANSACTIONS_COMPONENTS } from './flag-establishment/modify-flag';
import { GENERATE_CERTIFICATE_TRANSACTIONS_COMPONENTS } from './generate-certificate';
import { CBM_DETAILS_TRANSACTIONS_COMPONENTS } from './group-level-transaction/cbm-details';
import { DELINK_EST_TRANSACTIONS_COMPONENT } from './group-level-transaction/delink-establishment';
import { ADD_ADMIN_TRANSACTIONS_COMPONENTS } from './manage-admin/add-admin';
import { DELETE_ADMIN_TRANSACTIONS_COMPONENTS } from './manage-admin/delete-admin';
import { MODIFY_ADMIN_TRANSACTIONS_COMPONENTS } from './manage-admin/modify-admins';
import { REPLACE_ADMIN_TRANSACTIONS_COMPONENTS } from './manage-admin/replace-admin';
import { ADD_RELATIONSHIP_MANAGER_TRANSACTIONS_COMPONENTS } from './manage-relationship-manager/add-relationship-manager';
import { MODIFY_RELATIONSHIP_MANAGER_TRANSACTIONS_COMPONENTS } from './manage-relationship-manager/modify-relationship-manager';
import { REGISTER_ESTABLISMENT_TRANSACTIONS_COMPONENTS } from './register-establishment';
import { REOPEN_ESTABLISMENT_TRANSACTIONS_COMPONENTS } from './reopen-establishment';
import { RASED_DOC_UPLOAD_TRANSACTIONS_COMPONENTS } from './safety-inspection/rased-doc-upload';
import { SAFETY_INSPECTION_TRANSACTIONS_COMPONENTS } from './safety-inspection/safety-inspection';
import { SHARED_TRANSACTIONS_COMPONENTS } from './shared';

export const TRANSACTIONS_COMPONENTS = [
  ...SHARED_TRANSACTIONS_COMPONENTS,
  ...BASIC_DETAILS_TRANSACTIONS_COMPONENTS,
  ...CHANGE_LEGALENTITY_TRANSACTIONS_COMPONENT,
  ...MANAGE_OWNER_TRANSACTIONS_COMPONENT,
  ...DELINK_EST_TRANSACTIONS_COMPONENT,
  ...GENERATE_CERTIFICATE_TRANSACTIONS_COMPONENTS,
  ...SAFETY_INSPECTION_TRANSACTIONS_COMPONENTS,
  ...IDENTIFIER_DETAILS_TRANSACTIONS_COMPONENTS,
  ...CHANGE_ADDRESS_CHANGE_COMPONENT,
  ...BANK_ACCOUNT_DETAILS_TRANSACTIONS_COMPONENTS,
  ...CONTACT_DETAILS_TRANSACTIONS_COMPONENTS,
  ...LATE_FEE_TRANSACTIONS_COMPONENT,
  ...PAYMENT_TYPE_TRANSACTIONS_COMPONENT,
  ...CLOSE_ESTABLISMENT_TRANSACTIONS_COMPONENTS,
  ...CBM_DETAILS_TRANSACTIONS_COMPONENTS,
  ...ADD_FLAG_TRANSACTIONS_COMPONENTS,
  ...MODIFY_FLAG_TRANSACTIONS_COMPONENTS,
  ...RASED_DOC_UPLOAD_TRANSACTIONS_COMPONENTS,
  ...ADD_ADMIN_TRANSACTIONS_COMPONENTS,
  ...DELETE_ADMIN_TRANSACTIONS_COMPONENTS,
  ...MODIFY_ADMIN_TRANSACTIONS_COMPONENTS,
  ...REPLACE_ADMIN_TRANSACTIONS_COMPONENTS,
  ...REGISTER_ESTABLISMENT_TRANSACTIONS_COMPONENTS,
  ...ADD_RELATIONSHIP_MANAGER_TRANSACTIONS_COMPONENTS,
  ...MODIFY_RELATIONSHIP_MANAGER_TRANSACTIONS_COMPONENTS,
  ...REOPEN_ESTABLISMENT_TRANSACTIONS_COMPONENTS,
  ...COMPLETE_PROACTIVE_TRANSACTIONS_COMPONENTS,
  ...MEDICAL_INSURANCE_COMPONENT
];

export * from './change-establishment/establishment-address-details';
export * from './change-establishment/establishment-bank-account-details';
export * from './change-establishment/establishment-basic-details';
export * from './change-establishment/establishment-contact-details';
export * from './change-establishment/establishment-identifier-details';
export * from './change-establishment/establishment-late-fee';
export * from './change-establishment/establishment-legalentity-change';
export * from './change-establishment/establishment-manage-owner-change';
export * from './change-establishment/establishment-payment-type';
export * from './close-establishment';
export * from './complete-proactive-reg';
export * from './flag-establishment/add-flag';
export * from './flag-establishment/modify-flag';
export * from './generate-certificate';
export * from './group-level-transaction/cbm-details';
export * from './group-level-transaction/delink-establishment';
export * from './manage-admin/add-admin';
export * from './manage-admin/delete-admin';
export * from './manage-admin/modify-admins';
export * from './manage-admin/replace-admin';
export * from './manage-relationship-manager/add-relationship-manager';
export * from './manage-relationship-manager/modify-relationship-manager';
export * from './medical-insurance';
export * from './register-establishment';
export * from './reopen-establishment';
export * from './safety-inspection/rased-doc-upload';
export * from './safety-inspection/safety-inspection';
export * from './shared';
