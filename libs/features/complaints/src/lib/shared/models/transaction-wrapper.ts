/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TransactionSummary } from './transaction-summary';
import { TaskDetails } from './task-details';

export class TransactionWrapper {
  complaint: TransactionSummary;
  taskDetails: TaskDetails[];
}
