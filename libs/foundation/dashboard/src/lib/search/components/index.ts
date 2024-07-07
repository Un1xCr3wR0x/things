/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { LandingScComponent } from './landing-sc/landing-sc.component';
import { DASHBOARD_ESTABLISHMENT_SEARCH_COMPONENTS } from './establishment-search';
import { DASHBOARD_INDIVIDUAL_SEARCH_COMPONENTS } from './individual-search';
import { DASHBOARD_COMMON_SEARCH_COMPONENTS } from './search-components';
import { DASHBOARD_TRANSACTION_SEARCH_COMPONENTS } from './transaction-search';
export const DASHBOARD_SEARCH_COMPONENTS = [
  LandingScComponent,
  ...DASHBOARD_ESTABLISHMENT_SEARCH_COMPONENTS,
  ...DASHBOARD_COMMON_SEARCH_COMPONENTS,
  ...DASHBOARD_INDIVIDUAL_SEARCH_COMPONENTS,
  ...DASHBOARD_TRANSACTION_SEARCH_COMPONENTS
];

export * from './base/search-base-sc.component';
export * from './landing-sc/landing-sc.component';
export * from './establishment-search';
export * from './individual-search';
export * from './search-components';
export * from './transaction-search';
