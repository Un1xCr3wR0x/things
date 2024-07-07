import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsDcComponent } from './transactions-dc.component';
import { SharedModule } from '../shared/shared.module';
import { TRANSACTIONS_COMPONENTS } from './components';
import { AddBankScComponent } from './components/add-bank-sc/add-bank-sc.component';
import { CertificateGenerateScComponent } from './components/certificate-generate-sc/certificate-generate-sc.component';
import { ReopenTransactionScComponent } from './components/reopen-transaction-sc/reopen-transaction-sc.component';
import { AddNinDetailsScComponent } from './components/add-nin-sc/add-nin-sc.component';

@NgModule({
  declarations: [TransactionsDcComponent, TRANSACTIONS_COMPONENTS, AddBankScComponent, CertificateGenerateScComponent, ReopenTransactionScComponent, AddNinDetailsScComponent],
  imports: [CommonModule, TransactionsRoutingModule, SharedModule]
})
export class TransactionsModule {}
