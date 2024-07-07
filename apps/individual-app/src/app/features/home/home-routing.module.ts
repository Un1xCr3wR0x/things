/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeDcComponent } from './components';
import { NotFoundDcComponent } from '@gosi-ui/foundation-theme';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    component: HomeDcComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@gosi-ui/foundation-dashboard').then(mod => mod.DashboardModule),
        data: {
          breadcrumb: 'MENUITEM.DASHBOARD'
        }
      },
      {
        path: 'inbox',
        loadChildren: () => import('@gosi-ui/foundation/inbox').then(mod => mod.InboxModule),
        data: {
          breadcrumb: 'MENUITEM.INBOX'
        }
      },
      {
        path: 'oh',
        loadChildren: () => import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule),
        data: {
          breadcrumb: 'MENUITEM.OH'
        }
      },
      {
        path: 'contributor',
        loadChildren: () => import('@gosi-ui/features/contributor').then(mod => mod.ContributorModule),
        data: {
          breadcrumb: 'MENUITEM.CONTRIBUTIONS'
        }
      },
      {
        path: 'benefits',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'transactions',
        loadChildren: () => import('@gosi-ui/foundation/transaction-tracing').then(mod => mod.TransactionTracingModule)
      },
      {
        path: 'individual',
        loadChildren: () => import('@gosi-ui/features/customer-information').then(mod => mod.CustomerInformationModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('@gosi-ui/features/customer-information').then(mod => mod.CustomerInformationModule)
      },
      {
        path: 'medical-board',
        loadChildren: () => import('@gosi-ui/features/medical-board').then(mod => mod.MedicalBoardModule)
      },
      {
        path: 'complaints',
        loadChildren: () => import('@gosi-ui/features/complaints').then(mod => mod.ComplaintsModule)
      },
      {
        path: 'billing',
        loadChildren: () => import('@gosi-ui/features/collection/billing').then(mod => mod.BillingModule),
        data: {
          breadcrumb: ''
        }
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
