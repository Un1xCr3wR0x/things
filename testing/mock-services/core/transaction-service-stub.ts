import { Transaction, TaskCountResponse, NotificationCount, TransactionWorkflowDetails } from '@gosi-ui/core';
import { of } from 'rxjs';

export class TransactionServiceStub {
  transaction: Transaction;

  constructor() {}
  getTransactionDetails() {
    return of(this.transaction);
  }
  setTransactionDetails(txn) {
    this.transaction = new Transaction().fromJsonToObject(txn);
  }
  getTransaction(transactionTraceId) {
    if (transactionTraceId) return of(this.transaction);
  }
  getInboxCount() {
    return of(TaskCountResponse);
  }
  getNotificationCount() {
    return of(NotificationCount);
  }
  navigate(transaction: Transaction) {
    this.transaction = transaction;
  }
  resetTransaction() {
    return of(null);
  }
  getWorkflowDetails(transactionTraceId) {
    if (transactionTraceId) return of(TransactionWorkflowDetails);
  }
}
