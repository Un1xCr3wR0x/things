/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';

import { SharedModule } from '../shared/shared.module';
import { AnnuityRoutingModule } from './annuity-routing.module';
import { PensionApplyScComponent } from './pension-apply-sc/pension-apply-sc.component';
import { LumpsumAppplyScComponent } from './lumpsum-apply-sc/lumpsum-apply-sc.component';
import { HeirDetailsScComponent } from './heir-details-sc/heir-details-sc.component';
import { DependentDetailsScComponent } from './dependent-details-sc/dependent-details-sc.component';
import { DisabilityAssessmentComponents } from './disability-assessment';
import { HeirRegisterScComponent } from './heir-account/heir-register-sc/heir-register-sc.component';
import { PensionModifyScComponent } from './pension-modify-sc/pension-modify-sc.component';
import { PensionActiveScComponent } from './pension-active-sc/pension-active-sc.component';
import { InjuryDetailsScComponent } from './injury-details-sc/injury-details-sc.component';
import { DisabilityDetailsTimelineDcComponent } from './injury-details-sc/disability-details-timeline-dc/disability-details-timeline-dc.component';
import { DependentModifyScComponent } from './dependent-modify-sc/dependent-modify-sc.component';
import { LinkedContributorScComponent } from './heir-account/linked-contributor-sc/linked-contributor-sc.component';
import { HeirSearchProfileScComponent } from './heir-account/heir-search-profile-sc/heir-search-profile-sc.component';
import { LumpsumActiveScComponent } from './lumpsum-active-sc/lumpsum-active-sc.component';
import { HeirModifyScComponent } from './heir-modify-sc/heir-modify-sc.component';
import { ImprisonmentModifyScComponent } from './imprisonment-modify-sc/imprisonment-modify-sc.component';
import { BenefitDetailDcComponent } from './benefit-details-dc/benefit-detail-dc.component';
import { PaymentTabDetailsDcComponent } from './payment-tab-details-dc/payment-tab-details-dc.component';
import { DependentHistoryDcComponent } from './dependent-history-dc/dependent-history-dc.component';
import { DependentEligibilityDetailsScComponent } from './dependent-eligibility-details-sc/dependent-eligibility-details-sc.component';
import { TransactionHistoryDcComponent } from './transaction-history-dc/transaction-history-dc.component';
import { DocumentsTabDcComponent } from './documents-tab-dc/documents-tab-dc.component';
import { AdjustmentDetailsDcComponent } from './adjustment-details-dc/adjustment-details-dc.component';
import { ModifyBenefitPaymentScComponent } from './modify-benefit-payment-sc/modify-benefit-payment-sc.component';
import { HoldBenefitScComponent } from './hold-benefit-sc/hold-benefit-sc.component';
import { StopBenefitScComponent } from './stop-benefit-sc/stop-benefit-sc.component';
import { FuneralGrantApplyScComponent } from './funeral-grant-apply-sc/funeral-grant-apply-sc.component';
import { RestartBenefitScComponent } from './restart-benefit/restart-benefit-sc/restart-benefit-sc.component';
import { RestartDetailsDcComponent } from './restart-benefit/restart-details-dc/restart-details-dc.component';
import { BenefitRestartDetailsDcComponent } from './restart-benefit/benefit-restart-details-dc/benefit-restart-details-dc.component';
import { ModifyBankCommitmentScComponent } from './modify-commitment/modify-bank-commitment-sc/modify-bank-commitment-sc.component';
import { PaymentBankDetailsDcComponent } from './modify-commitment/payment-bank-details-dc/payment-bank-details-dc.component';
import { AddBankTemplateDcComponent } from './modify-commitment/add-bank-template-dc/add-bank-template-dc.component';
import { AddBankCommitmentScComponent } from './modify-commitment/add-bank-commitment-sc/add-bank-commitment-sc.component';
import { RemoveBankCommitmentScComponent } from './modify-commitment/remove-bank-commitment-sc/remove-bank-commitment-sc.component';
import { ViewBankTemplateDcComponent } from './modify-commitment/view-bank-template-dc/view-bank-template-dc.component';
import { ContributorVisitScComponent } from './contributor-visit-sc/contributor-visit-sc.component';
import { FuneralGrantActiveScComponent } from './funeral-grant-active-sc/funeral-grant-active-sc.component';
import { ActiveHeirDetailsScComponent } from './active-heir-details-sc/active-heir-details-sc.component';
import { ActiveHeirBenefitScComponent } from './active-heir-benefit-sc/active-heir-benefit-sc.component';
import { BenefitEligibilityHitoryDcComponent } from './benefit-eligibility-hitory-dc/benefit-eligibility-hitory-dc.component';
import { AddDocumentsScComponent } from './add-documents-sc/add-documents-sc.component';
import { MedicalboardAssessmentModule } from '@gosi-ui/foundation/form-fragments';
import {SharedModule as SharedFormFragments} from '@gosi-ui/foundation/form-fragments/lib/shared/shared.module'
import { MedicalboardAppealAssessmentsModule } from '@gosi-ui/foundation/form-fragments/lib/medicalboard-appeal-assessments/medicalboard-appeal-assessments.module';
import { HeirDirectPaymentScComponent } from './heir-direct-payment/heir-direct-payment-sc/heir-direct-payment-sc.component';
import { SelectHeirPaymentScComponent } from './heir-direct-payment/select-heir-payment-sc/select-heir-payment-sc.component';
import { DirectPaymentDetailsDcComponent } from './heir-direct-payment/direct-payment-details-dc/direct-payment-details-dc.component';
import { DirectPaymentHistoryScComponent } from './direct-payment-history-sc/direct-payment-history-sc.component';
import { DirectPaymentHistoryFilterDcComponent } from './direct-payment-history-filter-dc/direct-payment-history-filter-dc.component';

