/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { MANAGE_REACTIVATE_TRANSACTIONS_COMPONENTS } from './Reactivate-engagement';
import { AddFamilyDetails } from './add-family-details-sc/add-family-details-sc.component';
import { AddNinDetailsScComponent } from './add-nin-sc/add-nin-sc.component';
import { AddcontractdetailsScComponent } from './addcontractdetailssc/addcontractdetailssc.component';
import { CancelEngagementDetailsDcComponent } from './cancel-engagement-details-dc/cancel-engagement-details-dc.component';
import { CancelEngagementScComponent } from './cancel-engagement-sc/cancel-engagement-sc.component';
import { CancelRpaTranscationScComponent } from './cancel-rpa-transcation-sc/cancel-rpa-transcation-sc.component';
import { CancelVicDetailsDcComponent } from './cancel-vic-details-dc/cancel-vic-details-dc.component';
import { CancelVicScComponent } from './cancel-vic-sc/cancel-vic-sc.component';
import { CertificateGenerateScComponent } from './certificate-generate-sc/certificate-generate-sc.component';
import { ChangeEngagementScComponent } from './change-engagement-sc/change-engagement-sc.component';
import { CimModifyPersonDetailsDcComponent } from './cim-modify-person-details-dc/cim-modify-person-details-dc.component';
import { ContractDetailsDcComponent } from './contract-details-dc/contract-details-dc.component';
import { ContractpersonaldetailsDcComponent } from './contractpersonaldetailsdc/contractpersonaldetailsdc.component';
import { ContributorPersonalDetailsDcComponent } from './contributor-personal-details-dc/contributor-personal-details-dc.component';
import { EInspectionScComponent } from './e-inspection-sc/e-inspection-sc.component';
import { MANAGE_E_REGSITER_TRANSACTIONS_COMPONENTS } from './e-registration/';
import { EengagementViewDcComponent } from './eengagement-view-dc/eengagement-view-dc.component';
import { EestablishmentDetailsDcComponent } from './eestablishment-details-dc/eestablishment-details-dc.component';
import { EinspectionWageTableDcComponent } from './einspection-wage-table-dc/einspection-wage-table-dc.component';
import { EmodifyDetailsTableDcComponent } from './emodify-details-table-dc/emodify-details-table-dc.component';
import { EngagementBasicDeatilsDcComponent } from './engagement-basic-deatils-dc/engagement-basic-deatils-dc.component';
import { EngagementPeriodDetailsViewDcComponent } from './engagement-period-details-view-dc/engagement-period-details-view-dc.component';
import { EngagementViewDetailsDcComponent } from './engagement-view-details-dc/engagement-view-details-dc.component';
import { EnterRpaTransactionScComponent } from './enter-rpa-transaction-sc/enter-rpa-transaction-sc.component';
import { EvalidatorPersonalViewDcComponent } from './evalidator-personal-view-dc/evalidator-personal-view-dc.component';
import { ManageWageScComponent } from './manage-wage-sc/manage-wage-sc.component';
import { ModifyFamilyDetails } from './modify-family-details-sc/modify-family-details-sc.component';
import { ModifyNationalityInfoScComponent } from './modify-nationality-info-sc/modify-nationality-info-sc.component';
import { ModifyPersonalDetails } from './modify-personal-details-sc/modify-personal-details-sc.component';
import { MultipleTransferMytransScComponent } from './multiple-transfer-mytrans-sc/multiple-transfer-mytrans-sc.component';
import { MYTRANSCATION_REACTIVATE_VIC_COMPONENTS } from './reactivate-vic';
import { RegisterContributorScComponent } from './register-contributor-sc/register-contributor-sc.component';
import { ReopenTransactionScComponent } from './reopen-transaction-sc/reopen-transaction-sc.component';
import { SecondmentStudyleaveTransactionScComponent } from './secondment-studyleave-transaction-sc/secondment-studyleave-transaction-sc.component';
import { SHARED_TRANSACTIONS_COMPONENTS } from './shared';
import { TerminateDetailsDcComponent } from './terminate-details-dc/terminate-details-dc.component';
import { TerminateEngagementScComponent } from './terminate-engagement-sc/terminate-engagement-sc.component';
import { TerminateSecondmentDetailsDcComponent } from './terminate-secondment-details-dc/terminate-secondment-details-dc.component';
import { TerminateStudyleaveDetailsDcComponent } from './terminate-studyleave-details-dc/terminate-studyleave-details-dc.component';
import { TerminateVicDetailsDcComponent } from './terminate-vic-details-dc/terminate-vic-details-dc.component';
import { TerminateVicScComponent } from './terminate-vic-sc/terminate-vic-sc.component';
import { TransactionWageDetailsDcComponent } from './transaction-wage-details-dc/transaction-wage-details-dc.component';
import { TransactionsAddVicScComponent } from './transactions-add-vic-sc/transactions-add-vic-sc.component';
import { TransferAllContributorScComponent } from './transfer-all-contributor-sc/transfer-all-contributor-sc.component';
import { TransferContributorScComponent } from './transfer-contributor-sc/transfer-contributor-sc.component';
import { TransferDetailsDcComponent } from './transfer-details-dc/transfer-details-dc.component';
import { TransferallDetailsDcComponent } from './transferall-details-dc/transferall-details-dc.component';
import { UpdateBorderDetails } from './update-border-details-sc/update-border-details-sc.component';
import { UpdateIqamaDetails } from './update-iqama-details-sc/update-iqama-details-sc.component';
import { UpdateModifyCoverageDcComponent } from './update-modify-coverage-dc/update-modify-coverage-dc.component';
import { UpdatePassportDetailsScComponent } from './update-passport-details-sc/update-passport-details-sc.component';
import { UpdateWageDcComponent } from './update-wage-dc/update-wage-dc.component';
import { UploadDocumentsTransaction } from './upload-documents-sc/upload-documents-sc.component';
import { VicTransactionsEngagementDetailsDcComponent } from './vic-transactions-engagement-details-dc/vic-transactions-engagement-details-dc.component';
import { VicUpdateWageDetailsDcComponent } from './vic-update-wage-details-dc/vic-update-wage-details-dc.component';
import { VicWageUpdateScComponent } from './vic-wage-update-sc/vic-wage-update-sc.component';
import { ViewAuthorizationScComponent } from './view-authorization-sc/view-authorization-sc.component';
import { ViewChangeEngagementScComponent } from './view-change-engagement-sc/view-change-engagement-sc.component';

