/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionTracingDcComponent } from './transaction-tracing-dc.component';
import {
  TransactionHistoryScComponent,
  TransactionViewScComponent,
  EstablishmentTransactionHistoryScComponent,
  TransactionTabScComponent
} from './components';
import { TransactionResolver } from '@gosi-ui/core';
import { ReopenCompletedTransactionScComponent } from './components/reopen-completed-transaction-sc/reopen-completed-transaction-sc.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionTracingDcComponent,
    children: [
      {
        path: 'list',
        component: TransactionTabScComponent,
        children: [
          {
            path: 'worklist',
            loadChildren: () =>
              import('@gosi-ui/foundation/inbox/lib/worklist/worklist.module').then(mod => mod.WorklistModule),
            data: {
              breadcrumb: 'TRANSACTION-TRACING.MY-WORK-LIST'
            }
          },
          {
            path: 'todolist',
            loadChildren: () =>
              import('@gosi-ui/foundation/inbox/lib/todolist/todolist.module').then(mod => mod.TodolistModule),
            data: {
              breadcrumb: 'TRANSACTION-TRACING.ESTABLISHMENT-INBOX'
            }
          },
          {
            path: 'notifications',
            loadChildren: () =>
              import('@gosi-ui/foundation/inbox/lib/notifications/notifications.module').then(
                mod => mod.NotificationsModule
              ),
            data: {
              breadcrumb: 'TRANSACTION-TRACING.NOTIFICATIONS'
            }
          },
          {
            path: 'history',
            component: TransactionHistoryScComponent,
            data: {
              breadcrumb: ''
            }
          }
        ]
      },
      {
        path: 'list/establishment/:registrationNo',
        component: EstablishmentTransactionHistoryScComponent,
        data: {
          breadcrumb: 'TRANSACTION-TRACING.TRANSACTIONS'
        }
      },
      {
        path: 'view/:transactionId/:transactionRefId/ReopenTransaction',
        component: ReopenCompletedTransactionScComponent,
        children: [
          {
            path: 'contributor',
            loadChildren: () => import('@gosi-ui/features/contributor').then(mod => mod.ContributorModule)
          },
          {
            path: 'complaints',
            loadChildren: () => import('@gosi-ui/features/complaints').then(mod => mod.ComplaintsModule)
          },
        ]
      },
      {
        path: 'view/:transactionId/:transactionRefId',
        component: TransactionViewScComponent,
        children: [
          {
            path: 'oh',
            loadChildren: () =>
              import('@gosi-ui/features/occupational-hazard').then(mod => mod.OccupationalHazardModule)
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
            path: 'benefits',
            loadChildren: () => import('@gosi-ui/features/benefits').then(mod => mod.BenefitsModule)
          },
          {
            path: 'payment',
            loadChildren: () => import('@gosi-ui/features/payment').then(mod => mod.PaymentModule)
          },
          {
            path: 'contributor',
            loadChildren: () => import('@gosi-ui/features/contributor').then(mod => mod.ContributorModule)
          },
          {
            path: 'establishment',
            loadChildren: () => import('@gosi-ui/features/establishment').then(mod => mod.EstablishmentModule)
          },
          {
            path: 'billing',
            loadChildren: () => import('@gosi-ui/features/collection/billing').then(mod => mod.BillingModule)
          },
          {
            path: 'contributor',
            loadChildren: () => import('@gosi-ui/features/contributor').then(mod => mod.ContributorModule)
          },
          {
            path: 'establishment',
            loadChildren: () => import('@gosi-ui/features/establishment').then(mod => mod.EstablishmentModule)
          },
          {
            path: 'billing',
            loadChildren: () => import('@gosi-ui/features/collection/billing').then(mod => mod.BillingModule)
          },
          {
            path: 'violations',
            loadChildren: () => import('@gosi-ui/features/violations').then(mod => mod.ViolationsModule)
          }
        ],
        resolve: { transaction: TransactionResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionTracingRoutingModule {}
