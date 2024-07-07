/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingDcComponent } from './billing-dc.component';
import { VicDashboardScComponent } from './vic/components';

export const routes: Routes = [
  {
    path: '',
    component: BillingDcComponent,
    data: {
      breadcrumb: 'BILLING.BILL'
    },
    children: [
      {
        path:'',
        component:VicDashboardScComponent
      },
      {
        path:'vic',
        component:VicDashboardScComponent
      },

      {
        path: 'payment',
        loadChildren: () => import('./contribution-payment').then(mod => mod.ContributionPaymentModule)
      },
      {
        path: 'establishment-service',
        loadChildren: () => import('./exceptional-penalty-waiver').then(mod => mod.ExceptionalPenaltyWaiverModule),
        data: {
          breadcrumb: 'BILLING.EXCEPTIONAL-PENALTY-WAIVER'
        }
      },
      {
        path: 'receipt',
        loadChildren: () => import('./receipt').then(mod => mod.ReceiptModule),
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'establishment',
        loadChildren: () => import('./establishment').then(mod => mod.EstablishmentModule),
        data: {
          breadcrumb: 'BILLING.ESTABLISHMENT'
        }
      },
      {
        path: 'vic',
        loadChildren: () => import('./vic').then(mod => mod.VicModule),
        data: {
          breadcrumb: 'BILLING.VIC'
        }
      },
      {
        path: 'eventdate/modify',
        loadChildren: () => import('./maintain-event-date').then(mod => mod.MaintainEventDateModule),
        data: {
          breadcrumb: 'BILLING.MAINTAIN-EVENT-DATE'
        }
      },
      {
        path: 'validator',
        loadChildren: () => import('./validator').then(mod => mod.ValidatorModule)
      },
      {
        path: 'penalty-waiver',
        loadChildren: () => import('./penalty-waiver').then(mod => mod.PenaltyWaiverModule)
      },
      {
        path: 'credit-transfer',
        loadChildren: () => import('./credit-management').then(mod => mod.CreditManagementModule)
      },
      {
        path: 'installment',
        loadChildren: () => import('./installment').then(mod => mod.InstallmentModule),
        data: {
          breadcrumb: 'BILLING.INSTALLMENT'
        }
      },
      {
        path: 'miscellaneous-adjustment',
        loadChildren: () => import('./miscellaneous-adjustment').then(mod => mod.MiscellaneousAdjustmentModule)
      },
      {
        path: 'record-gov-receipts',
        loadChildren: () => import('./record-government-receipts').then(mod => mod.RecordGovernmentReceiptsModule)
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./transaction-tracking/transaction-tracking.module').then(mod => mod.TransactionTrackingModule)
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule {}
