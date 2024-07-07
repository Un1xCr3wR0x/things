/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const chequeFormData = {
  description: 'okey',
  transactionDate: {
    gregorian: '2019-12-24',
    hijri: ''
  },
  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: 'sdfg',
    type: 'saudi'
  },
  chequeDate: {
    gregorian: '2019-12-24',
    hijri: ''
  },
  chequeNumber: 12345,
  amountReceived: {
    amount: '78900',
    currency: 'SAR'
  },
  gccAmountReceived: '78900'
};
export const eventFormData = {
  countryName: 'KWD',
  transactionDate: '2021-03-07'
};
export const otherFormData = {
  description: 'okey',
  transactionDate: { gregorian: '2019-12-24', hijri: '' },
  referenceNo: 123456889,

  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: 'sdfg',
    type: 'saudi'
  },
  amountReceived: {
    amount: '78900',
    currency: 'SAR'
  },
  gccAmountReceived: '78900'
};

export const receiptModeFormData = {
  receiptMode: {
    english: 'Personnel Cheque',
    arabic: ''
  }
};

export const branchBreakupFormData = [
  {
    registrationNo: 357900,
    establishmentType: {
      english: 'Main',
      arabic: ''
    },
    allocatedAmount: {
      amount: '78900',
      currency: 'SAR'
    }
  },
  {
    registrationNo: 502351249,
    establishmentType: {
      english: 'Branch',
      arabic: ''
    },
    allocatedAmount: {
      amount: '',
      currency: 'SAR'
    }
  }
];

export const commentFormData = {
  comments: ''
};

export const chequeErrorFormData = {
  description: 'okey',
  transactionDate: {
    gregorian: '2019-12-20',
    hijri: ''
  },
  bank: {
    name: {
      arabic: 'الرياض',
      english: 'RIBL'
    },
    nonListedBank: 'sdfg',
    type: 'saudi'
  },
  chequeDate: {
    gregorian: '2019-12-24',
    hijri: ''
  },
  chequeNumber: 12345,
  amountReceived: {
    amount: '78900',
    currency: 'SAR'
  },
  gccAmountReceived: 0
};

export const receiptModeVoucher = {
  receiptMode: {
    english: 'SAMA Voucher',
    arabic: ''
  }
};

export const receiptModeCash = {
  receiptMode: {
    english: 'Cash Deposit',
    arabic: ''
  }
};

export const branchBreakupErrorFormData = [
  {
    registrationNo: 357900,
    establishmentType: {
      english: 'Main',
      arabic: ''
    },
    allocatedAmount: {
      amount: '7890',
      currency: 'SAR'
    }
  },
  {
    registrationNo: 502351249,
    establishmentType: {
      english: 'Branch',
      arabic: ''
    },
    allocatedAmount: {
      amount: null,
      currency: 'SAR'
    }
  }
];

export const branchBreakupTempFormData = [
  {
    registrationNo: 357900,
    establishmentType: {
      english: 'Main',
      arabic: ''
    },
    allocatedAmount: {
      amount: '78900',
      currency: 'SAR'
    }
  },
  {
    registrationNo: 200085744,
    establishmentType: {
      english: 'Branch',
      arabic: ''
    },
    allocatedAmount: {
      amount: '0',
      currency: 'SAR'
    }
  }
];
