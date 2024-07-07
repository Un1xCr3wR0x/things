/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TerminateEstablishmentScComponent } from './terminate-establishment-sc/terminate-establishment-sc.component';
import { TerminateEstablishmentDetailsDcComponent } from './terminate-establishment-details-dc/terminate-establishment-details-dc.component';
import { BalanceDetailsDcComponent } from './balance-details-dc/balance-details-dc.component';
import { BankDetailsDcComponent } from './bank-details-dc/bank-details-dc.component';
import { TerminateSystemValidationDcComponent } from './terminate-system-validation-dc/terminate-system-validation-dc.component';
import { ActiveContributorDetailsDcComponent } from './active-contributor-details-dc/active-contributor-details-dc.component';

export const TERMINATE_EST_COMPONENTS = [
  TerminateEstablishmentScComponent,
  TerminateEstablishmentDetailsDcComponent,
  BalanceDetailsDcComponent,
  BankDetailsDcComponent,
  TerminateSystemValidationDcComponent,
  ActiveContributorDetailsDcComponent
];

export * from './terminate-establishment-sc/terminate-establishment-sc.component';
export * from './terminate-establishment-details-dc/terminate-establishment-details-dc.component';
export * from './balance-details-dc/balance-details-dc.component';
export * from './bank-details-dc/bank-details-dc.component';
export * from './terminate-system-validation-dc/terminate-system-validation-dc.component';
export * from './active-contributor-details-dc/active-contributor-details-dc.component';
