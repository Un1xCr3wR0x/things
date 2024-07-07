/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DocumentDcComponent } from './document-dc/document-dc.component';
import { AmwViewDcComponent } from './amw-view-dc/amw-view-dc.component';
import { AdjustmentDetailDcComponent } from './adjustment-detail-dc/adjustment-detail-dc.component';
import { AdjustmentValidatorDetailsDcComponent } from './adjustment-validator-details-dc/adjustment-validator-details-dc.component';
import { AdjustmentNetAmountDcComponent } from './adjustment-net-amount-dc/adjustment-net-amount-dc.component';
import { BankDetailsSanedDcComponent } from './bank-details-saned-dc/bank-details-saned-dc.component';
import { BenefitCalculationDetailsDcComponent } from './benefit-calculation-details-dc/benefit-calculation-details-dc.component';
import { BenefitDetailsSanedDcComponent } from './benefit-details-saned-dc/benefit-details-saned-dc.component';
import { BenefitDetailsStoppedDcComponent } from './benefit-details-stopped-dc/benefit-details-stopped-dc.component';
import { EligibilityCriteriaDcComponent } from './eligibility-criteria-dc/eligibility-criteria-dc.component';
import { BenefitsAdjustmentDcComponent } from './benefits-adjustment-dc/benefits-adjustment-dc.component';
import { AnnuityCalculationDetailsDcComponent } from './annuity-calculation-details-dc/annuity-calculation-details-dc.component';
import { EligibleMonthsDcComponent } from './eligible-months-dc/eligible-months-dc.component';
import { AnnuityBenefitsDcComponent } from './annuity-benefits-dc/annuity-benefits-dc.component';
import { TransactionCancelPopupDcComponent } from './transaction-cancel-popup-dc/transaction-cancel-popup-dc.component';
import { ContactDetailsDcComponent } from './contact-details-dc/contact-details-dc.component';
import { ContributorCommonDcComponent } from './contributor-common-dc/contributor-common-dc.component';
import { PaymentDetailsDcComponent } from './payment-details-dc/payment-details-dc.component';
import { AttorneyDetailsDcComponent } from './attorney-details-dc/attorney-details-dc.component';
import { DeclarationDcComponent } from './declaration-dc/declaration-dc.component';
import { DependentAddEditDcComponent } from './dependent-add-edit-dc/dependent-add-edit-dc.component';
import { DependentAddDcComponent } from './dependent-add-dc/dependent-add-dc.component';
import { DependentsHistoryDcComponent } from './dependents-history-dc/dependents-history-dc.component';
import { RequestDateDcComponent } from './request-date-dc/request-date-dc.component';
import { HeirListingDcComponent } from './heir-listing-dc/heir-listing-dc.component';
import { HeirModifyStatusDcComponent } from './heir-modify-status-dc/heir-modify-status-dc.component';
import { HeirReasonBenefitDcComponent } from './heir-reason-benefit-dc/heir-reason-benefit-dc.component';
import { HeirAddEditDcComponent } from './heir-add-edit-dc/heir-add-edit-dc.component';
import { HeirAddDcComponent } from './heir-add-dc/heir-add-dc.component';
import { HeirContactDetailsDcComponent } from './heir-contact-details-dc/heir-contact-details-dc.component';
import { AddGuardianDcComponent } from './add-guardian-dc/add-guardian-dc.component';
import { CalendarHijiriGregorianDcComponent } from './calendar-hijiri-gregorian-dc/calendar-hijiri-gregorian-dc.component';
import { BenefitsTimelineDcComponent } from './benefits-timeline-dc/benefits-timeline-dc.component';
import { SearchPersonDcComponent } from './search-person-dc/search-person-dc.component';
import { DependentModifyStatusDcComponent } from './dependent-modify-status-dc/dependent-modify-status-dc.component';
import { DependentListingDcComponent } from './dependent-listing-dc/dependent-listing-dc.component';
import { DependentHistoryFilterDcComponent } from './dependent-history-filter-dc/dependent-history-filter-dc.component';
import { BenefitAfterModfiyDependentsDcComponent } from './benefit-after-modfiy-dependents-dc/benefit-after-modfiy-dependents-dc.component';
import { PaymentHistoryDcComponent } from './payment-history-dc/payment-history-dc.component';
import { PaymentHistoryFilterDcComponent } from './payment-history-filter-dc/payment-history-filter-dc.component';
import { TimelineDcComponent } from './timeline-dc/timeline-dc.component';
import { PaymentOptionsDcComponent } from './payment-options-dc/payment-options-dc.component';
import { HeirAddUnbornDcComponent } from './heir-add-unborn-dc/heir-add-unborn-dc.component';
import { BenefitHistoryFilterDcComponent } from './benefit-history-filter-dc/benefit-history-filter-dc.component';
import { ReasonForLateRequestDcComponent } from './reason-for-late-request-dc/reason-for-late-request-dc.component';
import { AppliedFiltersDcComponent } from './applied-filters-dc/applied-filters-dc.component';
import { FilterTagDcComponent } from './filter-tag-dc/filter-tag-dc.component';
import { ModifyActionDcComponent } from './modify-action-dc/modify-action-dc.component';
import { HeirBenefitAfterModifyDetailsDcComponent } from './heir-benefit-after-modify-details-dc/heir-benefit-after-modify-details-dc.component';
import { WaiveBenefitDcComponent } from './waive-benefit-dc/waive-benefit-dc.component';
import { SearchBenefitDcComponent } from './search-benefit-dc/search-benefit-dc.component';
import { RefundVoluntaryContributionsDcComponent } from './refund-voluntary-contributions-dc/refund-voluntary-contributions-dc.component';
import { HeirAddQuestionDcComponent } from './heir-add-question-dc/heir-add-question-dc.component';
import { HeirAddEventDcComponent } from './heir-add-event-dc/heir-add-event-dc.component';
import { PaymentMethodDetailsDcComponent } from './payment-method-details-dc/payment-method-details-dc.component';
import { CommitmentPaymentDetailsDcComponent } from './commitment-payment-details-dc/commitment-payment-details-dc.component';
import { AddEventPopupDcComponent } from './add-event-popup-dc/add-event-popup-dc.component';
import { IneligibilityDetailsDcComponent } from './ineligibility-details-dc/ineligibility-details-dc.component';
import { FuneralGrantDetailsDcComponent } from './funeral-grant-details-dc/funeral-grant-details-dc.component';
import { BeneficiaryDetailsDcComponent } from './beneficiary-details-dc/beneficiary-details-dc.component';
import { BankAccountDetailsDcComponent } from './bank-account-details-dc/bank-account-details-dc.component';
import { SelectHeirDcComponent } from './select-heir-dc/select-heir-dc.component';
import { AnnualNotificationDetailsDcComponent } from './annual-notification-details-dc/annual-notification-details-dc.component';
import { ImprisonmentDetailDcComponent } from './imprisonment-detail-dc/imprisonment-detail-dc.component';
import { ImprisonmentModifyDetailsScComponent } from './transaction-details/imprisonment-modify-details-sc/imprisonment-modify-details-sc.component';
import { ImprisonmentBenefitsDcComponent } from './imprisonment-details-dc/imprisonment-benefits-dc.component';
import { AnnuityContributorcComponent } from './annuity-contributor-dc/annuity-contributor-dc.component';
import { PersonContactDetailsDcComponent } from './person-contact-details-dc/person-contact-details-dc.component';
import { FuneralHeirDetailsDcComponent } from './funeral-heir-details-dc/funeral-heir-details-dc.component';
import { HeirDetailsDcComponent } from './heir-details-dc/heir-details-dc.component';
import { BenefitWaiveDetailsDcComponent } from './benefit-waive-details-dc/benefit-waive-details-dc.component';
import { DependentDetailsDcComponent } from './dependent-details-dc/dependent-details-dc.component';
import { PersonBankDetailsDcComponent } from './person-bank-details-dc/person-bank-details-dc.component';
import { WomanContributorDetailsDcComponent } from './woman-contributor-details-dc/woman-contributor-details-dc.component';
import { ValidatorAdjustmentContributorDcComponent } from './validator-adjustment-contributor-dc/validator-adjustment-contributor-dc.component';
import { SanedBenefitDcComponent } from './saned-benefit-dc/saned-benefit-dc.component';
import { RecalculationEquationDcComponent } from './recalculation-equation-dc/recalculation-equation-dc.component';
import { RecalculationWageDcComponent } from './recalculation-wage-dc/recalculation-wage-dc.component';
import { SanedAdjustmentDcComponent } from './saned-adjustment-dc/saned-adjustment-dc.component';
import { RecalculationContributoryWageDcComponent } from './recalculation-contributory-wage-dc/recalculation-contributory-wage-dc.component';
import { RejoinigEquationDcComponent } from './rejoinig-equation-dc/rejoinig-equation-dc.component';
import { ContributoryWagesDcComponent } from './contributory-wages-dc/contributory-wages-dc.component';
import { HeirEligibilityDetailsDcComponent } from './heir-eligibility-details-dc/heir-eligibility-details-dc.component';
import { HeirsDetailsDcComponent } from './heirs-details-dc/heirs-details-dc.component';
import { DelayInRequestDcComponent } from './delay-in-request-dc/delay-in-request-dc.component';
import { DisabilityAssessmentTimelineDcComponent } from './disability-assessment-timeline-dc/disability-assessment-timeline-dc.component';
import { WebsiteNavigationPopupDcComponent } from './website-navigation-popup-dc/website-navigation-popup-dc.component';
import { StatusDisplayDcComponent } from './status-display-dc/status-display-dc.component';
import { ImprisonmentAdjustmentDcComponent } from './imprisonment-adjustment-dc/imprisonment-adjustment-dc.component';
import { HeirAdjustmentDetailsDcComponent } from './heir-adjustment-details-dc/heir-adjustment-details-dc.component';
import { NetPaymentDetailsDcComponent } from './net-payment-details-dc/net-payment-details-dc.component';
import { BenefitsWageDetailsDcComponent } from './benefits-wage-details-dc/benefits-wage-details-dc.component';
import { ValidatorHeirBenefitsDetailsDcComponent } from './validator-heir-benefits-details-dc/validator-heir-benefits-details-dc.component';
import { ExtendAnnualNotificationDcComponent } from './extend-annual-notification-dc/extend-annual-notification-dc.component';
import { AddModifyDependentDcComponent } from './add-modify-dependent-dc/add-modify-dependent-dc.component';
import { AnnualNotificationValidatorDcComponent } from './annual-notification-validator-dc/annual-notification-validator-dc.component';
import { HeirModifyDcComponent } from './heir-modify-dc/heir-modify-dc.component';
import { HeirAnnualNotificationDetailsDcComponent } from './heir-annual-notification-details-dc/heir-annual-notification-details-dc.component';
import { CurrentPaymentDetailsDcComponent } from './current-payment-details-dc/current-payment-details-dc.component';
import { ValidatorDisabilityDetailsDcComponent } from './validator-disability-details-dc/validator-disability-details-dc.component';
import { AdjustmentPopupDcComponent } from './adjustment-popup-dc/adjustment-popup-dc.component';
import { HeirUnbornEditDcComponent } from './heir-unborn-edit-dc/heir-unborn-edit-dc.component';
import { NewbornAddDcComponent } from './newborn-add-dc/newborn-add-dc.component';
import { EligibilityWarningPopupDcComponent } from './eligibility-warning-popup-dc/eligibility-warning-popup-dc.component';
import { EngagementChangePeriodsDcComponent } from './engagement-change-periods-dc/engagement-change-periods-dc.component';
import { BenefitCalcDetailsDcComponent } from './benefit-calc-details-dc/benefit-calc-details-dc.component';
import { CancelTransactionPopupDcComponent } from './cancel-transaction-popup-dc/cancel-transaction-popup-dc.component';
import { AnnuityDisabilityDcComponent } from './disability-add-dc/disability-add-dc.component';
import { VicDetailsDcComponent } from './vic-details-dc/vic-details-dc.component';
import { RetirementPensionDetailsScComponent } from './transaction-details/retirement-pension-details-sc/retirement-pension-details-sc.component';
import { PaymentHistorySimisDcComponent } from './payment-history-simis-dc/payment-history-simis-dc.component';
import { PreviousPaymentHistorySimisDcComponent } from './previous-payment-history-simis-dc/previous-payment-history-simis-dc.component';
import { PaymentHistoryMainframeDcComponent } from './payment-history-mainframe-dc/payment-history-mainframe-dc.component';
import { RetirementLumpsumDetailsScComponent } from './transaction-details/retirement-lumpsum-details-sc/retirement-lumpsum-details-sc.component';
import { ReturnLumpsumDetailsScComponent } from './transaction-details/return-lumpsum-details-sc/return-lumpsum-details-sc.component';
import { SanedBenefitDetailsScComponent } from './transaction-details/saned-benefit-details-sc/saned-benefit-details-sc.component';
import { UiContributorDetailsDcComponent } from './ui-contributor-details-dc/ui-contributor-details-dc.component';
import { BenefitContributionDetailsDcComponent } from './benefit-contribution-details-dc/benefit-contribution-details-dc.component';
import { ValidatorAppealDetailsDcComponent } from './validator-appeal-details-dc/validator-appeal-details-dc.component';
import { ModifyCommitmentDetailsScComponent } from './transaction-details/modify-commitment-details-sc/modify-commitment-details-sc.component';
import { FuneralGrantDetailsScComponent } from './transaction-details/funeral-grant-details-sc/funeral-grant-details-sc.component';
import { BenefitRecalculationDcComponent } from './transaction-details/benefit-recalculation-dc/benefit-recalculation-dc.component';
import { BenefitRecalculationDetailsScComponent } from './transaction-details/benefit-recalculation-details-sc/benefit-recalculation-details-sc.component';
import { CurrentBenefitdetailsDcComponent } from './transaction-details/current-benefitdetails-dc/current-benefitdetails-dc.component';
import { NewBenefitdetailsDcComponent } from './transaction-details/new-benefitdetails-dc/new-benefitdetails-dc.component';
import { RecalculateAdjustmentDcComponent } from './transaction-details/recalculate-adjustment-dc/recalculate-adjustment-dc.component';
import { SanedNetAdjustmentDcComponent } from './saned-net-adjustment-dc/saned-net-adjustment-dc.component';
import { RejoiningDetailsScComponent } from './transaction-details/rejoining-details-sc/rejoining-details-sc.component';
import { RejoiningBenefitDcComponent } from './transaction-details/rejoining-benefit-dc/rejoining-benefit-dc.component';
import { AdjustmentsDcComponent } from './adjustments-dc/adjustments-dc.component';
import { WageRecalculationDcComponent } from './transaction-details/wage-recalculation-dc/wage-recalculation-dc.component';
import { DisabilityAssessmentDetailsScComponent } from './transaction-details/disability-assessment-details-sc/disability-assessment-details-sc.component';
import { RecalculationBenefitDetailsDcComponent } from './transaction-details/recalculation-benefit-details-dc/recalculation-benefit-details-dc.component';
import { AssessmentDetailsDcComponent } from './transaction-details/assessment-details-dc/assessment-details-dc.component';
import { DisabilityAdjustmentDetailsDcComponent } from './transaction-details/disability-adjustment-details-dc/disability-adjustment-details-dc.component';
import { DependentListingMobileViewDcComponent } from './dependent-listing-mobile-view-dc/dependent-listing-mobile-view-dc.component';
import { ModifyRequestDateDcComponent } from './modify-request-date-dc/modify-request-date-dc.component';
import { SanedHistoryDcComponent } from './saned-history-dc/saned-history-dc.component';
import { EligibilityRulesBenefitModificationDcComponent } from './eligibility-rules-benefit-modification-dc/eligibility-rules-benefit-modification-dc.component';
import { PopOverDcComponent } from './pop-over-dc/pop-over-dc.component';
import { HeirAddEditReformDcComponent } from './heir-add-edit-reform-dc/heir-add-edit-reform-dc.component';
import {TranscationPaymentDetailsScComponent} from './transaction-details/transcation-payment-details-sc/transcation-payment-details-sc.component';
export const UI_SHARED_COMPONENTS = [
  AdjustmentNetAmountDcComponent,
  AnnuityDisabilityDcComponent,
  DocumentDcComponent,
  AmwViewDcComponent,
  AdjustmentValidatorDetailsDcComponent,
  AdjustmentDetailDcComponent,
  BankDetailsSanedDcComponent,
  BenefitCalculationDetailsDcComponent,
  BenefitDetailsSanedDcComponent,
  BenefitDetailsStoppedDcComponent,
  EligibilityCriteriaDcComponent,
  BenefitsAdjustmentDcComponent,
  AnnuityCalculationDetailsDcComponent,
  EligibleMonthsDcComponent,
  AnnuityBenefitsDcComponent,
  TransactionCancelPopupDcComponent,
  ContactDetailsDcComponent,
  ContributorCommonDcComponent,
  PaymentDetailsDcComponent,
  PaymentHistoryDcComponent,
  PaymentHistoryFilterDcComponent,
  PaymentMethodDetailsDcComponent,
  AttorneyDetailsDcComponent,
  DeclarationDcComponent,
  ImprisonmentModifyDetailsScComponent,
  ImprisonmentBenefitsDcComponent,
  DependentAddEditDcComponent,
  DependentAddDcComponent,
  RequestDateDcComponent,
  HeirListingDcComponent,
  HeirModifyStatusDcComponent,
  HeirReasonBenefitDcComponent,
  HeirAddEditDcComponent,
  HeirContactDetailsDcComponent,
  AddGuardianDcComponent,
  CalendarHijiriGregorianDcComponent,
  BenefitsTimelineDcComponent,
  SearchPersonDcComponent,
  DependentModifyStatusDcComponent,
  DependentListingDcComponent,
  DependentsHistoryDcComponent,
  DependentHistoryFilterDcComponent,
  BenefitAfterModfiyDependentsDcComponent,
  TimelineDcComponent,
  PaymentOptionsDcComponent,
  HeirAddUnbornDcComponent,
  BenefitHistoryFilterDcComponent,
  ReasonForLateRequestDcComponent,
  AppliedFiltersDcComponent,
  FilterTagDcComponent,
  ModifyActionDcComponent,
  HeirBenefitAfterModifyDetailsDcComponent,
  WaiveBenefitDcComponent,
  SearchBenefitDcComponent,
  RefundVoluntaryContributionsDcComponent,
  HeirAddQuestionDcComponent,
  HeirAddEventDcComponent,
  BenefitCalculationDetailsDcComponent,
  CommitmentPaymentDetailsDcComponent,
  AddEventPopupDcComponent,
  IneligibilityDetailsDcComponent,
  FuneralGrantDetailsDcComponent,
  BeneficiaryDetailsDcComponent,
  BankAccountDetailsDcComponent,
  SelectHeirDcComponent,
  SanedBenefitDetailsScComponent,
  AnnualNotificationDetailsDcComponent,
  ImprisonmentDetailDcComponent,
  AnnuityContributorcComponent,
  PersonContactDetailsDcComponent,
  DependentDetailsDcComponent,
  HeirDetailsDcComponent,
  BenefitWaiveDetailsDcComponent,
  FuneralHeirDetailsDcComponent,
  PersonBankDetailsDcComponent,
  WomanContributorDetailsDcComponent,
  ValidatorAdjustmentContributorDcComponent,
  SanedBenefitDcComponent,
  RecalculationEquationDcComponent,
  RecalculationWageDcComponent,
  SanedAdjustmentDcComponent,
  RecalculationContributoryWageDcComponent,
  RejoinigEquationDcComponent,
  HeirEligibilityDetailsDcComponent,
  HeirsDetailsDcComponent,
  DelayInRequestDcComponent,
  StatusDisplayDcComponent,
  ContributoryWagesDcComponent,
  DisabilityAssessmentTimelineDcComponent,
  WebsiteNavigationPopupDcComponent,
  ImprisonmentAdjustmentDcComponent,
  HeirAdjustmentDetailsDcComponent,
  NetPaymentDetailsDcComponent,
  BenefitsWageDetailsDcComponent,
  ValidatorHeirBenefitsDetailsDcComponent,
  ExtendAnnualNotificationDcComponent,
  EngagementChangePeriodsDcComponent,
  AddModifyDependentDcComponent,
  AnnualNotificationValidatorDcComponent,
  HeirModifyDcComponent,
  HeirAnnualNotificationDetailsDcComponent,
  CurrentPaymentDetailsDcComponent,
  ValidatorDisabilityDetailsDcComponent,
  AdjustmentPopupDcComponent,
  HeirUnbornEditDcComponent,
  NewbornAddDcComponent,
  AdjustmentPopupDcComponent,
  EligibilityWarningPopupDcComponent,
  BenefitCalcDetailsDcComponent,
  CancelTransactionPopupDcComponent,
  RetirementPensionDetailsScComponent,
  RetirementLumpsumDetailsScComponent,
  VicDetailsDcComponent,
  BenefitCalcDetailsDcComponent,
  PaymentHistorySimisDcComponent,
  PreviousPaymentHistorySimisDcComponent,
  PaymentHistoryMainframeDcComponent,
  SanedNetAdjustmentDcComponent,
  HeirAddDcComponent,
  ReturnLumpsumDetailsScComponent,
  UiContributorDetailsDcComponent,
  BenefitContributionDetailsDcComponent,
  ValidatorAppealDetailsDcComponent,
  ModifyCommitmentDetailsScComponent,
  FuneralGrantDetailsScComponent,
  BenefitRecalculationDcComponent,
  BenefitRecalculationDetailsScComponent,
  CurrentBenefitdetailsDcComponent,
  NewBenefitdetailsDcComponent,
  RecalculateAdjustmentDcComponent,
  SanedNetAdjustmentDcComponent,
  RejoiningDetailsScComponent,
  RejoiningBenefitDcComponent,
  AdjustmentsDcComponent,
  WageRecalculationDcComponent,
  DisabilityAssessmentDetailsScComponent,
  RecalculationBenefitDetailsDcComponent,
  AssessmentDetailsDcComponent,
  DisabilityAdjustmentDetailsDcComponent,
  RejoiningBenefitDcComponent,
  DependentListingMobileViewDcComponent,
  ModifyRequestDateDcComponent,
  SanedHistoryDcComponent,
  EligibilityRulesBenefitModificationDcComponent,
  PopOverDcComponent,
  HeirAddEditReformDcComponent,
  TranscationPaymentDetailsScComponent
];

