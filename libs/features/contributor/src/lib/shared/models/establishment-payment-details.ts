/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { BankAccount } from './bank-account';

/**
 * Model class to hold establishment payment details.
 *
 * @export
 * @class EstablishmentPaymentDetails
 */
export class EstablishmentPaymentDetails {
  registrationNo: number = undefined;
  bankAccount: BankAccount = new BankAccount();
  paymentType: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
}
