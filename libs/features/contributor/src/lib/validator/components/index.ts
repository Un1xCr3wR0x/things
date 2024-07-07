/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ADD_CONTRIBUTOR_COMPONENTS } from './add-contributor';
import { ADD_SECONDED_COMPONENTS } from './add-seconded';
import { ADD_VIC_COMPONENTS } from './add-vic';
import { AUTH_CONTRACT_COMPONENTS } from './authenticate-contract';
import { BULK_WAGE_COMPONENTS } from './bulk-wage';
import { CANCEL_CONTRIBUTOR_COMPONENTS } from './cancel-contributor';
import { CANCEL_RPA_COMPONENTS } from './cancel-rpa';
import { CANCEL_VIC_COMPONENTS } from './cancel-vic';
import { CHANGE_ENGAGEMENT_COMPONENTS } from './change-engagement';
import { MANAGE_E_REGSITER_COMPONENTS } from './e-registration';
import { ENTER_RPA_COMPONENTS } from './enter-rpa';
import { MANAGE_AUTHORIZATION_COMPONENTS } from './manage-authorization';
import { MANAGE_COMPLIANCE_COMPONENTS } from './manage-compliance';
import { MANAGE_WAGE_COMPONENTS } from './manage-wage';
import { REACTIVATE_ENGAGEMENT_COMPONENTS } from './reactivate-engagement';
import { REACTIVATE_VIC_COMPONENTS } from './reactivate-vic';
import { SHARED_VALIDATOR_COMPONENTS } from './shared';
import { TERMINATE_CONTRIBUTOR_COMPONENTS } from './terminate-contributor';
import { TERMINATE_VIC_COMPONENTS } from './terminate-vic';
import { TRANSFER_ALL_CONTRIBUTOR_COMPONENTS } from './transfer-all-contributor';
import { TRANSFER_CONTRIBUTOR_COMPONENTS } from './transfer-contributor';
import { VIC_INDIVIDUAL_WAGE_COMPONENTS } from './vic-individual-wage';

export const VALIDATOR_COMPONENTS = [
  MANAGE_WAGE_COMPONENTS,
  ADD_CONTRIBUTOR_COMPONENTS,
  CHANGE_ENGAGEMENT_COMPONENTS,
  TERMINATE_CONTRIBUTOR_COMPONENTS,
  CANCEL_CONTRIBUTOR_COMPONENTS,
  ADD_SECONDED_COMPONENTS,
  AUTH_CONTRACT_COMPONENTS,
  MANAGE_COMPLIANCE_COMPONENTS,
  TRANSFER_CONTRIBUTOR_COMPONENTS,
  TRANSFER_ALL_CONTRIBUTOR_COMPONENTS,
  BULK_WAGE_COMPONENTS,
  ADD_VIC_COMPONENTS,
  VIC_INDIVIDUAL_WAGE_COMPONENTS,
  TERMINATE_VIC_COMPONENTS,
  CANCEL_VIC_COMPONENTS,
  SHARED_VALIDATOR_COMPONENTS,
  MANAGE_AUTHORIZATION_COMPONENTS,
  MANAGE_E_REGSITER_COMPONENTS,
  REACTIVATE_ENGAGEMENT_COMPONENTS,
  REACTIVATE_VIC_COMPONENTS,
  ENTER_RPA_COMPONENTS,
  CANCEL_RPA_COMPONENTS
];

export * from './add-contributor';
export * from './add-seconded';
export * from './add-vic';
export * from './authenticate-contract';
export * from './bulk-wage';
export * from './cancel-contributor';
export * from './cancel-rpa';
export * from './change-engagement';
export * from './e-registration';
export * from './enter-rpa';
export * from './manage-authorization';
export * from './manage-compliance';
export * from './manage-wage';
export * from './reactivate-engagement';
export * from './shared';
export * from './terminate-contributor';
export * from './terminate-vic';
export * from './transfer-all-contributor';
export * from './transfer-contributor';
export * from './vic-individual-wage';
