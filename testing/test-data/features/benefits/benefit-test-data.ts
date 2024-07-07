/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BenefitResponse } from '@gosi-ui/features/benefits/lib/shared';

export const lovMockData = {
  items: [
    {
      code: 1001,
      sequence: 1,
      value: {
        arabic: 'arabic',
        english: 'english'
      }
    },
    {
      code: 1002,
      sequence: 2,
      value: {
        arabic: 'arabic',
        english: 'english'
      }
    }
  ]
};
export const benefitRequestResposeMockData: BenefitResponse = {
  benefitRequestId: 1003224194,
  referenceNo: 664797,
  message: {
    english: 'Transaction submitted successfully',
    arabic: 'تم إرسال المعاملة بنجاح'
  }
};
export const benefitHistory = [
  {
    additionalContribution: {
      additionalContributionAmount: 0,
      additionalContributionMonths: 0,
      deductionAmount: 0,
      deductionPercent: 0,
      endDate: {
        gregorian: '2000-05-03T00:00:00.000Z',
        hijiri: '1421-01-28'
      },
      paymentAmount: 0,
      recoveryPeriodMonths: 0,
      startDate: {
        gregorian: '2000-05-03T00:00:00.000Z',
        hijiri: '1421-01-28'
      }
    },
    amount: 0,
    benefitRequestId: 0,
    benefitType: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    },
    contributorAmount: 0,
    dependentAmount: 0,
    finalAverageWage: 0,
    paidMonths: 0,
    referenceNo: 0,
    requestDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    sin: 0,
    startDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    status: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    },
    eligibleForDependentAmount: 10
  }
];
export const uiBenefits = {
  benefitGroup: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  benefitId: 0,
  benefitType: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  deathDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  eligibilityRules: [
    {
      eligible: true,
      message: {
        english: 'LC Cheque',
        arabic: 'التحقق من'
      }
    }
  ],
  eligible: true,
  endDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  failedEligibilityRules: 0,
  heirBenefitRequestReason: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  jailedPeriods: [
    {
      enteringDate: {
        gregorian: '2000-05-03T00:00:00.000Z',
        hijiri: '1421-01-28'
      },
      hasCertificate: true,
      releaseDate: {
        gregorian: '2000-05-03T00:00:00.000Z',
        hijiri: '1421-01-28'
      }
    }
  ],
  referenceNo: 0,
  requestDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  startDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  status: 'string',
  totalEligibilityRules: 0,
  warningMessages: [
    {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    }
  ]
};
export const uiHistory = [
  {
    amount: 0,
    benefitRequestId: 0,
    benefitType: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    },
    contributorAmount: 0,
    dependentAmount: 0,
    finalAverageWage: 0,
    paidMonths: 0,
    referenceNo: 0,
    requestDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    sin: 0,
    startDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    status: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    }
  }
];
export const holdBenefitData = {
  contributor: {
    age: 12123,
    dateOfBirth: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    identity: [],
    name: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    }
  },
  reason: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  requestDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  notes: 'add',
  pension: {
    annuityBenefitType: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    },
    benefitAmount: 34534,
    benefitStartDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    dependantAmount: 345345,
    finalAverageWage: 234234,
    helperAllowance: 214124123,
    injuryDate: {
      gregorian: '2000-05-03T00:00:00.000Z',
      hijiri: '1421-01-28'
    },
    injuryId: 123123,
    status: {
      english: 'LC Cheque',
      arabic: 'التحقق من'
    },
    totalBenefitAmount: 46345345
  },
  isDirectPaymentOpted: true,
  totalAdjustmentAmount: 24234,
  netPreviousAdjustmentAmount: 435345,
  netAdjustmentAmount: 100000
};
export const restartholdData = {
  eventDate: {
    gregorian: '2000-05-03T00:00:00.000Z',
    hijiri: '1421-01-28'
  },
  reason: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  }
};
export const uiData = {
  benefitType: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  },
  warningMessages: {
    english: 'LC Cheque',
    arabic: 'التحقق من'
  }
};
