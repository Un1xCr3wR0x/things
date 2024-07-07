/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContributorSearchScComponent } from '@gosi-ui/features/payment/lib/payment/contributor-search-sc/contributor-search-sc.component';
import { MiscPaymentScComponent } from '@gosi-ui/features/payment/lib/payment/misc-payment/misc-payment-sc/misc-payment-sc.component';
import { DirectPaymentTimelineScComponent } from './misc-payment/direct-payment-timeline-sc/direct-payment-timeline-sc.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'search',
        component: ContributorSearchScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: '',
        component: MiscPaymentScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'direct-payment-history',
        component: DirectPaymentTimelineScComponent,
        data: {
          breadcrumb: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {}
