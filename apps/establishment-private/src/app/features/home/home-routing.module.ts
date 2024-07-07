/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components';
import { NotFoundDcComponent } from '@gosi-ui/foundation-theme';

/**
 * Declaration of routes for Home feature
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', redirectTo: 'establishment/register' },

      //Establishment Feature
      {
        path: 'establishment',
        loadChildren: () => import('@gosi-ui/features/establishment').then(mod => mod.EstablishmentModule),
        data: {
          breadcrumb: 'MENUITEM.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'medical-board',
        loadChildren: () => import('@gosi-ui/features/medical-board').then(mod => mod.MedicalBoardModule)
      },
      {
        path: 'contributor',
        loadChildren: () => import('@gosi-ui/features/contributor').then(mod => mod.ContributorModule),
        data: {
          breadcrumb: 'MENUITEM.CONTRIBUTOR-SERVICE'
        }
      },
      //Inbox Feature
      {
        path: 'inbox',
        loadChildren: () => import('@gosi-ui/foundation/inbox').then(mod => mod.InboxModule),
        data: {
          breadcrumb: 'MENUITEM.INBOX'
        }
      },
      //Billing Feature
      {
        path: 'billing',
        loadChildren: () => import('@gosi-ui/features/collection/billing').then(mod => mod.BillingModule),
        data: {
          breadcrumb: ''
        }
      },
      //UI Feature
      {
        path: 'benefits',
        loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule),
        data: {
          breadcrumb: ''
        }
      },
      //Payment Feature
      {
        path: 'payment',
        loadChildren: () => import('@gosi-ui/features/payment').then(mod => mod.PaymentModule),
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'adjustment',
        loadChildren: () => import('@gosi-ui/features/payment/lib/adjustment').then(mod => mod.AdjustmentModule)
      },
      {
        path: 'oh',
        loadChildren: () => import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule),
        data: {
          breadcrumb: ''
        }
      },
      //Manage Person Feature
      {
        path: 'profile',
        loadChildren: () => import('@gosi-ui/features/customer-information').then(mod => mod.CustomerInformationModule)
      },
      {
        path: 'violations',
        loadChildren: () => import('@gosi-ui/features/violations').then(mod => mod.ViolationsModule)
      },
      //Transaction Tracing
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
        loadChildren: () => import('@gosi-ui/features/team-management').then(mod => mod.TeamManagementModule)
        // data: {
        //   breadcrumb: 'TEAM-MANAGEMENT.TEAM-MANAGEMENT'
        // }
      },
      {
        path: 'appeals',
        loadChildren: () => import('@gosi-ui/features/appeals').then(mod =>mod.AppealsModule)
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
