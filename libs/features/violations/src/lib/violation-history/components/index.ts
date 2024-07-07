import { ViolationHistoryScComponent } from './violation-history-sc/violation-history-sc.component';
import { ViolationHistoryHeadingDcComponent } from './violation-history-heading-dc/violation-history-heading-dc.component';
import { ViolationHistoryFilterDcComponent } from './violation-history-filter-dc/violation-history-filter-dc.component';
import { ViolationHistoryDetailsDcComponent } from './violation-history-details-dc/violation-history-details-dc.component';
import { ViolationHistoryCardDcComponent } from './violation-history-card-dc/violation-history-card-dc.component';

export const VIOLATION_HISTORY_COMPONENTS = [
  ViolationHistoryDetailsDcComponent,
  ViolationHistoryFilterDcComponent,
  ViolationHistoryHeadingDcComponent,
  ViolationHistoryScComponent,
  ViolationHistoryCardDcComponent
];

export * from './violation-history-sc/violation-history-sc.component';
export * from './violation-history-heading-dc/violation-history-heading-dc.component';
export * from './violation-history-filter-dc/violation-history-filter-dc.component';
export * from './violation-history-details-dc/violation-history-details-dc.component';
export * from './violation-history-card-dc/violation-history-card-dc.component';
