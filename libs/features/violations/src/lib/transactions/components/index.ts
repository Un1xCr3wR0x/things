/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CANCEL_VIOLATIONS_TRANSACTIONS_COMPONENTS } from './cancel-violations';
import { MODIFY_VIOLATIONS_TRANSACTIONS_COMPONENTS } from './modify-violation';
import { RAISE_VIOLATIONS_TRANSACTIONS_COMPONENTS } from './raise-violations';
import { SHARED_TRANSACTIONS_COMPONENTS } from './shared';
import { APPEAL_ON_VIOLATION_COMPONENTS } from './appeal-on-violation';

export const TRANSACTIONS_COMPONENTS = [
  ...RAISE_VIOLATIONS_TRANSACTIONS_COMPONENTS,
  ...SHARED_TRANSACTIONS_COMPONENTS,
  ...CANCEL_VIOLATIONS_TRANSACTIONS_COMPONENTS,
  ...MODIFY_VIOLATIONS_TRANSACTIONS_COMPONENTS,
  ...APPEAL_ON_VIOLATION_COMPONENTS
];

export * from './raise-violations';
export * from './shared';
export * from './cancel-violations';
export * from './appeal-on-violation';
