/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractDoctorEsignScComponent, DisabilityAssessmentScComponent, ViewDisabilityAssessmentScComponent } from './components';

export const routes: Routes = [
    {
      path: 'create/:sin/:personId/:injuryId',
      component: DisabilityAssessmentScComponent,
      data: {
        breadcrumb: 'OCCUPATIONAL-HAZARD.DISABILITY-ASSESSMENT'
      }
    },
   {
    path: 'view',
    component: ViewDisabilityAssessmentScComponent,
    data: {
        breadcrumb: 'OCCUPATIONAL-HAZARD.DISABILITY-ASSESSMENT'
      }
   },
   {
    path: 'e-sign',
    component: ContractDoctorEsignScComponent,
    data: {
        breadcrumb: 'OCCUPATIONAL-HAZARD.DISABILITY-ASSESSMENT'
      }
   }
  ];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    declarations: []
  })
  export class AddVisitingDoctorRoutingModule {}