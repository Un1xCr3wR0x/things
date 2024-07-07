import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionResolver } from '@gosi-ui/core';
import { ReopenEstablishmentScComponent } from './components';
import { EstablishmentAddressDetailsScComponent } from './components/change-establishment/establishment-address-details';
import { EstablishmentBankAccountDetailsScComponent } from './components/change-establishment/establishment-bank-account-details';
import { EstablishmentBasicDetailsScComponent } from './components/change-establishment/establishment-basic-details/establishment-basic-details-sc/establishment-basic-details-sc.component';
import { EstablishmentContactDetailsScComponent } from './components/change-establishment/establishment-contact-details';
import { IdentifierChangeDetailsScComponent } from './components/change-establishment/establishment-identifier-details';
import { EstablishmentLateFeeScComponent } from './components/change-establishment/establishment-late-fee';
import { EstLegalentityChangeScComponent } from './components/change-establishment/establishment-legalentity-change/est-legalentity-change-sc/est-legalentity-change-sc.component';
import { ManageOwnerChangeScComponent } from './components/change-establishment/establishment-manage-owner-change';
import { EstablishmentPaymentTypeScComponent } from './components/change-establishment/establishment-payment-type';
import { CloseEstablishmentScComponent } from './components/close-establishment';
import { CompleteProactiveRegScComponent } from './components/complete-proactive-reg';
import { FlagEstablishmentScComponent } from './components/flag-establishment/add-flag';
import { ModifyFlagEstablishmentScComponent } from './components/flag-establishment/modify-flag';
import { GenerateCertificateScComponent } from './components/generate-certificate';
import { CbmDetailsScComponent } from './components/group-level-transaction/cbm-details';
import { DelinkMainEstablishmentScComponent } from './components/group-level-transaction/delink-establishment/delink-main-establishment-sc/delink-main-establishment-sc.component';
import { AddAdminsScComponent } from './components/manage-admin/add-admin';
import { DeleteAdminScComponent } from './components/manage-admin/delete-admin';
import { ModifyAdminsScComponent } from './components/manage-admin/modify-admins';
import { ReplaceAdminsScComponent, ReplaceBranchAdminScComponent } from './components/manage-admin/replace-admin';
import { AddRelationshipManagerScComponent } from './components/manage-relationship-manager/add-relationship-manager/add-relationship-manager-sc/add-relationship-manager-sc.component';
import { ModifyRelationshipManagerScComponent } from './components/manage-relationship-manager/modify-relationship-manager/modify-relationship-manager-sc/modify-relationship-manager-sc.component';
import { MedicalInsuranceScComponent } from './components/medical-insurance';
import { RegisterEstablishmentTransactionsScComponent } from './components/register-establishment';
import { RasedDocUploadScComponent } from './components/safety-inspection/rased-doc-upload';
import { SafetyInspectionScComponent } from './components/safety-inspection/safety-inspection/safety-inspection-sc/safety-inspection-sc.component';
import { ResumeDcComponent } from './resume-dc.component';
import { TransactionDcComponent } from './transaction-dc.component';
const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      {
        path: 'basic-details',
        component: EstablishmentBasicDetailsScComponent
      },
      {
        path: 'legal-entity-change',
        component: EstLegalentityChangeScComponent
      },
      {
        path: 'manage-owner',
        component: ManageOwnerChangeScComponent
      },
      {
        path: 'delink-main-est',
        component: DelinkMainEstablishmentScComponent
      },
      {
        path: 'link-est',
        component: DelinkMainEstablishmentScComponent
      },
      {
        path: 'generate-certificate',
        component: GenerateCertificateScComponent
      },
      {
        path: 'safety-inspection',
        component: SafetyInspectionScComponent
      },
      {
        path: 'reopen-establishment',
        component: ReopenEstablishmentScComponent
      },

      {
        path: 'identification-details',
        component: IdentifierChangeDetailsScComponent
      },
      {
        path: 'address-change',
        component: EstablishmentAddressDetailsScComponent
      },
      {
        path: 'bank-account-details',
        component: EstablishmentBankAccountDetailsScComponent
      },
      {
        path: 'contact-details',
        component: EstablishmentContactDetailsScComponent
      },
      {
        path: 'late-fee',
        component: EstablishmentLateFeeScComponent
      },
      {
        path: 'payment-type',
        component: EstablishmentPaymentTypeScComponent
      },
      {
        path: 'close-establishment',
        component: CloseEstablishmentScComponent
      },
      {
        path: 'cbm-details',
        component: CbmDetailsScComponent
      },
      {
        path: 'add-flag',
        component: FlagEstablishmentScComponent
      },
      {
        path: 'modify-flag',
        component: ModifyFlagEstablishmentScComponent
      },
      {
        path: 'rased-doc-upload',
        component: RasedDocUploadScComponent
      },
      {
        path: 'replace-admins',
        component: ReplaceAdminsScComponent
      },
      {
        path: 'replace-admin',
        component: ReplaceBranchAdminScComponent
      },
      {
        path: 'add-admins',
        component: AddAdminsScComponent
      },
      {
        path: 'modify-admins',
        component: ModifyAdminsScComponent
      },
      {
        path: 'add-relationship-manager',
        component: AddRelationshipManagerScComponent
      },
      {
        path: 'modify-relationship-manager',
        component: ModifyRelationshipManagerScComponent
      },
      {
        path: 'delete-admin',
        component: DeleteAdminScComponent
      },
      {
        path: 'register-establishment',
        component: RegisterEstablishmentTransactionsScComponent
      },
      {
        path: 'complete-proactive',
        component: CompleteProactiveRegScComponent
      },
      {
        path: 'medical-insurance',
        component: MedicalInsuranceScComponent
      },
      {
        path: 'safety-evaluation',
        component: SafetyInspectionScComponent
      }
    ]
  },
  {
    path: 'resume/:transactionId/:transactionRefId',
    component: ResumeDcComponent,
    resolve: { transaction: TransactionResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
