/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const creditRefundDetailsMockData = {
  paymentMode: {
    english: 'Cheque',
    arabic: ''
  },
  amount: 5555,
  iban: 'sder14578855555',
  creditAccountDetail: {
    accountNumber: '124500',
    retainedBalance: 12345,
    totalCreditBalance: 1234567,
    totalDebitBalance: 12345687,
    transferableBalance: 12134567
  },
  currentAccountDetail: {
    accountNumber: '123456',
    retainedBalance: 3252,
    totalCreditBalance: 42541,
    totalDebitBalance: 45142,
    transferableBalance: 45135
  },
  fromJsonToObject: () => {
    return undefined;
  }
};