export const TRANSACTIONS_COMPONENTS = [
  MANAGE_REACTIVATE_TRANSACTIONS_COMPONENTS,
  MYTRANSCATION_REACTIVATE_VIC_COMPONENTS,
  RegisterContributorScComponent,
  SHARED_TRANSACTIONS_COMPONENTS,
  EngagementViewDetailsDcComponent,
  EngagementPeriodDetailsViewDcComponent,
  TransactionsAddVicScComponent,
  VicTransactionsEngagementDetailsDcComponent,
  TerminateEngagementScComponent,
  TerminateDetailsDcComponent,
  TransferContributorScComponent,
  ManageWageScComponent,
  TransactionWageDetailsDcComponent,
  TerminateVicScComponent,
  TerminateVicDetailsDcComponent,
  TransferDetailsDcComponent,
  TransferAllContributorScComponent,
  TransferallDetailsDcComponent,
  ChangeEngagementScComponent,
  ContributorPersonalDetailsDcComponent,
  EngagementBasicDeatilsDcComponent,
  UpdateWageDcComponent,
  UpdateModifyCoverageDcComponent,
  CancelEngagementDetailsDcComponent,
  CancelEngagementScComponent,
  AddcontractdetailsScComponent,
  ContractpersonaldetailsDcComponent,
  ContractDetailsDcComponent,
  VicWageUpdateScComponent,
  VicUpdateWageDetailsDcComponent,
  CancelVicScComponent,
  CancelVicDetailsDcComponent,
  EInspectionScComponent,
  EvalidatorPersonalViewDcComponent,
  EestablishmentDetailsDcComponent,
  EengagementViewDcComponent,
  EinspectionWageTableDcComponent,
  EmodifyDetailsTableDcComponent,
  ModifyPersonalDetails,
  AddFamilyDetails,
  ModifyFamilyDetails,
  UpdateBorderDetails,
  UpdateIqamaDetails,
  UploadDocumentsTransaction,
  CertificateGenerateScComponent,
  ViewChangeEngagementScComponent,
  ViewAuthorizationScComponent,
  ModifyNationalityInfoScComponent,
  UpdatePassportDetailsScComponent,
  CimModifyPersonDetailsDcComponent,
  UpdatePassportDetailsScComponent,
  MANAGE_E_REGSITER_TRANSACTIONS_COMPONENTS,
  ViewAuthorizationScComponent,
  ModifyNationalityInfoScComponent,
  SecondmentStudyleaveTransactionScComponent,
  TerminateStudyleaveDetailsDcComponent,
  TerminateSecondmentDetailsDcComponent,
  ReopenTransactionScComponent,
  MultipleTransferMytransScComponent,
  AddNinDetailsScComponent,
  EnterRpaTransactionScComponent,
  CancelRpaTranscationScComponent
];

