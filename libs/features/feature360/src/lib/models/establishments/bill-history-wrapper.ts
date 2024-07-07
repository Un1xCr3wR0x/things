import { BillHistory } from './bill-history';
import { GosiCalendar } from '@gosi-ui/core/lib/models/gosi-calendar';
import { BilingualText } from '@gosi-ui/core';

export class BillHistoryWrapper {
  billBatchIndicator: boolean;
  availableBillStartDate: GosiCalendar[] = [];
  bills: BillHistory[];
  firstBillIssueDate: GosiCalendar = new GosiCalendar();
  firstBillIssueMonth: BilingualText;
  lastBillIssueDate?: GosiCalendar = new GosiCalendar();
  lastFullyPaidDate?: GosiCalendar = new GosiCalendar();
  lastMigratedBillStartDate?: GosiCalendar = new GosiCalendar();
  fullyPaidMonth: null;
  noOfMonthsSinceLastPaid: number;
  totalNoOfRecords: number;
  contributorName: BilingualText;
  installmentComplianceInd: BilingualText;
  requiredMinPayment: number;
  migratedBillPaidAmount: number;
  migratedBillUnPaidAmount: number;
  migratedOutstandingAmount: number;
}
