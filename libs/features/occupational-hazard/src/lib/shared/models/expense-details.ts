/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ExpenseList } from './expense-list';

export class ExpenseDetails {
  totalAmount: number = undefined;
  endDate: Date;
  startDate: Date;
  invoiceNo: number = undefined;
  expenseList: ExpenseList[];
}
