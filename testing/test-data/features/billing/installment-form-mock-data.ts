/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export const guaranteeBankingModeFormData = {
  category: {
    arabic: 'الرياض',
    english: 'Bank Guarantee'
  }
};
export const guaranteePromissoryModeFormData = {
  category: {
    arabic: 'الرياض',
    english: 'Promissory Note'
  }
};
export const guaranteeOtherModeFormData = {
  category: {
    arabic: 'الرياض',
    english: 'Other'
  }
};
/**
 * Method to create  form
 */
export const bankGuaranteeFormData = {
  guaranteeName: {
    arabic: 'الرياض',
    english: 'RIBL'
  },
  guarantorId: 12345,
  startDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  endDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  guaranteeAmount: 1000
};
/**
 * Method to create  form
 */
export const promissoryGuaranteeFormData = {
  guaranteeName: {
    arabic: 'الرياض',
    english: 'RIBL'
  },
  guarantorId: 123458666,
  startDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  endDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  guaranteeAmount: 1000
};
/**
 * Method to create  form
 */
export const othersGuaranteeFormData = {
  guaranteeType: {
    arabic: 'الرياض',
    english: 'Establishment owner is on a job'
  }
};
export const pensionGuaranteeForm = {
  name: {
    arabic: 'الرياض',
    english: 'RIBL'
  },
  guarantorId: 12536,

  amount: 100,
  installmentAmount: 1000
};
export const otherGuaranteeFormData = {
  amount: 100,
  installmentAmount: 1000
};
export const commentFormTesTData = {
  comments: 'commnet'
};
