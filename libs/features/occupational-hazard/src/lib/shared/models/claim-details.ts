import { Allowance } from './allowance-wrapper';
import { BilingualText } from '@gosi-ui/core';
import { PayeeDetails } from './payee-details';
export class ClaimDetail {
  claimType: BilingualText = new BilingualText();
  claimId: number = undefined;
  claimItem: Allowance[];
  contributorWage: number = undefined;
  totalAmount: number = undefined;
  paymentStatus: BilingualText = new BilingualText();
  actualPaymentStatus: BilingualText = new BilingualText();
  paymentMethod: BilingualText = new BilingualText();
  payableTo: string;
  allowancePayee: number;
  accountNumber: number = undefined;
  payeeDetails: PayeeDetails;
}
