/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidatorDcComponent } from './validator-dc.component';
import { AppealScComponent, ComplaintScComponent, SuggestionScComponent } from './components';
import { TransactionStateGuard } from '@gosi-ui/core';

/**
 * Declaration of routes for validator module
 */
const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'complaint',
        component: ComplaintScComponent,
        data: {
          breadcrumb: 'COMPLAINTS.COMPLAINT-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'enquiry',
        component: ComplaintScComponent,
        data: {
          breadcrumb: 'COMPLAINTS.ENQUIRY-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'appeal',
        component: ComplaintScComponent,
        data: {
          breadcrumb: 'COMPLAINTS.APPEAL-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'general-appeal',
        component: AppealScComponent,
        data: {
          breadcrumb: 'COMPLAINTS.APPEAL-DETAILS'
        },
      },
      {
        path: 'plea',
        component: ComplaintScComponent,
        data: {
          breadcrumb: 'COMPLAINTS.PLEA-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'suggestion',
        component: SuggestionScComponent,
        data: {
          breadcrumb: 'COMPLAINTS.SUGGESTION-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
