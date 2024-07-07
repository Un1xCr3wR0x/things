import { AccordionDetailsViewDcComponent } from './accordion-details-view-dc/accordion-details-view-dc.component';
import { PersonalDetailsDcComponent } from './personal-details-dc/personal-details-dc.component';
import { TransactionEstablishmentDetailsDcComponent } from './transaction-establishment-details-dc/transaction-establishment-details-dc.component';
import { TransactionVicPersonalDetailsDcComponent } from './transaction-vic-personal-details-dc/transaction-vic-personal-details-dc.component';

export const SHARED_TRANSACTIONS_COMPONENTS = [
  PersonalDetailsDcComponent,
  AccordionDetailsViewDcComponent,
  TransactionVicPersonalDetailsDcComponent,
  TransactionEstablishmentDetailsDcComponent
];

export * from './base/transaction-base-sc/transaction-base-sc.component';
export * from './personal-details-dc/personal-details-dc.component';
export * from './accordion-details-view-dc/accordion-details-view-dc.component';
export * from './transaction-vic-personal-details-dc/transaction-vic-personal-details-dc.component';
export * from './transaction-establishment-details-dc/transaction-establishment-details-dc.component';