export * from './base';
export * from './document-dc/document-dc.component';
export * from './amw-view-dc/amw-view-dc.component';
export * from './disability-add-dc/disability-add-dc.component';
export * from './vic-details-dc/vic-details-dc.component';
export * from './adjustment-detail-dc/adjustment-detail-dc.component';
export * from './adjustment-net-amount-dc/adjustment-net-amount-dc.component';
export * from './adjustment-validator-details-dc/adjustment-validator-details-dc.component';
export * from './bank-details-saned-dc/bank-details-saned-dc.component';
export * from './benefit-calculation-details-dc/benefit-calculation-details-dc.component';
export * from './benefit-details-saned-dc/benefit-details-saned-dc.component';
export * from './benefit-details-stopped-dc/benefit-details-stopped-dc.component';
export * from './eligibility-criteria-dc/eligibility-criteria-dc.component';
export * from './benefits-adjustment-dc/benefits-adjustment-dc.component';
export * from './benefit-calc-details-dc/benefit-calc-details-dc.component';
export * from './annuity-calculation-details-dc/annuity-calculation-details-dc.component';
export * from './eligible-months-dc/eligible-months-dc.component';
export * from './engagement-change-periods-dc/engagement-change-periods-dc.component';
export * from './annuity-benefits-dc/annuity-benefits-dc.component';
export * from './contact-details-dc/contact-details-dc.component';
export * from './contributor-common-dc/contributor-common-dc.component';
export * from './payment-details-dc/payment-details-dc.component';
export * from './payment-method-details-dc/payment-method-details-dc.component';
export * from './payment-history-dc/payment-history-dc.component';
export * from './payment-history-filter-dc/payment-history-filter-dc.component';
export * from './attorney-details-dc/attorney-details-dc.component';
export * from './declaration-dc/declaration-dc.component';
export * from './imprisonment-details-dc/imprisonment-benefits-dc.component';
export * from './dependent-add-edit-dc/dependent-add-edit-dc.component';
export * from './dependent-add-dc/dependent-add-dc.component';
export * from './dependents-history-dc/dependents-history-dc.component';
export * from './request-date-dc/request-date-dc.component';
export * from './heir-listing-dc/heir-listing-dc.component';
export * from './heir-reason-benefit-dc/heir-reason-benefit-dc.component';
export * from './heir-add-edit-dc/heir-add-edit-dc.component';
export * from './heir-add-dc/heir-add-dc.component';
export * from './heir-contact-details-dc/heir-contact-details-dc.component';
export * from './add-guardian-dc/add-guardian-dc.component';
export * from './calendar-hijiri-gregorian-dc/calendar-hijiri-gregorian-dc.component';
export * from './search-person-dc/search-person-dc.component';
export * from './dependent-modify-status-dc/dependent-modify-status-dc.component';
export * from './dependent-listing-dc/dependent-listing-dc.component';
export * from './dependents-history-dc/dependents-history-dc.component';
export * from './dependent-history-filter-dc/dependent-history-filter-dc.component';
export * from './benefit-after-modfiy-dependents-dc/benefit-after-modfiy-dependents-dc.component';
export * from './timeline-dc/timeline-dc.component';
export * from './status-display-dc/status-display-dc.component';
export * from './payment-options-dc/payment-options-dc.component';
export * from './heir-add-unborn-dc/heir-add-unborn-dc.component';
export * from './benefit-history-filter-dc/benefit-history-filter-dc.component';
export * from './reason-for-late-request-dc/reason-for-late-request-dc.component';
export * from './applied-filters-dc/applied-filters-dc.component';
export * from './filter-tag-dc/filter-tag-dc.component';
export * from './modify-action-dc/modify-action-dc.component';
export * from './heir-benefit-after-modify-details-dc/heir-benefit-after-modify-details-dc.component';
export * from './waive-benefit-dc/waive-benefit-dc.component';
export * from './heir-modify-status-dc/heir-modify-status-dc.component';
export * from './refund-voluntary-contributions-dc/refund-voluntary-contributions-dc.component';
export * from './heir-add-question-dc/heir-add-question-dc.component';
export * from './heir-add-event-dc/heir-add-event-dc.component';
export * from './benefit-calculation-details-dc/benefit-calculation-details-dc.component';
export * from './commitment-payment-details-dc/commitment-payment-details-dc.component';
export * from './add-event-popup-dc/add-event-popup-dc.component';
export * from './ineligibility-details-dc/ineligibility-details-dc.component';
export * from './funeral-grant-details-dc/funeral-grant-details-dc.component';
export * from './transaction-details/saned-benefit-details-sc/saned-benefit-details-sc.component';
export * from './select-heir-dc/select-heir-dc.component';
export * from './beneficiary-details-dc/beneficiary-details-dc.component';
export * from './bank-account-details-dc/bank-account-details-dc.component';
export * from './annual-notification-details-dc/annual-notification-details-dc.component';
export * from './imprisonment-details-dc/imprisonment-benefits-dc.component';
export * from './imprisonment-detail-dc/imprisonment-detail-dc.component';
export * from './annuity-contributor-dc/annuity-contributor-dc.component';
export * from './payment-method-details-dc/payment-method-details-dc.component';
export * from './person-contact-details-dc/person-contact-details-dc.component';
export * from './dependent-details-dc/dependent-details-dc.component';
export * from './heir-details-dc/heir-details-dc.component';
export * from './benefit-waive-details-dc/benefit-waive-details-dc.component';
export * from './funeral-heir-details-dc/funeral-heir-details-dc.component';
export * from './person-bank-details-dc/person-bank-details-dc.component';
export * from './woman-contributor-details-dc/woman-contributor-details-dc.component';
export * from './validator-adjustment-contributor-dc/validator-adjustment-contributor-dc.component';
export * from './saned-benefit-dc/saned-benefit-dc.component';
export * from './recalculation-equation-dc/recalculation-equation-dc.component';
export * from './recalculation-wage-dc/recalculation-wage-dc.component';
export * from './saned-adjustment-dc/saned-adjustment-dc.component';
export * from './recalculation-contributory-wage-dc/recalculation-contributory-wage-dc.component';
export * from './rejoinig-equation-dc/rejoinig-equation-dc.component';
export * from './contributory-wages-dc/contributory-wages-dc.component';
export * from './disability-assessment-timeline-dc/disability-assessment-timeline-dc.component';
export * from './heir-eligibility-details-dc/heir-eligibility-details-dc.component';
export * from './heirs-details-dc/heirs-details-dc.component';
export * from './delay-in-request-dc/delay-in-request-dc.component';
export * from './benefits-wage-details-dc/benefits-wage-details-dc.component';
export * from './heir-adjustment-details-dc/heir-adjustment-details-dc.component';
export * from './net-payment-details-dc/net-payment-details-dc.component';
export * from './website-navigation-popup-dc/website-navigation-popup-dc.component';
export * from './imprisonment-adjustment-dc/imprisonment-adjustment-dc.component';
export * from './transaction-details/imprisonment-modify-details-sc/imprisonment-modify-details-sc.component';
export * from './heir-adjustment-details-dc/heir-adjustment-details-dc.component';
export * from './net-payment-details-dc/net-payment-details-dc.component';
export * from './validator-heir-benefits-details-dc/validator-heir-benefits-details-dc.component';
export * from './extend-annual-notification-dc/extend-annual-notification-dc.component';
export * from './annual-notification-validator-dc/annual-notification-validator-dc.component';
export * from './heir-modify-dc/heir-modify-dc.component';
export * from './heir-annual-notification-details-dc/heir-annual-notification-details-dc.component';
export * from './current-payment-details-dc/current-payment-details-dc.component';
export * from './validator-disability-details-dc/validator-disability-details-dc.component';
export * from './adjustment-popup-dc/adjustment-popup-dc.component';
export * from './heir-unborn-edit-dc/heir-unborn-edit-dc.component';
export * from './newborn-add-dc/newborn-add-dc.component';
export * from './eligibility-warning-popup-dc/eligibility-warning-popup-dc.component';
export * from './cancel-transaction-popup-dc/cancel-transaction-popup-dc.component';
export * from './transaction-details/retirement-pension-details-sc/retirement-pension-details-sc.component';
export * from './transaction-details/retirement-lumpsum-details-sc/retirement-lumpsum-details-sc.component';
export * from './payment-history-simis-dc/payment-history-simis-dc.component';
export * from './payment-history-mainframe-dc/payment-history-mainframe-dc.component';
export * from './transaction-details/return-lumpsum-details-sc/return-lumpsum-details-sc.component';
export * from './ui-contributor-details-dc/ui-contributor-details-dc.component';
export * from './benefit-contribution-details-dc/benefit-contribution-details-dc.component';
export * from './validator-appeal-details-dc/validator-appeal-details-dc.component';
export * from './transaction-details/modify-commitment-details-sc/modify-commitment-details-sc.component';
export * from './transaction-details/funeral-grant-details-sc/funeral-grant-details-sc.component';
export * from './transaction-details/benefit-recalculation-dc/benefit-recalculation-dc.component';
export * from './transaction-details/benefit-recalculation-details-sc/benefit-recalculation-details-sc.component';
export * from './transaction-details/current-benefitdetails-dc/current-benefitdetails-dc.component';
export * from './transaction-details/new-benefitdetails-dc/new-benefitdetails-dc.component';
export * from './transaction-details/recalculate-adjustment-dc/recalculate-adjustment-dc.component';
export * from './saned-net-adjustment-dc/saned-net-adjustment-dc.component';
export * from './transaction-details/rejoining-details-sc/rejoining-details-sc.component';
export * from './transaction-details/rejoining-benefit-dc/rejoining-benefit-dc.component';
export * from './transaction-cancel-popup-dc/transaction-cancel-popup-dc.component';
export * from './transaction-details/wage-recalculation-dc/wage-recalculation-dc.component';
export * from './adjustments-dc/adjustments-dc.component';
export * from './transaction-details/disability-assessment-details-sc/disability-assessment-details-sc.component';
export * from './transaction-details/recalculation-benefit-details-dc/recalculation-benefit-details-dc.component';
export * from './transaction-details/assessment-details-dc/assessment-details-dc.component';
export * from './transaction-details/disability-adjustment-details-dc/disability-adjustment-details-dc.component';
export * from './annuity-calculation-details-dc/annuity-calculation-details-dc.component';
export * from './modify-request-date-dc/modify-request-date-dc.component';
export * from './saned-history-dc/saned-history-dc.component';
export * from './eligibility-rules-benefit-modification-dc/eligibility-rules-benefit-modification-dc.component';
export * from './pop-over-dc/pop-over-dc.component';
export * from './heir-add-edit-reform-dc/heir-add-edit-reform-dc.component';
export * from './transaction-details/transcation-payment-details-sc/transcation-payment-details-sc.component';
