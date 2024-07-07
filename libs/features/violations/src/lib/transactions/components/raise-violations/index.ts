/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommitteeDecisionDetailsDcComponent } from './committee-decision-details-dc/committee-decision-details-dc.component';
import { RaiseViolationsTransactionsScComponent } from './raise-violations-transactions-sc/raise-violations-transactions-sc.component';
import { TransactionContributorDetailsDcComponent } from './transaction-contributor-details-dc/transaction-contributor-details-dc.component';
import { TransactionEstablishmentDetailsDcComponent } from './transaction-establishment-details-dc/transaction-establishment-details-dc.component';
import { TransactionInspectionDetailsDcComponent } from './transaction-inspection-details-dc/transaction-inspection-details-dc.component';
import { TransactionViolationDetailsDcComponent } from './transaction-violation-details-dc/transaction-violation-details-dc.component';

export const RAISE_VIOLATIONS_TRANSACTIONS_COMPONENTS = [
  RaiseViolationsTransactionsScComponent,
  TransactionViolationDetailsDcComponent,
  TransactionEstablishmentDetailsDcComponent,
  CommitteeDecisionDetailsDcComponent,
  TransactionContributorDetailsDcComponent,
  TransactionInspectionDetailsDcComponent
];

export * from './committee-decision-details-dc/committee-decision-details-dc.component';
export * from './raise-violations-transactions-sc/raise-violations-transactions-sc.component';
export * from './transaction-contributor-details-dc/transaction-contributor-details-dc.component';
export * from './transaction-establishment-details-dc/transaction-establishment-details-dc.component';
export * from './transaction-inspection-details-dc/transaction-inspection-details-dc.component';
export * from './transaction-violation-details-dc/transaction-violation-details-dc.component';
