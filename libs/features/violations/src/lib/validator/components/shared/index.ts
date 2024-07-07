/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorDetailsDcComponent } from './contributor-details-dc/contributor-details-dc.component';
import { InspectionDetailsDcComponent } from './inspection-details-dc/inspection-details-dc.component';
import { PenalityCalculationDetailsDcComponent } from './penality-calculation-details-dc/penality-calculation-details-dc.component';
import { TransactionsAccordionDcComponent } from './transactions-accordion-dc/transactions-accordion-dc.component';
import { ValidatorEstablishmentDetailsDcComponent } from './validator-establishment-details-dc/validator-establishment-details-dc.component';
import { ValidatorViolationsDetailsDcComponent } from './validator-violations-details-dc/validator-violations-details-dc.component';
export const VIOLATION_VALIDATOR_SHARED_COMPONENTS = [
  ValidatorEstablishmentDetailsDcComponent,
  ValidatorViolationsDetailsDcComponent,
  ContributorDetailsDcComponent,
  InspectionDetailsDcComponent,
  PenalityCalculationDetailsDcComponent,
  TransactionsAccordionDcComponent
];

export * from './contributor-details-dc/contributor-details-dc.component';
export * from './inspection-details-dc/inspection-details-dc.component';
export * from './penality-calculation-details-dc/penality-calculation-details-dc.component';
export * from './validator-establishment-details-dc/validator-establishment-details-dc.component';
export * from './validator-violations-details-dc/validator-violations-details-dc.component';
export * from './transactions-accordion-dc/transactions-accordion-dc.component';
