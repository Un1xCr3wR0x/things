/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupInjuryDcComponent } from './group-injury-dc.component';
import { AddGroupInjuryScComponent } from './add-group-injury-sc/add-group-injury-sc.component';
import { ContributorSearchScComponent } from '../shared';

export const routes: Routes = [
  {
    path: '',
    component: GroupInjuryDcComponent,
    children: [
      {
        path: '',
        redirectTo: 'add',
        pathMatch: 'full',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.GROUP-INJURY.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'add',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.GROUP-INJURY.REPORT-OCCUPATIONAL-HAZARD'
        },
        component: AddGroupInjuryScComponent
      },
      {
        path: 'report',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.GROUP-INJURY.REPORT-OCCUPATIONAL-HAZARD'
        },
        component: ContributorSearchScComponent
      },
      {
        path: 'home/oh/report',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.GROUP-INJURY.REPORT-OCCUPATIONAL-HAZARD'
        },
        component: ContributorSearchScComponent
      },
      {
        path: 'modify',
        component: AddGroupInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION'
        }
      },
      {
        path: ':transactionId/:registrationNo/:injuryId/modify',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION'
        },
        component: AddGroupInjuryScComponent
      }     

    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupInjuryRoutingModule {}
