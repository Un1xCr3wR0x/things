/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComplicationScComponent } from './add-complication-sc/add-complication-sc.component';
import { ComplicationDcComponent } from './complication-dc.component';
import { ReopenComplicationScComponent } from './reopen-complication-sc/reopen-complication-sc.component';
import { ViewComplicationScComponent } from './view-complication-sc/view-complication-sc.component';
import { InjuryRejectScComponent } from '../shared';
import { ViewDiseaseComplicationScComponent } from './view-disease-complication-sc/view-disease-complication-sc.component';
export const routes: Routes = [
  {
    path: '',
    component: ComplicationDcComponent,

    children: [
      {
        path: '',
        redirectTo: 'add',
        pathMatch: 'full',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },
      {
        path: 'edit/:transactionId/:registrationNo/:socialInsuranceNo/:complicationId/:injuryNumber',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },
      {
        path: 'disease-edit/:transactionId/:registrationNo/:socialInsuranceNo/:complicationId/:injuryNumber',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },
      {
        path: 'add',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },

      {
        path: 'edit',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REPORT-COMPLICATION'
        }
      },
      {
        path: 'modify',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION'
        }
      },

      {
        path: 're-open',
        component: ReopenComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:complicationId/:injuryNumber/modify',
        component: AddComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION'
        }
      },

      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:complicationId/:injuryNumber/re-open',
        component: ReopenComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: ':registrationNo/:socialInsuranceNo/:injuryId/reject',
        component: InjuryRejectScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: 'reject',
        component: InjuryRejectScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION'
        }
      },
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:injuryId/:complicationId',
        component: ViewComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.SEC-COMPLICATION-DETAILS'
        }
      },
      {
        path: 'info',
        component: ViewComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.SEC-COMPLICATION-DETAILS'
        }
      },
      {
        path: 'complication-info',
        component: ViewDiseaseComplicationScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.COMPLICATION.SEC-COMPLICATION-DETAILS'
        }
      }
    ]
  }
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplicationRoutingModule {}
