/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, ContactDetails, GosiCalendar } from '@gosi-ui/core';
import { BenefitPaymentDetails, PaymentHistoryDetails } from '.';

export class PaymentDetail {
  bankHoldDate?: GosiCalendar = new GosiCalendar();
  benefitDetails: BenefitPaymentDetails;
  history: PaymentHistoryDetails[];
  haveBankCommitment?: boolean;
  isEditable?: boolean;
  disableBankCommitment?: boolean;
  samaVerification?: BilingualText = new BilingualText();
  message: BilingualText = new BilingualText();
  messageType: string;
  disableRemoveCommitment: boolean;
  contactDetail?: ContactDetails;
}
