/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiseaseDcComponent } from './disease-dc.component';
import { AddDiseaseScComponent } from './add-disease-sc/add-disease-sc.component';
import { ViewDiseaseScComponent } from './view-disease-sc/view-disease-sc.component';
import { ReopenDiseaseScComponent } from './reopen-disease-sc/reopen-disease-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: DiseaseDcComponent,
    children: [
      {
        path: '',
        redirectTo: 'add',
        pathMatch: 'full',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REPORT-OCCUPATIONAL-DISEASE'
        }
      },
      {
        path: 'add',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REPORT-OCCUPATIONAL-DISEASE'
        },
        component: AddDiseaseScComponent
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:diseaseId/add',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REPORT-OCCUPATIONAL-DISEASE'
        },
        component: AddDiseaseScComponent
      },
      {
        path: 're-open',
        component: ReopenDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REOPEN-DISEASE-TRANSACTION'
        }
      },
      {
        path: 'edit',
        component: AddDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.REPORT-OCCUPATIONAL-DISEASE'
        }
      },
      {
        path: 'modify',
        component: AddDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-DISEASE-TRANSACTION'
        }
      },     
      {
        path: ':transactionId/:socialInsuranceNo/:diseaseId/modify',
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.MODIFY-DISEASE-TRANSACTION'
        },
        component: AddDiseaseScComponent
      },
      {
        path: 'reopen',
        component: AddDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REOPEN-DISEASE-TRANSACTION'
        }
      },
      {
        path: ':transactionId/:registrationNo/:socialInsuranceNo/:diseaseId/reopen',
        component: AddDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REOPEN-DISEASE-TRANSACTION'
        }
      },      
      {
        path: 'view/:registrationNo/:socialInsuranceNo/:diseaseId',
        component: ViewDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.OCCUPATIONAL-DISEASE-DETAILS'
        }
      },
      {
        path: 'info',
        component: ViewDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.OCCUPATIONAL-DISEASE-DETAILS'
        }
      },
      {
        path: 'detail',
        component: ViewDiseaseScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.DISEASE.OCCUPATIONAL-DISEASE-DETAILS'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiseaseRoutingModule {}
