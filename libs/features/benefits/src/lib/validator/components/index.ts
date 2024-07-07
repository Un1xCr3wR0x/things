//TODO:sort the content using sort plugin
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdjustmentRecalculationDetailsDcComponent } from './benefit-recalculation/adjustment-recalculation-details-dc/adjustment-recalculation-details-dc.component';
import { ApproveSanedScComponent } from './approve-saned-sc/approve-saned-sc.component';
import { BenefitBankDcComponent } from './benefit-recalculation/benefit-bank-dc/benefit-bank-dc.component';
import { BenefitHeirDetailsDcComponent } from './benefit-recalculation/benefit-heir-details-dc/benefit-heir-details-dc.component';
import { BenefitModificationDetailsDcComponent } from './benefit-recalculation/benefit-modification-details-dc/benefit-modification-details-dc.component';
import { BenefitRecalculationDetailsDcComponent } from './benefit-recalculation/benefit-recalculation-details-dc/benefit-recalculation-details-dc.component';
import { BenefitRecalculationScComponent } from './benefit-recalculation/benefit-recalculation-sc/benefit-recalculation-sc.component';
import { BenefitTypeDcComponent } from './benefit-recalculation/benefit-type-dc/benefit-type-dc.component';
import { BenefitTypeModifyScComponent } from './benefit-recalculation/benefit-type-modify-sc/benefit-type-modify-sc.component';
import { BenefitTypeScComponent } from './benefit-recalculation/benefit-type-sc/benefit-type-sc.component';
import { ContributionDetailDcComponent } from './benefit-recalculation/contribution-detail-dc/contribution-detail-dc.component';
import { HeirRecalculationScComponent } from './benefit-recalculation/heir-recalculation-sc/heir-recalculation-sc.component';
import { InspectionRequestDcComponent } from './inspection-request-dc/inspection-request-dc.component';
import { LumpsumBenefitsDcComponent } from './benefit-recalculation/lumpsum-benefits-dc/lumpsum-benefits-dc.component';
import { PensionBenefitDcComponent } from './pension-benefit-dc/pension-benefit-dc.component';
import { ValidatorsRejoiningScComponent as RecalculationRejoiningScComponent } from './benefit-recalculation/validators-rejoining-sc/validators-rejoining-sc.component';
import { RegisterHeirDetailsDcComponent } from './register-heir-details-dc/register-heir-details-dc.component';
import { ReportRecalculationTemplateDcComponent } from './benefit-recalculation/report-recalculation-template-dc/report-recalculation-template-dc.component';
import { RequestFuneralGrantDetailsScComponent } from './request-funeral-grant-details-sc/request-funeral-grant-details-sc.component';
import { RetirementContributorDetailsDcComponent } from './retirement-contributor-details-dc/retirement-contributor-details-dc.component';
import { StopAdjustmentDetailsDcComponent } from './validator-stop-benefit-sc/stop-adjustment-details-dc/stop-adjustment-details-dc.component';
import { StopBenefitDetailsDcComponent } from './validator-stop-benefit-sc/stop-benefit-details-dc/stop-benefit-details-dc.component';
import { ValidatorBenefitDetailsRestartDcComponent } from './validator-restart-benefit-sc/validator-benefit-details-restart-dc/validator-benefit-details-restart-dc.component';
import { ValidatorBenefitRecalculationScComponent } from './validator-benefit-recalculation-sc/validator-benefit-recalculation-sc.component';
import { ValidatorDcComponent } from '../validator-dc.component';
import { ValidatorDisabilityAssessmentScComponent } from './validator-disability-assessment-sc/validator-disability-assessment-sc.component';
import { ValidatorFuneralGrantScComponent } from './validator-funeral-grant-sc/validator-funeral-grant-sc.component';
import { ValidatorHoldBenefitScComponent } from './validator-hold-benefit-sc/validator-hold-benefit-sc.component';
import { ValidatorImprisonmentModifyScComponent } from './validator-imprisonment-modify-sc/validator-imprisonment-modify-sc.component';
import { ValidatorModifyCommitmentScComponent } from './validator-modify-commitment-sc/validator-modify-commitment-sc.component';
import { ValidatorRejoiningScComponent } from './validator-rejoining-sc/validator-rejoining-sc.component';
import { ValidatorRetirementLumpsumScComponent } from './validator-retirement-lumpsum-sc/validator-retirement-lumpsum-sc.component';
import { ValidatorRetirementPensionScComponent } from './validator-retirement-pension-sc/validator-retirement-pension-sc.component';
import { ValidatorReturnLumpsumScComponent } from './validator-return-lumpsum-sc/validator-return-lumpsum-sc.component';
import { ValidatorSanedBenefitScComponent } from './validator-saned-benefit-sc/validator-saned-benefit-sc.component';
import { ValidatorSanedCancellationScComponent } from './benefit-recalculation/validator-saned-cancellation-sc/validator-saned-cancellation-sc.component';
import { ValidatorsImprisonmentModifyScComponent } from './validators-imprisonment-modify-sc/validators-imprisonment-modify-sc.component';
import { ValidatorsRejoiningScComponent } from './benefit-recalculation/validators-rejoining-sc/validators-rejoining-sc.component';
import { ValidatorsReturnLumpsumScComponent } from './validators-return-lumpsum-sc/validators-return-lumpsum-sc.component';
import { WomenLumpsumScComponent } from './women-lumpsum-sc/women-lumpsum-sc.component';
import { DependentAdjustmentDetailsDcComponent } from './dependent-adjustment-details-dc/dependent-adjustment-details-dc.component';
import { BenefitDetailDcComponent } from '@gosi-ui/features/benefits/lib/annuity/benefit-details-dc/benefit-detail-dc.component';
import { ValidatorSuspendSanedScComponent } from './validator-suspend-saned-sc/validator-suspend-saned-sc.component';
import { DisabilityAssessmentScComponent } from './benefit-recalculation/disability-assessment-sc/disability-assessment-sc.component';
import { DocumentsDcComponent } from './benefit-recalculation/documents-dc/documents-dc.component';
import { ValidatorDirectPaymentScComponent } from './validator-direct-payment-sc/validator-direct-payment-sc.component';

