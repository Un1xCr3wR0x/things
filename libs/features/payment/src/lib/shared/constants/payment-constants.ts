/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PaymentConstants {
  public static get PAYMENT_DETAILS(): string {
    return 'PAYMENT.PAYMENT-DETAILS-TAB';
  }
  public static get DOCUMENTS(): string {
    return 'PAYMENT.DOCUMENTS';
  }
  public static get MISCELLANEOUS_PAYMENT(): string {
    return 'Miscellaneous Payment';
  }
  public static get APPROVE_ADJUSTMENT_REPAYMENT(): string {
    return 'home/adjustment/validator/approve-adjustment-repayment';
  }
  // route to payonline screen
  public static get ROUTE_PAY_ONLINE(): string {
    return 'home/payment/payonline';
  }
  // route to payonline screen
  public static get ROUTE_PAYONLINE_SEARCH(): string {
    return '/home/payment/payonline/search';
  }
  public static get PATCH_BANK_ID(): string {
    return 'BANK';
  }

  // route to validator screen
  public static get ROUTE_PAY_ONLINE_VALIDATOR(): string {
    return 'home/payment/payonlinevalidator';
  }
  public static get ROUTE_VALIDATOR(): string {
    return `home/payment/validator/pay-online`;
  }
}
