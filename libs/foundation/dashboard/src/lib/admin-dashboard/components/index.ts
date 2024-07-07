/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AllEstablishmentScComponent } from './all-establishment-sc/all-establishment-sc.component';
import { IndividualEstablishmentScComponent } from './individual-establishment-sc/individual-establishment-sc.component';
import { DashboardHeaderDcComponent } from './dashboard-header-dc/dashboard-header-dc.component';

import { EstablishmentListDcComponent } from './establishment-list-dc/establishment-list-dc.component';
import { EstablishmentBranchCardDcComponent } from './establishment-branch-card-dc/establishment-branch-card-dc.component';
import { DASHBOARD_WIDGET_COMPONENTS } from './widgets';
import { EstablishmentFilterDcComponent } from './establishment-filter-dc/establishment-filter-dc.component';
export const ADMIN_DASHBOARD_COMPONENTS = [
  EstablishmentListDcComponent,
  AllEstablishmentScComponent,
  DashboardHeaderDcComponent,
  IndividualEstablishmentScComponent,
  EstablishmentBranchCardDcComponent,
  EstablishmentFilterDcComponent,
  ...DASHBOARD_WIDGET_COMPONENTS
];

export * from './individual-establishment-sc/individual-establishment-sc.component';
export * from './all-establishment-sc/all-establishment-sc.component';
export * from './dashboard-header-dc/dashboard-header-dc.component';
export * from './establishment-list-dc/establishment-list-dc.component';
export * from './establishment-branch-card-dc/establishment-branch-card-dc.component';
export * from './establishment-filter-dc/establishment-filter-dc.component';
