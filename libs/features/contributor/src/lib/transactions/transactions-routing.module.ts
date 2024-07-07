/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CancelRpaTranscationScComponent,
  EnterRpaTransactionScComponent,
  ModifyNationalityInfoScComponent,
  ReopenTransactionScComponent,
  UploadDocumentsTransaction
} from './components';
import { TransactionsReactivateEngagementScComponent } from './components/Reactivate-engagement/transactions-reactivate-engagement-sc/transactions-reactivate-engagement-sc.component';
import { AddBankScComponent } from './components/add-bank-sc/add-bank-sc.component';
import { AddFamilyDetails } from './components/add-family-details-sc/add-family-details-sc.component';
import { AddNinDetailsScComponent } from './components/add-nin-sc/add-nin-sc.component';
import { AddcontractdetailsScComponent } from './components/addcontractdetailssc/addcontractdetailssc.component';
import { CancelEngagementScComponent } from './components/cancel-engagement-sc/cancel-engagement-sc.component';
import { CancelVicScComponent } from './components/cancel-vic-sc/cancel-vic-sc.component';
import { CertificateGenerateScComponent } from './components/certificate-generate-sc/certificate-generate-sc.component';
import { ChangeEngagementScComponent } from './components/change-engagement-sc/change-engagement-sc.component';
import { EInspectionScComponent } from './components/e-inspection-sc/e-inspection-sc.component';
import { ERegistrationScComponent } from './components/e-registration/e-registration-sc/e-registration-sc.component';
import { ManageWageScComponent } from './components/manage-wage-sc/manage-wage-sc.component';
import { ModifyFamilyDetails } from './components/modify-family-details-sc/modify-family-details-sc.component';
import { ModifyPersonalDetails } from './components/modify-personal-details-sc/modify-personal-details-sc.component';
import { MultipleTransferMytransScComponent } from './components/multiple-transfer-mytrans-sc/multiple-transfer-mytrans-sc.component';
import { TranscationReactivateVicScComponent } from './components/reactivate-vic/transcation-reactivate-vic-sc/transcation-reactivate-vic-sc.component';
import { RegisterContributorScComponent } from './components/register-contributor-sc/register-contributor-sc.component';
import { SecondmentStudyleaveTransactionScComponent } from './components/secondment-studyleave-transaction-sc/secondment-studyleave-transaction-sc.component';
import { TerminateEngagementScComponent } from './components/terminate-engagement-sc/terminate-engagement-sc.component';
import { TerminateVicScComponent } from './components/terminate-vic-sc/terminate-vic-sc.component';
import { TransactionsAddVicScComponent } from './components/transactions-add-vic-sc/transactions-add-vic-sc.component';
import { TransferAllContributorScComponent } from './components/transfer-all-contributor-sc/transfer-all-contributor-sc.component';
import { TransferContributorScComponent } from './components/transfer-contributor-sc/transfer-contributor-sc.component';
import { UpdateBorderDetails } from './components/update-border-details-sc/update-border-details-sc.component';
import { UpdateIqamaDetails } from './components/update-iqama-details-sc/update-iqama-details-sc.component';
import { UpdatePassportDetailsScComponent } from './components/update-passport-details-sc/update-passport-details-sc.component';
import { VicWageUpdateScComponent } from './components/vic-wage-update-sc/vic-wage-update-sc.component';
import { ViewAuthorizationScComponent } from './components/view-authorization-sc/view-authorization-sc.component';
import { ViewChangeEngagementScComponent } from './components/view-change-engagement-sc/view-change-engagement-sc.component';
import { TransactionsDcComponent } from './transactions-dc.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsDcComponent,
    children: [
      {
        path: 'register-contributor',
        component: RegisterContributorScComponent
      },
      {
        path: 'manageWage',
        component: ManageWageScComponent
      },
      {
        path: 'registerVic',
        component: TransactionsAddVicScComponent
      },
      {
        path: 'reactivateEngagement',
        component: TransactionsReactivateEngagementScComponent
      },
      {
        path: 'reactivateVICEngagement',
        component: TranscationReactivateVicScComponent
      },
      {
        path: 'terminateEngagement',
        component: TerminateEngagementScComponent
      },
      {
        path: 'registerSecondment',
        component: SecondmentStudyleaveTransactionScComponent
      },
      {
        path: 'registerStudyLeave',
        component: SecondmentStudyleaveTransactionScComponent
      },
      {
        path: 'transferEngagement',
        component: TransferContributorScComponent
      },
      {
        path: 'terminateVicEngagement',
        component: TerminateVicScComponent
      },
      {
        path: 'transferAll',
        component: TransferAllContributorScComponent
      },
      {
        path: 'transferMultiple',
        component: MultipleTransferMytransScComponent
      },
      {
        path: 'changeEngagement',
        component: ChangeEngagementScComponent
      },
      {
        path: 'change-engagement',
        component: ViewChangeEngagementScComponent
      },
      {
        path: 'cancelEngagement',
        component: CancelEngagementScComponent
      },
      {
        path: 'addContract',
        component: AddcontractdetailsScComponent
      },
      {
        path: 'vicWageUpdate',
        component: VicWageUpdateScComponent
      },
      {
        path: 'cancelVicEngagement',
        component: CancelVicScComponent
      },
      {
        path: 'Engagementviolation',
        component: EInspectionScComponent
      },
      {
        path: 'add-bank',
        component: AddBankScComponent
      },
      {
        path: 'modifyPersonalDetails',
        component: ModifyPersonalDetails
      },
      {
        path: 'addFamilyDetails',
        component: AddFamilyDetails
      },
      {
        path: 'modifyFamilyDetails',
        component: ModifyFamilyDetails
      },
      {
        path: 'updateBorderNo',
        component: UpdateBorderDetails
      },
      {
        path: 'updateIqamaNo',
        component: UpdateIqamaDetails
      },
      {
        path: 'updatePassportNo',
        component: UpdatePassportDetailsScComponent
      },
      {
        path: 'uploadDocuments',
        component: UploadDocumentsTransaction
      },
      {
        path: 'generateCertificate',
        component: CertificateGenerateScComponent
      },
      {
        path: 'add-authorization',
        component: ViewAuthorizationScComponent
      },
      {
        path: 'modifyNationality',
        component: ModifyNationalityInfoScComponent
      },
      {
        path: 'eRegistration',
        component: ERegistrationScComponent
      },
      {
        path: 'ReopenTransaction',
        component: ReopenTransactionScComponent
      },
      {
        path: 'add-nin',
        component: AddNinDetailsScComponent
      },
      {
        path: 'edit-nin',
        component: AddNinDetailsScComponent
      },
      {
        path: 'enter-rpa',
        component: EnterRpaTransactionScComponent
      },
      {
        path: 'cancel-rpa',
        component: CancelRpaTranscationScComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