export * from './add-family-details-sc/add-family-details-sc.component';
export * from './add-nin-sc/add-nin-sc.component';
export * from './addcontractdetailssc/addcontractdetailssc.component';
export * from './cancel-engagement-details-dc/cancel-engagement-details-dc.component';
export * from './cancel-engagement-sc/cancel-engagement-sc.component';
export * from './cancel-rpa-transcation-sc/cancel-rpa-transcation-sc.component';
export * from './cancel-vic-details-dc/cancel-vic-details-dc.component';
export * from './cancel-vic-sc/cancel-vic-sc.component';
export * from './certificate-generate-sc/certificate-generate-sc.component';
export * from './change-engagement-sc/change-engagement-sc.component';
export * from './cim-modify-person-details-dc/cim-modify-person-details-dc.component';
export * from './contract-details-dc/contract-details-dc.component';
export * from './contractpersonaldetailsdc/contractpersonaldetailsdc.component';
export * from './contributor-personal-details-dc/contributor-personal-details-dc.component';
export * from './e-inspection-sc/e-inspection-sc.component';
export * from './e-registration/';
export * from './eengagement-view-dc/eengagement-view-dc.component';
export * from './eestablishment-details-dc/eestablishment-details-dc.component';
export * from './einspection-wage-table-dc/einspection-wage-table-dc.component';
export * from './emodify-details-table-dc/emodify-details-table-dc.component';
export * from './engagement-basic-deatils-dc/engagement-basic-deatils-dc.component';
export * from './engagement-period-details-view-dc/engagement-period-details-view-dc.component';
export * from './engagement-view-details-dc/engagement-view-details-dc.component';
export * from './enter-rpa-transaction-sc/enter-rpa-transaction-sc.component';
export * from './evalidator-personal-view-dc/evalidator-personal-view-dc.component';
export * from './manage-wage-sc/manage-wage-sc.component';
export * from './modify-family-details-sc/modify-family-details-sc.component';
export * from './modify-nationality-info-sc/modify-nationality-info-sc.component';
export * from './modify-personal-details-sc/modify-personal-details-sc.component';
export * from './multiple-transfer-mytrans-sc/multiple-transfer-mytrans-sc.component';
export * from './register-contributor-sc/register-contributor-sc.component';
export * from './reopen-transaction-sc/reopen-transaction-sc.component';
export * from './secondment-studyleave-transaction-sc/secondment-studyleave-transaction-sc.component';
export * from './shared';
export * from './terminate-details-dc/terminate-details-dc.component';
export * from './terminate-engagement-sc/terminate-engagement-sc.component';
export * from './terminate-secondment-details-dc/terminate-secondment-details-dc.component';
export * from './terminate-studyleave-details-dc/terminate-studyleave-details-dc.component';
export * from './terminate-vic-details-dc/terminate-vic-details-dc.component';
export * from './terminate-vic-sc/terminate-vic-sc.component';
export * from './transaction-wage-details-dc/transaction-wage-details-dc.component';
export * from './transactions-add-vic-sc/transactions-add-vic-sc.component';
export * from './transfer-all-contributor-sc/transfer-all-contributor-sc.component';
export * from './transfer-contributor-sc/transfer-contributor-sc.component';
export * from './transfer-details-dc/transfer-details-dc.component';
export * from './transferall-details-dc/transferall-details-dc.component';
export * from './update-border-details-sc/update-border-details-sc.component';
export * from './update-iqama-details-sc/update-iqama-details-sc.component';
export * from './update-modify-coverage-dc/update-modify-coverage-dc.component';
export * from './update-passport-details-sc/update-passport-details-sc.component';
export * from './update-wage-dc/update-wage-dc.component';
export * from './upload-documents-sc/upload-documents-sc.component';
export * from './vic-transactions-engagement-details-dc/vic-transactions-engagement-details-dc.component';
export * from './vic-update-wage-details-dc/vic-update-wage-details-dc.component';
export * from './vic-wage-update-sc/vic-wage-update-sc.component';
export * from './view-authorization-sc/view-authorization-sc.component';
export * from './view-change-engagement-sc/view-change-engagement-sc.component';
