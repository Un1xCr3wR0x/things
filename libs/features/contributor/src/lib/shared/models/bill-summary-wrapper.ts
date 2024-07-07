import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BillSummary } from './bill-details';

export class BillSummaryWrapper {
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
export class BillHistory {
  breakUp: BillSummary[] = [];
  issueDate: GosiCalendar = new GosiCalendar();
  allocationInd: boolean;
  billNumber: number;
  billPeriod: BilingualText = new BilingualText();
  totalAmount: null;
  reditBalance: null;
  rejectedOhInd: null;
  adjustmentInd: null;
  migratedBill: boolean;
  droppedMonth: boolean;
  violationInd: null;
  paymentStatus: null;
  settlementDate: null;
  requiredMinPayment: null;
  installmentComplianceInd: null;
}
