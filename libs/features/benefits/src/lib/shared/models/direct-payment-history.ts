import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class DirectPaymentHistory {
  history: History[];
  paidDate: GosiCalendar;
}

export class History {
  benefitType: BilingualText;
  benefitAmount: number;
  benefitDetails: BenefitDetails2;
  date: Date;
  eventType: BilingualText;
  netAdjustedAmount: number;
  netAdjustedType: BilingualText;
  paidAdjustments: PaidAdjustment[];
  payments: Payment[];
  reasons: BilingualText[];
  recalculationDetails: RecalculationDetails2;
  repaymentDetails: RepaymentDetails2;
  transferType: BilingualText;
}

export class BenefitDetails2 {
  authorizedPersonId: number;
  authorizedPersonIdentifier: AuthorizedPersonIdentifier[];
  authorizedPersonName: BilingualText;
  bankAccount: BankAccount2;
  bankName: BilingualText;
  iban: string;
  lastUpdatedOn: GosiCalendar;
  payeeType: BilingualText;
  paymentMethod: BilingualText;
  personId: number;
  personIdentifier: PersonIdentifier[];
}

export class AuthorizedPersonIdentifier {}

export class BankAccount2 {
  approvalStatus: string;
  bankAccountId: number;
  bankAddress: string;
  bankCode: number;
  bankName: BilingualText;
  bankWarningMessage: BilingualText;
  comments: string;
  disableApprove: boolean;
  holdEndDate: GosiCalendar;
  holdStartDate: GosiCalendar;
  holdStatus: string;
  ibanBankAccountNo: string;
  isNewlyAdded: boolean;
  isNonSaudiIBAN: boolean;
  lastUpdatedOn: GosiCalendar;
  nonSaudiIBAN: boolean;
  referenceNo: number;
  samaAlreadyVerified: boolean;
  serviceType: string;
  status: BilingualText;
  swiftCode: string;
  verificationStatus: string;
}

export class PersonIdentifier {}

export class PaidAdjustment {
  adjustedAmount: number;
  adjustmentId: number;
  adjustmentType: BilingualText;
  benefitRequestId: number;
  benefitType: BilingualText;
  percentage: number;
  personId: number;
  reason: BilingualText;
  sin: number;
}

export class Payment {
  amount: number;
  dateFrom: GosiCalendar;
  dateTo: GosiCalendar;
  paymentType: BilingualText;
}

export class RecalculationDetails2 {
  adjustmentAmount: number;
  adjustmentType: BilingualText;
  currentBenefitAmount: number;
  currentInitialAmount: number;
  currentSubsequentAmount: number;
  eligibilityDate: GosiCalendar;
  previousBenefitAmount: number;
  previousInitialAmount: number;
  previousSubsequentAmount: number;
}

export class RepaymentDetails2 {
  additionalPaymentDetails: string;
  amountTransferred: number;
  approveDate: GosiCalendar;
  bankName: BilingualText;
  bankType: BilingualText;
  documents: Document[];
  paymentMethod: BilingualText;
  paymentReferenceNo: number;
  receiptMode: BilingualText;
  receiptNumber: number;
  transactionDate: GosiCalendar;
}

export class Document {
  documentName: string;
  documentTypeId: number;
  id: string;
  name: BilingualText;
  sequenceNo: number;
  transactionId: number;
  transactionTraceId: number;
}