export const VALIDATORCOMPONENTS = [
  AdjustmentRecalculationDetailsDcComponent,
  ApproveSanedScComponent,
  BenefitBankDcComponent,
  BenefitHeirDetailsDcComponent,
  BenefitModificationDetailsDcComponent,
  BenefitRecalculationDetailsDcComponent,
  BenefitRecalculationScComponent,
  BenefitTypeDcComponent,
  BenefitTypeModifyScComponent,
  BenefitTypeScComponent,
  BenefitTypeScComponent,
  ContributionDetailDcComponent,
  DependentAdjustmentDetailsDcComponent,
  DisabilityAssessmentScComponent,
  HeirRecalculationScComponent,
  InspectionRequestDcComponent,
  LumpsumBenefitsDcComponent,
  PensionBenefitDcComponent,
  RegisterHeirDetailsDcComponent,
  ReportRecalculationTemplateDcComponent,
  ReportRecalculationTemplateDcComponent,
  RequestFuneralGrantDetailsScComponent,
  RetirementContributorDetailsDcComponent,
  StopAdjustmentDetailsDcComponent,
  StopBenefitDetailsDcComponent,
  ValidatorBenefitDetailsRestartDcComponent,
  ValidatorDcComponent,
  ValidatorDisabilityAssessmentScComponent,
  ValidatorFuneralGrantScComponent,
  ValidatorHoldBenefitScComponent,
  ValidatorImprisonmentModifyScComponent,
  ValidatorModifyCommitmentScComponent,
  ValidatorRejoiningScComponent,
  ValidatorRetirementLumpsumScComponent,
  ValidatorRetirementPensionScComponent,
  ValidatorReturnLumpsumScComponent,
  ValidatorSanedBenefitScComponent,
  ValidatorSanedCancellationScComponent,
  ValidatorSanedCancellationScComponent,
  ValidatorsImprisonmentModifyScComponent,
  ValidatorsRejoiningScComponent,
  ValidatorsReturnLumpsumScComponent,
  WomenLumpsumScComponent,
  ValidatorBenefitRecalculationScComponent,
  ValidatorRejoiningScComponent,
  RecalculationRejoiningScComponent,
  ValidatorSuspendSanedScComponent,
  DocumentsDcComponent,
  ValidatorDirectPaymentScComponent
];

