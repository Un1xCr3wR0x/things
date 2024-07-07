/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionApplyScComponent } from './pension-apply-sc/pension-apply-sc.component';
import { LumpsumAppplyScComponent } from './lumpsum-apply-sc/lumpsum-apply-sc.component';
import { DisabilityAssessmentScComponent } from './disability-assessment/disability-assessment-sc/disability-assessment-sc.component';
import { HeirRegisterScComponent } from './heir-account/heir-register-sc/heir-register-sc.component';
import { ActiveHeirBenefitScComponent } from './active-heir-benefit-sc/active-heir-benefit-sc.component';
import { ActiveHeirDetailsScComponent } from './active-heir-details-sc/active-heir-details-sc.component';
import { InjuryDetailsScComponent } from './injury-details-sc/injury-details-sc.component';
import { PensionModifyScComponent } from './pension-modify-sc/pension-modify-sc.component';
import { PensionActiveScComponent } from './pension-active-sc/pension-active-sc.component';
import { LinkedContributorScComponent } from './heir-account/linked-contributor-sc/linked-contributor-sc.component';
import { HeirSearchProfileScComponent } from './heir-account/heir-search-profile-sc/heir-search-profile-sc.component';
import { LumpsumActiveScComponent } from './lumpsum-active-sc/lumpsum-active-sc.component';
import { HeirModifyScComponent } from './heir-modify-sc/heir-modify-sc.component';
import { ImprisonmentModifyScComponent } from './imprisonment-modify-sc/imprisonment-modify-sc.component';
import { DependentEligibilityDetailsScComponent } from './dependent-eligibility-details-sc/dependent-eligibility-details-sc.component';
import { ModifyBenefitPaymentScComponent } from './modify-benefit-payment-sc/modify-benefit-payment-sc.component';
import { StopBenefitScComponent } from './stop-benefit-sc/stop-benefit-sc.component';
import { HoldBenefitScComponent } from './hold-benefit-sc/hold-benefit-sc.component';
import { RestartBenefitScComponent } from './restart-benefit/restart-benefit-sc/restart-benefit-sc.component';
import { ModifyBankCommitmentScComponent } from './modify-commitment/modify-bank-commitment-sc/modify-bank-commitment-sc.component';
import { AddBankCommitmentScComponent } from './modify-commitment/add-bank-commitment-sc/add-bank-commitment-sc.component';
import { RemoveBankCommitmentScComponent } from './modify-commitment/remove-bank-commitment-sc/remove-bank-commitment-sc.component';
import { FuneralGrantApplyScComponent } from './funeral-grant-apply-sc/funeral-grant-apply-sc.component';
import { FuneralGrantActiveScComponent } from './funeral-grant-active-sc/funeral-grant-active-sc.component';
import { ContributorVisitScComponent } from './contributor-visit-sc/contributor-visit-sc.component';
import { AddDocumentsScComponent } from './add-documents-sc/add-documents-sc.component';
import { TransactionStateGuard } from '@gosi-ui/core/lib/guards/transaction-state-guard';
import { HeirDirectPaymentScComponent } from "./heir-direct-payment/heir-direct-payment-sc/heir-direct-payment-sc.component";
import { DirectPaymentHistoryScComponent } from "./direct-payment-history-sc/direct-payment-history-sc.component";

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'add-documents',
        component: AddDocumentsScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'funeral-grant',
        component: FuneralGrantApplyScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'funeral-grant-active',
        component: FuneralGrantActiveScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'pension',
        component: PensionApplyScComponent,
        data: {
          breadcrumb: ''
        }
        // canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'lumpsum',
        component: LumpsumAppplyScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'disability-assessment',
        component: DisabilityAssessmentScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'direct-payment-history',
        component: DirectPaymentHistoryScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'register-heir',
        component: HeirRegisterScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'pensionModify',
        component: PensionModifyScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'heirPensionModify',
        component: HeirModifyScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'heir-direct-payment',
        component: HeirDirectPaymentScComponent,
        data: {
          breadcrump: ''
        }
      },
      {
        path: 'pensionAcitve',
        component: PensionActiveScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'heir-benefit-active',
        component: ActiveHeirBenefitScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'heir-details-active',
        component: ActiveHeirDetailsScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'lumpsumAcitve',
        component: LumpsumActiveScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'return-lumpsum',
        loadChildren: () =>
          import('./return-lumpsum-benefits/return-lumpsum.module').then(mod => mod.ReturnLumpsumModule)
      },
      {
        path: 'imprisonmentModify',
        component: ImprisonmentModifyScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'dependentEligibility',
        component: DependentEligibilityDetailsScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'injury',
        component: InjuryDetailsScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'linkedContributors',
        component: LinkedContributorScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'searchHeir',
        component: HeirSearchProfileScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'modify-benefit',
        component: ModifyBenefitPaymentScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-SERVICES'
        }
      },
      {
        path: 'stopBenefit',
        component: StopBenefitScComponent
      },
      {
        path: 'restart-benefit',
        component: RestartBenefitScComponent,
        data: {
          breadcrumb: 'BENEFITS.RESTART-RETIREMENT-PENSION-BENEFIT'
        }
      },
      {
        path: 'modify-commitment',
        component: ModifyBankCommitmentScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-SERVICES'
        }
      },
      {
        path: 'add-commitment',
        component: AddBankCommitmentScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-SERVICES'
        }
      },
      {
        path: 'remove-commitment',
        component: RemoveBankCommitmentScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-SERVICES'
        }
      },
      {
        path: 'holdBenefit',
        component: HoldBenefitScComponent
        // data: {
        //   breadcrumb: 'BENEFITS.HOLD-RETIREMENT-PENSION'
        // }
      },
      {
        path: 'contributor-visits',
        component: ContributorVisitScComponent,
        data: {
          breadcrumb: 'BENEFITS.BENEFIT-SERVICES'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnuityRoutingModule {}
