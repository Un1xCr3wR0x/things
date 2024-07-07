/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DASHBOARD_COMPONENTS } from './dashboard';
import { DETAILED_BILL_COMPONENTS } from './detailed-bill';
import { BILL_HISTORY_SC_COMPONENTS } from './bill-history';
import { ALLOCATION_COMPONENTS } from './allocation';
import { BILL_DETAILS_COMPONENTS } from './bill-details';

export const ESTABLISHMENT_DASHBOARD_COMPONENTS = [
  DASHBOARD_COMPONENTS,
  DETAILED_BILL_COMPONENTS,
  BILL_HISTORY_SC_COMPONENTS,
  ALLOCATION_COMPONENTS,
  BILL_DETAILS_COMPONENTS
];

export * from './dashboard';
export * from './detailed-bill';
export * from './bill-history';
export * from './allocation';
export * from './bill-details';
