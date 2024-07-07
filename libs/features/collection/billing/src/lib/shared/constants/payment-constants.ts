/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PaymentConstants {
  public static get DIRECT_DEBIT(): string {
    return 'Direct Debit';
  }
  public static get ATM(): string {
    return 'ATM';
  }
  public static get CASH(): string {
    return 'Cash';
  }
  public static get NON_GCC_RECEIPT_MODE(): string[] {
    return ['Sadad Network', 'Direct Debit', 'ATM', 'Cash'];
  }
  public static get CHEQUE_NUMBER_MAX_LENGTH(): number {
    return 8;
  }
  public static get TRANSACTION_NUMBER_MAX_LENGTH(): number {
    return 15;
  }
  public static get BANK_NAME_MAX_LENGTH(): number {
    return 50;
  }
}
