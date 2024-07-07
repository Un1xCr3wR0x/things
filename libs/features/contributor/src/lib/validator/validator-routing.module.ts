/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CanelRpaScComponent,
  ManageWageScComponent,
  ModifyViolationRequestScComponent,
  ValidateAddContractScComponent,
  ValidateAddContributorScComponent,
  ValidateAddVicScComponent,
  ValidateAuthorizationScComponent,
  ValidateBulkWageScComponent,
  ValidateCancelContributorScComponent,
  ValidateCancelEngIndScComponent,
  ValidateERegistrationScComponent,
  ValidateIndividualEngagementScComponent,
  ValidateSecondmentStudyleaveScComponent,
  ValidateTerminateContributorScComponent,
  ValidateTerminateEngIndScComponent,
  ValidateTerminateVicScComponent,
  ValidateTransferAllContributorScComponent,
  ValidateTransferContributorScComponent,
  ValidateVicIndividualWageScComponent,
  ValidatorEInspectionScComponent,
  ValidatorPreviewScComponent,
  ValidatorReactivateEngagementScComponent,
  ViewAuthorizationScComponent
} from './components';
import { ValidateAddSecondedScComponent } from './components/add-seconded/validate-add-seconded-sc/validate-add-seconded-sc.component';
import { ValidateCancelVicScComponent } from './components/cancel-vic';
import { EnterRpaValidatorScComponent } from './components/enter-rpa';
import { ModifyJoiningLeavingDateScComponent } from './components/manage-compliance/individual-modify-engagement/modify-joining-leaving-date-sc/modify-joining-leaving-date-sc.component';
import { ValidatorReactivateVicScComponent } from './components/reactivate-vic';
import { ValidatorDcComponent } from './validator-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: ValidatorDcComponent,
    children: [
      {
        path: 'update-wage',
        component: ManageWageScComponent,
        data: {
          breadcrumb: 'CONTRIBUTOR.WAGE.UPDATE-CURRENT-WAGE'
        }
      },
      {
        path: 'change-engagement',
        component: ValidateIndividualEngagementScComponent
      },
      {
        path: 'change-engagement/request',
        component: ValidateIndividualEngagementScComponent
      },
      {
        path: 'add-contributor',
        component: ValidateAddContributorScComponent,
        data: {
          breadcrumb: 'CONTRIBUTOR.HOME'
        }
      },
      {
        path: 'terminate-contributor',
        component: ValidateTerminateContributorScComponent
      },
      {
        path: 'terminate-contributor/request',
        component: ValidateTerminateEngIndScComponent
      },
      {
        path: 'register-secondment',
        component: ValidateSecondmentStudyleaveScComponent
      },
      {
        path: 'register-studyleave',
        component: ValidateSecondmentStudyleaveScComponent
      },
      {
        path: 'add-contract',
        component: ValidateAddContractScComponent
      },
      {
        path: 'cancel-contract',
        component: ValidateAddContractScComponent
      },
      {
        path: 'violate-engagement',
        component: ValidatorEInspectionScComponent
      },
      {
        path: 'cancel-engagement',
        component: ValidateCancelContributorScComponent
      },
      {
        path: 'cancel-engagement/request',
        component: ValidateCancelEngIndScComponent
      },
      {
        path: 'add-seconded',
        component: ValidateAddSecondedScComponent
      },
      {
        path: 'transfer-contributor',
        component: ValidateTransferContributorScComponent
      },
      {
        path: 'transfer-all-contributor',
        component: ValidateTransferAllContributorScComponent
      },
      {
        path: 'bulk-wage',
        component: ValidateBulkWageScComponent
      },
      {
        path: 'preview/:regNo/:sinNo/:engId',
        component: ValidatorPreviewScComponent
      },
      {
        path: 'add-vic',
        component: ValidateAddVicScComponent
      },
      {
        path: 'vic-wage-update',
        component: ValidateVicIndividualWageScComponent
      },
      {
        path: 'terminate-vic',
        component: ValidateTerminateVicScComponent
      },
      {
        path: 'cancel-vic',
        component: ValidateCancelVicScComponent
      },
      {
        path: 'modify-violation',
        component: ModifyViolationRequestScComponent
      },
      {
        path: 'modify-violation-wage',
        component: ModifyJoiningLeavingDateScComponent
      },
      {
        path: 'add-authorization',
        component: ValidateAuthorizationScComponent
      },
      {
        path: 'view-authorization',
        component: ViewAuthorizationScComponent
      },
      {
        path: 'modify-coverage',
        component: ValidateIndividualEngagementScComponent
      },
      {
        path: 'modify-e-register',
        component: ValidateERegistrationScComponent
      },
      {
        path: 'Reactivate-engagement',
        component: ValidatorReactivateEngagementScComponent
      },
      {
        path: 'Reactivate-VIC-engagement',
        component: ValidatorReactivateVicScComponent
      },
      {
        path: 'enter-rpa',
        component: EnterRpaValidatorScComponent
      },
      {
        path: 'cancel-rpa',
        component: CanelRpaScComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
