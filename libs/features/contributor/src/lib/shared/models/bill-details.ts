import { BilingualText, GosiCalendar, Name } from '@gosi-ui/core';

export class BillDetails {
  adjustedCreditBalance: number = undefined;
  ameenStartDate: GosiCalendar = new GosiCalendar();
  ameenReleaseDate?: GosiCalendar = new GosiCalendar();
  balanceDue: number = undefined;
  billBreakUp: BillBreakup = new BillBreakup();
  billNo: number = undefined;
  creditAmountFromApplyDate: number = undefined;
  carryForwardAmount: number = undefined;
  currentBill: number = undefined;
  dueDate: GosiCalendar = new GosiCalendar();
  lastBillEndDate: GosiCalendar = new GosiCalendar();
  issueDate: GosiCalendar = new GosiCalendar();
  paidAmount: number = undefined;
  previousBill: number = undefined;
  installmentAmount: number = undefined;
  summary: BillSummary[] = [];
  lateFee: number = undefined;
  amountTransferredToMof: number = undefined;
  initialBillStartDate: GosiCalendar = new GosiCalendar();
  previousMonthDues: number = undefined;
  downPaymentAmount: number = undefined;
  unBilledAmount: UnBillAmount = new UnBillAmount();
  unallocatedBalance: number = undefined;
  totalContribution: number = undefined;
  totalDebitAdjustment: number = undefined;
  totalCreditAdjustment: number = undefined;
  totalReceiptsAndCredits: number = undefined;
  totalLateFee: number = undefined;
  noOfPaidContribution?: number = undefined;
  noOfDelayedPayments?: number = undefined;
  name: Name = undefined;
  deductionRate?: number = undefined;
  contributoryWage?: number = undefined;
  adjustmentContributoryWage?: number = undefined;
  adjustmentContribution?: number = undefined;
  billStartDate: GosiCalendar = new GosiCalendar();
  latestBillStartDate: GosiCalendar = new GosiCalendar();
  creditBalanceTransferredOrRefunded: number = undefined;
  creditBalanceRefunded: number = undefined;
  creditRefundDetails: CreditRefundDetails = new CreditRefundDetails();
  totalCreditRefund: number = undefined;
  minimumPaymentRequired: number = undefined;
  minimumPaymentRequiredForMonth: number = undefined;
  migratedBill: boolean;
  overAllPaidContribution: number = undefined;
}
export class BillBreakup {
  adjustmentBreakUp: AdjustmentBreakup = new AdjustmentBreakup();
  contributionBreakUp: ContributionBreakup = new ContributionBreakup();
  lateFeeBreakUp: LateFeeBreakUp = new LateFeeBreakUp();
  accountBreakUp: AccountBreakup = new AccountBreakup();
}
export class AdjustmentBreakup {
  adjustmentDetails?: AdjustmentDetails[] = [];
}
export class AdjustmentDetails {
  adjustmentType: BilingualText = new BilingualText();
  noOfContributor: number = undefined;
  amount: number = undefined;
  number = undefined;
  penalty: number = undefined;
  total: number = undefined;
}
export class AccountBreakup {
  accountDetails: AccountDetails[] = [];
  availableCredit: number = undefined;
}
export class AccountDetails {
  accountReasonDescription: BilingualText = new BilingualText();
  accountReasonCode: number = undefined;
  creditAmount: number = undefined;
  transactionDate: GosiCalendar = new GosiCalendar();
  chequeMailedDate: GosiCalendar = new GosiCalendar();
  receiptDate: GosiCalendar = new GosiCalendar();
}
export class LateFeeBreakUp {
  lateFeeDetails: LateFeeDetails[] = [];
  totalUnpaidAmount: number = undefined;
}
export class LateFeeDetails {
  productType: BilingualText = new BilingualText();
  unPaidAmount: number = undefined;
  lateFee: number = undefined;
}
export class BillSummary {
  amount: number = undefined;
  type: BilingualText = new BilingualText();
}
export class UnBillAmount {
  rejectedOh: number = undefined;
  violations: number = undefined;
  creditAmountOnHold: number = undefined;
}
export class CreditRefundDetails {
  billBatchIndicator: boolean;
  requestedAmount: number = undefined;
  approvedAmount: number = undefined;
  registrationNo?: number = undefined;
  creditAccountDetail: CreditBalanceDetails;
  paymentMode?: BilingualText = new BilingualText();
  iban: string = undefined;
  name?: BilingualText = new BilingualText();
  status?: BilingualText = new BilingualText();
  currentAccountDetail: CreditBalanceDetails;
  creditRetainIndicator?: BilingualText = new BilingualText();
  haveActiveCancellationRequest?: boolean;

  fromJsonToObject(json) {
    Object.keys(new CreditRefundDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
export class CreditBalanceDetails {
  accountNumber: string = undefined;
  totalCreditBalance: number = undefined;
  retainedBalance: number = undefined;
  transferableBalance: number = undefined;
  totalDebitBalance: number = undefined;
  eligibleForRefund?: boolean;
}
export class ContributionBreakup {
  contributionDetails: ContributionDetails[] = [];
  totalNoOfSaudi: number = undefined;
  totalNoOfNonSaudi: number = undefined;
  totalNoOfContributors: number = undefined;
  totalNoOfEstablishments: number = undefined;
}
export class ContributionDetails {
  contributionAmount: number = undefined;
  productType: BilingualText = new BilingualText();
  noOfContributor: number = undefined;
  totalContributorsWage: number = undefined;
}
