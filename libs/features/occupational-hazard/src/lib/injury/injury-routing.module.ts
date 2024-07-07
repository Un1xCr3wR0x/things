/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InjuryRejectScComponent } from '../shared';
import { AddInjuryScComponent } from './add-injury-sc/add-injury-sc.component';
import { InjuryDcComponent } from './injury-dc.component';
import { InjuryHistoryScComponent } from './injury-history-sc/injury-history-sc.component';
import { RepatriationInjuryScComponent } from './repatriation-injury-sc/repatriation-injury-sc.component';
import { ViewInjuryScComponent } from './view-injury-sc/view-injury-sc.component';
import { AppealAssessmentFormScComponent } from './appeal-assessment-form-sc/appeal-assessment-form-sc.component';
import { ViewAppealReasonScComponent } from './view-appeal-reason-sc/view-appeal-reason-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: InjuryDcComponent,
    children: [
      {
        path: '',
        redirectTo: 'add',
        pathMatch: 'full',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'edit',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'modify',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION'
        }
      },
      {
        path: 'add',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        },
        component: AddInjuryScComponent
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:injuryId/add',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        },
        component: AddInjuryScComponent
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:injuryId/modify',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION'
        }
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:injuryId/add',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        }
      },
      {
        path: 'reopen',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION'
        }
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:injuryId/reopen',
        component: AddInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION'
        }
      },

      {
        path: 'history/:socialInsuranceNo',
        component: InjuryHistoryScComponent
      },
      {
        path: 'history/:socialInsuranceNo/:canDisplayHeading',
        component: InjuryHistoryScComponent
      },
      {
        path: ':registrationNo/:socialInsuranceNo/:injuryId/reject',
        component: InjuryRejectScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION'
        }
      },
      {
        path: 'reject',
        component: InjuryRejectScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId',
        component: ViewInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.SEC-INJURY-DETAILS'
        }
      },
      {
        path: 'view/:socialInsuranceNo/:injuryId',
        component: ViewInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.SEC-INJURY-DETAILS'
        }
      },
      {
        path: 'info',
        component: ViewInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.SEC-INJURY-DETAILS'
        }
      },
      {
        path: 'detail',
        component: ViewInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.SEC-INJURY-DETAILS'
        }
      },
      {
        path: 'history',
        component: InjuryHistoryScComponent
      },
      {
        path: 'appeal',
        component: AppealAssessmentFormScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.SEC-INJURY-DETAILS'
        }
      },
      {
        path: 'view-appeal',
        component:ViewAppealReasonScComponent ,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.SEC-INJURY-DETAILS'
        }
      },
      {
        path: 'history',
        component: InjuryHistoryScComponent
      },
      {
        path: 'repatriation',
        component: RepatriationInjuryScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InjuryRoutingModule {}
