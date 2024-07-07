/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionResolver } from '@gosi-ui/core';
import { AddMemberScComponent } from '../add-member/components';
import { ModifyContractScComponent } from '../doctor-profile/components';
import { TerminateContractScComponent } from '../doctor-profile/components';
import { ResumeDcComponent } from './resume-dc.component';
import { TransactionDcComponent } from './transaction-dc.component';
import { TrackingScComponent } from './tracking-sc/tracking-sc.component';
import { TransactionConveyanceScComponent } from './transaction-conveyance-sc/transaction-conveyance-sc.component';
import { TrackingESignScComponent } from './tracking-e-sign-sc/tracking-e-sign-sc.component';
import { MboSessionAssessmentScComponent } from './mbo-session-assessment-sc/mbo-session-assessment-sc.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      {
        path: '/addmembers',
        component: AddMemberScComponent
      },
      {
        path: '/modify-contract',
        component: ModifyContractScComponent
      },
      {
        path: '/terminate-contract',
        component: TerminateContractScComponent
      }
    ]
  },
  {
    path: 'resume/:transactionId/:transactionRefId',
    component: ResumeDcComponent,
    resolve: { transaction: TransactionResolver }
  },
  {
    path: 'tracking',
    component: TrackingScComponent
  },
  {
    path: 'conveyance-allowance',
    component: TransactionConveyanceScComponent
  },
  {
    path: 'e-sign',
    component: TrackingESignScComponent
  },
  {
    path: 'mbo-trigger',
    component: MboSessionAssessmentScComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
