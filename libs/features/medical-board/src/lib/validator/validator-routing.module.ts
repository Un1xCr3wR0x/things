/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ValidateAddMemberScComponent,
  ValidateModifyContractScComponent,
  ValidateTerminateContractScComponent,
  ValidatorMedicalBoardSessionScComponent
} from './components';
import { GosiDoctorAssessmentViewScComponent } from './components/gosi-doctor-view';
import { ValidatorDcComponent } from './validator-dc.component';
import { ContributorClarificationScComponent } from './components/contributor-clarification-sc/contributor-clarification-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'add-member',
        component: ValidateAddMemberScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.MAINTAIN-MEDICAL-BOARD-DOCTOR'
        }
      },
      {
        path: 'modify-contract',
        component: ValidateModifyContractScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.MAINTAIN-MEDICAL-BOARD-DOCTOR'
        }
      },
      {
        path: 'terminate-contract',
        component: ValidateTerminateContractScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.MAINTAIN-MEDICAL-BOARD-DOCTOR'
        }
      },
      {
        path: 'validator-medical-session',
        component: ValidatorMedicalBoardSessionScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.MANAGE-MEDICAL-BOARD'
        }
      },
      {
        path: 'gosi-doctor-view',
        component: GosiDoctorAssessmentViewScComponent,
        data: {
          breadcrump: 'MEDICAL-BOARD.MAINTAIN-MEDICAL-BOARD-DOCTOR'
        }
        },
        {
        path: 'contributor-clarification',
        component: ContributorClarificationScComponent,
        data: {
          breadcrumb: 'MEDICAL-BOARD.MAINTAIN-MEDICAL-BOARD-DOCTOR'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