@NgModule({
  declarations: [
    AddDocumentsScComponent,
    PensionApplyScComponent,
    LumpsumAppplyScComponent,
    HeirDetailsScComponent,
    DependentDetailsScComponent,
    DisabilityAssessmentComponents,
    DirectPaymentHistoryScComponent,
    HeirRegisterScComponent,
    PensionModifyScComponent,
    PensionActiveScComponent,
    InjuryDetailsScComponent,
    DisabilityDetailsTimelineDcComponent,
    DependentModifyScComponent,
    LinkedContributorScComponent,
    HeirSearchProfileScComponent,
    LumpsumActiveScComponent,
    HeirModifyScComponent,
    ImprisonmentModifyScComponent,
    BenefitDetailDcComponent,
    PaymentTabDetailsDcComponent,
    DependentHistoryDcComponent,
    DependentEligibilityDetailsScComponent,
    TransactionHistoryDcComponent,
    DocumentsTabDcComponent,
    AdjustmentDetailsDcComponent,
    ModifyBenefitPaymentScComponent,
    HoldBenefitScComponent,
    StopBenefitScComponent,
    FuneralGrantApplyScComponent,
    RestartBenefitScComponent,
    RestartDetailsDcComponent,
    BenefitRestartDetailsDcComponent,
    ModifyBankCommitmentScComponent,
    PaymentBankDetailsDcComponent,
    AddBankTemplateDcComponent,
    AddBankCommitmentScComponent,
    RemoveBankCommitmentScComponent,
    ViewBankTemplateDcComponent,
    FuneralGrantApplyScComponent,
    ContributorVisitScComponent,
    FuneralGrantActiveScComponent,
    ActiveHeirDetailsScComponent,
    ActiveHeirBenefitScComponent,
    BenefitEligibilityHitoryDcComponent,
    HeirDirectPaymentScComponent,
    SelectHeirPaymentScComponent,
    DirectPaymentDetailsDcComponent,
    DirectPaymentHistoryFilterDcComponent
  ],
  imports: [CommonModule, AnnuityRoutingModule, ThemeModule, SharedModule, MedicalboardAssessmentModule, SharedFormFragments, MedicalboardAppealAssessmentsModule],
  exports: [MedicalboardAssessmentModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnnuityModule {}
