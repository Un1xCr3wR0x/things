/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ValidateCancelEngagementScComponent,
  ValidateIncorrectTerminationScComponent,
  ValidateModifyJoiningDateScComponent,
  ValidateAddNewEngagementScComponent,
  ValidateIncorrectWageScComponent,
  ValidateModifyTerminationDateScComponent,
  ValidateCancelViolationScComponent,
  ValidateModifyViolationsScComponent,
  ValidateReportViolationScComponent,
  ValidateWrongBenefitsScComponent,
  ViolatingProvisionsScComponent,
  AppealViolationScComponent,
  ValidateAppealOnViolationScComponent,
  ReportInjuryViolationScComponent
} from './components';
import { ViolationValidatorDcComponent } from './violation-validator-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: ViolationValidatorDcComponent,
    children: [
      {
        path: 'incorrect-termination',
        component: ValidateIncorrectTerminationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'cancel-engagement',
        component: ValidateCancelEngagementScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'modify-joining-date',
        component: ValidateCancelEngagementScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'add-new-engagement',
        component: ValidateAddNewEngagementScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'incorrect-wage',
        component: ValidateIncorrectWageScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'modify-termination-date-backdated-termination',
        component: ValidateCancelEngagementScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'cancel-violations',
        component: ValidateCancelViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'modify-violations',
        component: ValidateModifyViolationsScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'raise-violations',
        component: ValidateReportViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'wrong-benefits',
        component: ValidateWrongBenefitsScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'violating-provisions',
        component: ViolatingProvisionsScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      },
      {
        path: 'appeal-on-violations',
        component: AppealViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.APPEAL_DETAILS'
        }
      },
      {
        path: 'appeal-on-violation',
        component: ValidateAppealOnViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.APPEAL_DETAILS'
        }
      },
      {
        path: 'injury-violation',
        component: ReportInjuryViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViolationValidatorRoutingModule {}
