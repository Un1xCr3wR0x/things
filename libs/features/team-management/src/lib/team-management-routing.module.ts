/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamManagementDcComponent } from './team-management-dc.component';
import { SupervisorViewScComponent } from './supervisor-view/supervisor-view-sc/supervisor-view-sc.component';
import { ValidatorProfileScComponent } from './supervisor-view/validator-profile-sc/validator-profile-sc.component';
import { TeamTransactionsViewScComponent, MyTeamViewScComponent } from './shared';
import { BulkReassignTransactionsScComponent } from './supervisor-view';

export const routes: Routes = [
  {
    path: '',
    component: TeamManagementDcComponent,
    children: [
      {
        path: '',
        component: SupervisorViewScComponent,
        children: [
          { path: '', redirectTo: 'my-team', pathMatch: 'full' },
          { path: 'my-team', component: MyTeamViewScComponent },
          { path: 'transactions', component: TeamTransactionsViewScComponent }
        ]
      },
      {
        path: 'validator-profile',
        component: ValidatorProfileScComponent,
        data: {
          breadcrumb: 'TEAM-MANAGEMENT.VALIDATOR_PROFILE'
        }
      }
    ]
  },
  {
    path: 'reassign',
    component: BulkReassignTransactionsScComponent,
    data: {
      breadcrumb: 'TEAM-MANAGEMENT.BULK-REASSIGN-TRANSACTIONS'
    }
  }

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamManagementRoutingModule {}
