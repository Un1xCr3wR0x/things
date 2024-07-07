import { GosiCalendar } from '@gosi-ui/core/lib/models/gosi-calendar';
import { BilingualText } from '@gosi-ui/core';

export class BillHistoryItem {
  firstBillIssueDate: GosiCalendar = new GosiCalendar();
  firstBillIssueMonth: BilingualText;
  fullyPaidMonth: null;
  noOfMonthsSinceLastPaid: number;
  totalNoOfRecords: number;
  outstandingAmount: number = undefined;
  contributorName: BilingualText;
  billPaymentStatus: BilingualText;
}
export const billingListData = {
  items: [
    {
      billPaymentStatus: { arabic: 'مسددة', english: 'Paid' },
      firstBillIssueDate: null,
      firstBillIssueMonth: null,
      fullyPaidMonth: null,
      noOfMonthsSinceLastPaid: 0,
      outstandingAmount: 0,
      totalNoOfRecords: 0
    }
  ]
};
