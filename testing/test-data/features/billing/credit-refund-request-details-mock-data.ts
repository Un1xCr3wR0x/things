/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const creditRefundRequestDetailsMockData = {
  comments: 'frrrr',
  amount: 5555,
  iban: 'sder14578855555',
  uuid: 'sew4fgtry6765-vgh-89',
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
export const creditRefundDetailsTest = {
  requestedAmount: 12345,
  approvedAmount: 12345,
  registrationNo: 10000602,
  creditAccountDetail: {
    accountNumber: '123456',
    totalCreditBalance: 123456,
    retainedBalance: 123456,
    transferableBalance: 123456,
    totalDebitBalance: 123456
  },
  paymentMode: {
    english: 'Cash',
    arabic: ''
  },

  iban: 'sder14578855555',
  name: {
    english: 'Abdul',
    arabic: ''
  },
  status: {
    english: 'Paid',
    arabic: ''
  },
  currentAccountDetail: {
    accountNumber: '123456',
    totalCreditBalance: 123456,
    retainedBalance: 123456,
    transferableBalance: 123456,
    totalDebitBalance: 123456
  },
  creditRetainIndicator: {
    english: 'done',
    arabic: ''
  },
  fromJsonToObject: () => {
    return undefined;
  }
};
export const routerTestdata = {
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'Doctor',

  resourceType: 'Close Injury TPA',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
