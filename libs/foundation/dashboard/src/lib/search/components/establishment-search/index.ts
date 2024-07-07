/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { QuickActionsDcComponent } from './quick-actions-dc/quick-actions-dc.component';
import { ProfileSummaryDcComponent } from './profile-summary-dc/profile-summary-dc.component';

import { TransactionInWorkflowDcComponent } from './transaction-in-workflow-dc/transaction-in-workflow-dc.component';
import { EstablishmentEntriesDcComponent } from './establishment-entries-dc/establishment-entries-dc.component';

import { EstablishmentSearchScComponent } from './establishment-search-sc/establishment-search-sc.component';
import { EstablishmentDetailsScComponent } from './establishment-details-sc/establishment-details-sc.component';

export const DASHBOARD_ESTABLISHMENT_SEARCH_COMPONENTS = [
  QuickActionsDcComponent,
  ProfileSummaryDcComponent,

  TransactionInWorkflowDcComponent,
  EstablishmentEntriesDcComponent,

  EstablishmentSearchScComponent,

  EstablishmentDetailsScComponent
];

export * from './quick-actions-dc/quick-actions-dc.component';
export * from './profile-summary-dc/profile-summary-dc.component';
export * from './transaction-in-workflow-dc/transaction-in-workflow-dc.component';

export * from './establishment-entries-dc/establishment-entries-dc.component';

export * from './establishment-search-sc/establishment-search-sc.component';

export * from './establishment-details-sc/establishment-details-sc.component';
