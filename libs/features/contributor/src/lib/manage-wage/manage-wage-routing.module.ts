/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmDeactivateGuard } from '../shared/guards';
import { ManageWageTabsScComponent } from './components';
import { BulkWageCustomListScComponent, BulkWageUpdateScComponent } from './components/bulk-wage';
import { IndividualEngagementsDetailsScComponent } from './components/individual-engagement/components/individual-engagements-details-sc/individual-engagements-details-sc.component';
import { IndividualWageScComponent, IndividualWageUpdateScComponent } from './components/individual-wage';
import { UnifiedEngagementScComponent } from './components/unified-engagement';
import { VicWageUpdateScComponent } from './components/vic-individual-wage';
import { IndividualCertificatesScComponent } from './components';
import { ModifyJoiningLeavingDateScComponent } from './components/individual-modify-engagement/modify-joining-leaving-date-sc/modify-joining-leaving-date-sc.component';

const routes: Routes = [
  {
    path: 'contributions',
    component: IndividualEngagementsDetailsScComponent
  },
  {
    path: 'certificates',
    component: IndividualCertificatesScComponent
  },
  { path: '', redirectTo: 'individual', pathMatch: 'full' },
  {
    path: 'individual',
    component: IndividualWageScComponent
  },
  {
    path: 'JoiningDate',
    component: ModifyJoiningLeavingDateScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.E-INSPECTION-MODIFY-JOINING-DATE'
    }
  },
  {
    path: 'Cancelengagement',
    component: ModifyJoiningLeavingDateScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.E-INSPECTION-CANCEL-ENGAGEMENT'
    }
  },
  {
    path: 'LeavingDate',
    component: ModifyJoiningLeavingDateScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.MODIFY-E-INSPECTION-MODIFY-LEAVING-DATE'
    }
  },
  {
    path: 'Terminateengagement',
    component: ModifyJoiningLeavingDateScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.E-INSPECTION-TERMINATE-ENGAGEMENT'
    }
  },
  { path: 'unified', component: UnifiedEngagementScComponent },
  {
    path: 'individual/update',
    component: IndividualWageUpdateScComponent,
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: 'individual/update/edit',
    component: IndividualWageUpdateScComponent
  },
  {
    path: 'update',
    component: ManageWageTabsScComponent
  },
  {
    path: 'update/bulk',
    component: BulkWageUpdateScComponent
  },
  {
    path: 'update/bulk/edit',
    component: BulkWageUpdateScComponent
  },
  {
    path: 'bulk/custom-list',
    component: BulkWageCustomListScComponent
  },
  {
    path: 'update/vic-wage',
    component: VicWageUpdateScComponent,
    data: {
      breadcrumb: 'CONTRIBUTOR.MODIFY-VIC-WAGE'
    }
  },
  {
    path: 'update/vic-wage/edit',
    component: VicWageUpdateScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageWageRoutingModule {}
