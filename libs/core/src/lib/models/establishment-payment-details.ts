/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BankAccount } from './bank-account';
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

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
  navigationIndicator: number = undefined;
  referenceNo: number = undefined;
  lateFeeIndicator: BilingualText = new BilingualText();
  accountStatus?: string = undefined;
  matchStatus?: string = undefined;
  creditStatus?: string = undefined;

  /**
   * Creates an instance of EstablishmentPaymentDetails.
   *
   * @memberof EstablishmentPaymentDetails
   */
  constructor() {
    this.paymentType = new BilingualText();
    this.registrationNo = 0;
    this.startDate = new GosiCalendar();
    this.bankAccount = new BankAccount();
  }
}