export * from '../validator-dc.component';
export * from './approve-saned-sc/approve-saned-sc.component';
export * from './benefit-recalculation/adjustment-recalculation-details-dc/adjustment-recalculation-details-dc.component';
export * from './benefit-recalculation/benefit-bank-dc/benefit-bank-dc.component';
export * from './benefit-recalculation/benefit-heir-details-dc/benefit-heir-details-dc.component';
export * from './benefit-recalculation/benefit-modification-details-dc/benefit-modification-details-dc.component';
export * from './benefit-recalculation/benefit-recalculation-details-dc/benefit-recalculation-details-dc.component';
export * from './benefit-recalculation/benefit-recalculation-sc/benefit-recalculation-sc.component';
export * from './benefit-recalculation/benefit-type-dc/benefit-type-dc.component';
export * from './benefit-recalculation/benefit-type-modify-sc/benefit-type-modify-sc.component';
export * from './benefit-recalculation/benefit-type-sc/benefit-type-sc.component';
export * from './benefit-recalculation/contribution-detail-dc/contribution-detail-dc.component';
export * from './benefit-recalculation/disability-assessment-sc/disability-assessment-sc.component';
export * from './benefit-recalculation/heir-recalculation-sc/heir-recalculation-sc.component';
export * from './benefit-recalculation/lumpsum-benefits-dc/lumpsum-benefits-dc.component';
export * from './benefit-recalculation/report-recalculation-template-dc/report-recalculation-template-dc.component';
export * from './benefit-recalculation/validator-saned-cancellation-sc/validator-saned-cancellation-sc.component';
export * from './benefit-recalculation/validators-rejoining-sc/validators-rejoining-sc.component';
export * from './dependent-adjustment-details-dc/dependent-adjustment-details-dc.component';
export * from './inspection-request-dc/inspection-request-dc.component';
export * from './pension-benefit-dc/pension-benefit-dc.component';
export * from './register-heir-details-dc/register-heir-details-dc.component';
export * from './request-funeral-grant-details-sc/request-funeral-grant-details-sc.component';
export * from './retirement-contributor-details-dc/retirement-contributor-details-dc.component';
export * from './validator-benefit-recalculation-sc/validator-benefit-recalculation-sc.component';
export * from './validator-disability-assessment-sc/validator-disability-assessment-sc.component';
export * from './validator-funeral-grant-sc/validator-funeral-grant-sc.component';
export * from './validator-hold-benefit-sc/validator-hold-benefit-sc.component';
export * from './validator-imprisonment-modify-sc/validator-imprisonment-modify-sc.component';
export * from './validator-modify-commitment-sc/validator-modify-commitment-sc.component';
export * from './validator-rejoining-sc/validator-rejoining-sc.component';
export * from './validator-restart-benefit-sc/validator-benefit-details-restart-dc/validator-benefit-details-restart-dc.component';
export * from './validator-retirement-lumpsum-sc/validator-retirement-lumpsum-sc.component';
export * from './validator-retirement-pension-sc/validator-retirement-pension-sc.component';
export * from './validator-return-lumpsum-sc/validator-return-lumpsum-sc.component';
export * from './validator-saned-benefit-sc/validator-saned-benefit-sc.component';
export * from './validator-stop-benefit-sc/stop-adjustment-details-dc/stop-adjustment-details-dc.component';
export * from './validator-stop-benefit-sc/stop-benefit-details-dc/stop-benefit-details-dc.component';
export * from './validators-imprisonment-modify-sc/validators-imprisonment-modify-sc.component';
export * from './validators-return-lumpsum-sc/validators-return-lumpsum-sc.component';
export * from './validator-suspend-saned-sc/validator-suspend-saned-sc.component';
export * from './benefit-recalculation/documents-dc/documents-dc.component';
export * from './validator-direct-payment-sc/validator-direct-payment-sc.component';
