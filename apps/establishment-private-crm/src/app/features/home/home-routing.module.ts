/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components';
import { NotFoundDcComponent } from '@gosi-ui/foundation-theme/src';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      //Inbox Feature
      {
        path: 'inbox',
        loadChildren: () => import('@gosi-ui/foundation/inbox').then(mod => mod.InboxModule),
        data: {
          breadcrumb: 'MENUITEM.INBOX'
        }
      },
      // Transaction Tracing
      {
        path: 'transactions',
        loadChildren: () => import('@gosi-ui/foundation/transaction-tracing').then(mod => mod.TransactionTracingModule)
      },
      {
        path: 'complaints',
        loadChildren: () => import('@gosi-ui/features/complaints').then(mod => mod.ComplaintsModule)
      },
      //Team Management
      {
        path: 'team',
        loadChildren: () => import('@gosi-ui/features/team-management').then(mod => mod.TeamManagementModule),
        data: {
          breadcrumb: 'TEAM-MANAGEMENT.TEAM-MANAGEMENT'
        }
      },
      {
        path: '360',
        loadChildren: () => import('@gosi-ui/features/feature360').then(mod => mod.FeaturesFeature360Module)
      },
      {
        path: 'error',
        component: NotFoundDcComponent
      }
    ]
  }
];

/**
 * Routing module for Home feature
 *
 * @export
 * @class HomeRoutingModule
 */
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class HomeRoutingModule {}
