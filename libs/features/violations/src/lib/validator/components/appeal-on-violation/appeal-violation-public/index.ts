import {AppealViolationScComponent} from './appeal-violation-sc/appeal-violation-sc.component'
import {TransactionSummaryDcComponent} from './transaction-summary-dc/transaction-summary-dc.component';
import {CustomerSummaryDcComponent} from './customer-summary-dc/customer-summary-dc.component';
import {AppealSummaryDcComponent} from './appeal-summary-dc/appeal-summary-dc.component';
import {ContributorListDcComponent} from './contributor-list-dc/contributor-list-dc.component';

export const VALIDATOR_EXTERNAL_APPEAL_VIOLATION_COMPONENTS = [
  AppealViolationScComponent,
  TransactionSummaryDcComponent,
  CustomerSummaryDcComponent,
  AppealSummaryDcComponent,
  ContributorListDcComponent
];

export * from './appeal-violation-sc/appeal-violation-sc.component';
export * from './transaction-summary-dc/transaction-summary-dc.component';
export * from './customer-summary-dc/customer-summary-dc.component';
export * from './appeal-summary-dc/appeal-summary-dc.component';
export * from './contributor-list-dc/contributor-list-dc.component';
