/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ADD_ESTABLISMENT_VALIDATOR_COMPONENTS } from './add-establishment';
import { CHANGE_ESTABLISHMENT_VALIDATOR_COMPONENTS } from './change-establishment';
import { CHANGE_MAIN_ESTABLISMENT_VALIDATOR_COMPONENTS } from './change-main-establishment';
import { DELINK_ESTABLISMENT_VALIDATOR_COMPONENTS } from './delink-establishment';
import { FLAG_ESTABLISMENT_VALIDATOR_COMPONENTS } from './flag-establishment';
import { MANAGE_ADMIN_VALIDATOR_COMPONENTS } from './manage-admin';
import { RASED_REQUEST_DOCUMENT_COMPONENTS } from './rased-request-document';
import { RE_OPEN_ESTABLISMENT_VALIDATOR_COMPONENTS } from './re-open-establishment';
import { SAFETY_INSPECTION_VALIDATOR_COMPONENTS } from './safety-inspection';
import { SHARED_VALIDATOR_COMPONENTS } from './shared';
import { TERMINATE_ESTABLISMENT_VALIDATOR_COMPONENTS } from './terminate-establishment';

export const VALIDATOR_COMPONENTS = [
  ...SHARED_VALIDATOR_COMPONENTS,
  ...ADD_ESTABLISMENT_VALIDATOR_COMPONENTS,
  ...CHANGE_ESTABLISHMENT_VALIDATOR_COMPONENTS,
  ...CHANGE_MAIN_ESTABLISMENT_VALIDATOR_COMPONENTS,
  ...DELINK_ESTABLISMENT_VALIDATOR_COMPONENTS,
  ...TERMINATE_ESTABLISMENT_VALIDATOR_COMPONENTS,
  ...DELINK_ESTABLISMENT_VALIDATOR_COMPONENTS,
  ...MANAGE_ADMIN_VALIDATOR_COMPONENTS,
  ...FLAG_ESTABLISMENT_VALIDATOR_COMPONENTS,
  ...SAFETY_INSPECTION_VALIDATOR_COMPONENTS,
  ...RASED_REQUEST_DOCUMENT_COMPONENTS,
  ...RE_OPEN_ESTABLISMENT_VALIDATOR_COMPONENTS
];

export * from './add-establishment';
export * from './change-establishment';
export * from './change-main-establishment';
export * from './delink-establishment';
export * from './flag-establishment';
export * from './manage-admin';
export * from './rased-request-document';
export * from './re-open-establishment';
export * from './safety-inspection';
export * from './shared';
export * from './terminate-establishment';
