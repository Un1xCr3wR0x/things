/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar, DocumentItem, TransactionReferenceData } from '@gosi-ui/core';
import { Expenses } from './expenses';
import { CalculationWrapper } from './calculation-wrapper';
import { CompanionDetails } from './companion-details';
import { ExpenseDetails } from './expense-details';
import { TreatmentService } from './treatment-service';
import { PayeeDetails } from './payee-details';

export class Claims {
  actualPaymentStatus: BilingualText = new BilingualText();
  amount?: number;
  claimType: BilingualText;
  claimsPayee: string;
  endDate: GosiCalendar = new GosiCalendar();
  expenses: Expenses[];
  reImbId: number = undefined;
  reimbComments?: TransactionReferenceData[] = [];
  reimbRejectionReason?: BilingualText;
  reimbPendingReason?: BilingualText;
  reimbRejectionDate?: GosiCalendar = new GosiCalendar();
  invoiceItemId: number = undefined;
  initiatedByEst?: boolean;
  icon?: string;
  showDetails: Boolean;
  showBox?: boolean;
  referenceNo?: number;
  expenseDetails: ExpenseDetails;
  chequeNo: number;
  recoveryMethod?: BilingualText = new BilingualText();
  reissue?: boolean = undefined;
  serviceDetails: TreatmentService;
  recoveryDetails?: TreatmentService;
  benefitStartDate?: GosiCalendar = new GosiCalendar();
  benefitEndDate?: GosiCalendar = new GosiCalendar();
  invoiceNo: string = undefined;
  accountNumber: number = undefined;
  document?: DocumentItem[] = [];
  paymentDate: GosiCalendar = new GosiCalendar();
  cashedDate: GosiCalendar = new GosiCalendar();
  paymentStatus: BilingualText = new BilingualText();
  payableTo: string = undefined;
  paymentMethod: BilingualText = new BilingualText();
  requestDate: GosiCalendar = new GosiCalendar();
  startDate: GosiCalendar = new GosiCalendar();
  transactionId: number = undefined;
  calculationWrapper: CalculationWrapper;
  companionDetails: CompanionDetails;
  claimId: number = undefined;
  invoiceId: number = undefined;
  claimNo: number = undefined;
  payeeDetails: PayeeDetails;
}
