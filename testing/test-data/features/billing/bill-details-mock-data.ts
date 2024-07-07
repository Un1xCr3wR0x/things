/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const billDetails = {
  adjustedCreditBalance: 10045,
  balanceDue: 12035,
  id: 1234,
  dueDate: { gregorian: new Date() },
  issueDate: { gregorian: new Date() },
  details: [
    {
      component: 'Annuity',
      contributionDetails: [
        {
          contributionAmount: 1254,
          coverageType: { english: 'Annuity', arabic: '13' },
          noOfContributor: 1
        },
        {
          contributionAmount: 1254,
          coverageType: { english: 'OH', arabic: '1232' },
          noOfContributor: 1
        },
        {
          contributionAmount: 1254,
          coverageType: { english: 'UI', arabic: '22313' },
          noOfContributor: 1
        }
      ]
    }
  ],
  summary: [
    {
      amount: 4567,
      type: {
        english: 'type',
        arabic: 'type'
      }
    }
  ],
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'جاسم',
      thirdName: 'محمد',
      familyName: 'الخميس'
    },
    english: {
      name: ''
    }
  },
  totalContribution: 1000,
  totalDebitAdjustment: 1000,
  totalCreditAdjustment: 1000,
  totalReceiptsAndCredits: 100,
  totalLateFee: 500,
  billBreakUp: {
    adjustmentBreakUp: {
      adjustmentDetails: [
        {
          type: {
            english: 'type',
            arabic: 'type'
          },
          noOfContributor: 10,
          amount: 100,
          penalty: 100,
          total: 100
        }
      ]
    },
    contributionBreakUp: {
      contributionDetails: [
        {
          contributionAmount: 100,
          productType: {
            english: 'type',
            arabic: 'type'
          },
          noOfContributor: 10,
          totalContributorsWage: 100
        }
      ],
      totalNoOfSaudi: 10,
      totalNoOfNonSaudi: 10,
      totalNoOfContributors: 10,
      totalNoOfEstablishments: 10
    },

    lateFeeBreakUp: {
      lateFeeDetails: [
        {
          productType: {
            english: 'type',
            arabic: 'type'
          },
          unPaidAmount: 100,
          lateFee: 100
        }
      ],
      totalUnpaidAmount: 1200
    },
    accountBreakUp: {
      accountDetails: [
        {
          accountReasonDescription: {
            english: 'type',
            arabic: 'type'
          },
          accountReasonCode: 1002,
          creditAmount: 100,
          transactionDate: { gregorian: new Date() }
        }
      ],
      availableCredit: 1200
    }
  },
  billNo: 125,
  creditAmountFromApplyDate: 100,
  currentBill: 155,
  paidAmount: 100,
  previousBill: 458,
  lateFee: 100,
  amountTransferredToMof: 10,
  carryForwardAmount: 20,
  installmentAmount: 30,
  previousMonthDues: 40,
  downPaymentAmount: 50,
  initialBillStartDate: { gregorian: new Date() },
  unBilledAmount: {
    rejectedOh: 455,
    violations: 520
  },
  unallocatedBalance: 100,
  noOfPaidContribution: 10,
  noOfDelayedPayments: 10,
  deductionRate: 100,
  contributoryWage: 100,
  adjustmentContributoryWage: 100,
  adjustmentContribution: 100
};
export const adjustmentDetails_s1Mock = {
  ContributorName: 'Abdul Raheem',
  Coverage: 'Half',
  FromDate: '12-09-2012',
  Nationality: 'Saudi',
  P_ADJUSTMENTTYPE: '12345',
  P_ESTACCMAPPINGID: '12345',
  SOCIALINSURANCENUMBER: 123123,
  ToDate: '12345',
  WAGE: 1234123
};
export const adjustmentDetails_s2Mock = {
  P_ADJUSTMENTTYPE: '12345',
  P_ESTACCMAPPINGID: '12345',
  SHORTNAMEARABIC: '12345',
  TotalContributors: 12345,
  Wages: 123123
};
export const adjustmentTotalMock = {
  ADJUSTMENTTYPE: 12345,
  IND: '12345',
  Others: 12345,
  P_ESTACCMAPPINGID: '12345',
  SHORTNAMEARABIC: '12345',
  TotalAnnuityContribution: 12345,
  TotalAnnuityPenalty: 12345,
  TotalContributionandPenalty: 12345,
  TotalOHContribution: 12345,
  TotalOHPenalty: 12345,
  TotalUIContribution: 12345,
  TotalUIPenalty: 12345
};
export const receiptListMock = {
  elements: [
    {
      ADJUSTEDAMOUNT: 12324,
      AMOUNTRECEIVED: 12324,
      CHEQUEMAILEDDATE: '2016-08-13T00:00:00.000Z',
      P_ESTACCMAPPINGID: '76578587',
      RECEIPTDATE: '2016-08-13T00:00:00.000Z',
      RECEIPTNUMBER: '87678687',
      REGISTRATIONNUMBER: '876876876'
    }
  ]
};
export const receiptDetailsMock = [
  {
    ADJUSTEDAMOUNT: 12324,
    AMOUNTRECEIVED: 12324,
    CHEQUEMAILEDDATE: '12345',
    P_ESTACCMAPPINGID: '12345',
    RECEIPTDATE: '12345',
    RECEIPTNUMBER: '12345',
    REGISTRATIONNUMBER: 12324
  }
];
export const debitCreditDetailsMock = {
  AMOUNTRECEIVED: 12324,
  CLOSE_CON: 12324,
  CLOSE_CON_ANN: 12345,
  CLOSE_CON_OH: 12345,
  CLOSE_CON_UI: 12345,
  CLOSE_CREDIT: 12345,
  CLOSE_PEN: 12345,
  CLOSE_PEN_ANN: 12345,
  CLOSE_PEN_OH: 12345,
  CLOSE_PEN_UI: 12345,
  CLOSING_DEBIT: 12345,
  CURRNT_ADJ: 12345,
  CURRNT_ADJPEN: 12345,
  CURRNT_ADJPEN_ALLOC: 12345,
  CURRNT_ADJPEN_ANN: 12345,
  CURRNT_ADJPEN_ANN_ALLOC: 12345,
  CURRNT_ADJPEN_OH: 12345,
  CURRNT_ADJPEN_OH_ALLOC: 12345,
  CURRNT_ADJPEN_UI: 12345,
  CURRNT_ADJPEN_UI_ALLOC: 12345,
  CURRNT_ADJ_ALLOC: 12345,
  CURRNT_ADJ_ANN: 12345,
  CURRNT_ADJ_ANN_ALLOC: 12345,
  CURRNT_ADJ_OH: 12345,
  CURRNT_ADJ_OH_ALLOC: 12345,
  CURRNT_ADJ_UI: 12345,
  CURRNT_ADJ_UI_ALLOC: 12345,
  CURRNT_CON: 12345,
  CURRNT_CON_ALLOC: 12345,
  CURRNT_CON_ANN: 12345,
  CURRNT_CON_ANN_ALLOC: 12345,
  CURRNT_CON_OH: 12345,
  CURRNT_CON_OH_ALLOC: 12345,
  CURRNT_CON_UI: 12345,
  CURRNT_CON_UI_ALLOC: 12345,
  CURRNT_PEN: 12345,
  CURRNT_PEN_ALLOC: 12345,
  CURRNT_PEN_ANN: 12345,
  CURRNT_PEN_ANN_ALLOC: 12345,
  CURRNT_PEN_OH: 12345,
  CURRNT_PEN_OH_ALLOC: 12345,
  CURRNT_PEN_UI: 12345,
  CURRNT_PEN_UI_ALLOC: 12345,
  ESTACCMAPPINGID: 12345,
  INJURY_DEDUCTION_REFUND_CREDIT: 12345,
  OPENINGBALANCECREDIT: 12345,
  OPEN_CON: 12345,
  OPEN_CON_ALLOC: 12345,
  OPEN_CON_ANN: 12345,
  OPEN_CON_ANN_ALLOC: 12345,
  OPEN_CON_OH: 12345,
  OPEN_CON_OH_ALLOC: 12345,
  OPEN_CON_UI: 12345,
  OPEN_CON_UI_ALLOC: 12345,
  OPEN_PEN: 12345,
  OPEN_PEN_ALLOC: 12345,
  OPEN_PEN_ANN: 12345,
  OPEN_PEN_ANN_ALLOC: 12345,
  OPEN_PEN_OH: 12345,
  OPEN_PEN_OH_ALLOC: 12345,
  OPEN_PEN_UI: 12345,
  OPEN_PEN_UI_ALLOC: 12345,
  P_ESTACCMAPPINGID: '12345',
  REJECTED_OH: 12345,
  TOTALNONSAUDIWORKERS: 12345,
  TOTALSAUDIANNANDUIONLY: 12345,
  TOTALSAUDISANNONLY: 12345,
  TOTALSAUDISOHONLY: 12345,
  TOTALSAUDISWAGESANNANDUIONLY: 12345,
  TOTALSAUDISWAGESANNONLY: 12345,
  TOTALSAUDISWAGESOHONLY: 12345,
  TOTALSAUDIWORKERS: 12345,
  TOTALWAGEOFNONSAUDIWORKERS: 12345,
  TOTALWAGEOFSAUDIWORKERS: 12345,
  TOTALWAGES: 12345,
  TOTALWORKER: 12345,
  TOTAL_ADJ_CREDIT: 12345,
  TOTAL_CLOSE_ANN: 12345,
  TOTAL_CLOSE_DEBIT: 12345,
  TOTAL_CLOSE_OH: 12345,
  TOTAL_CLOSE_UI: 12345,
  TOTAL_CREDIT_ADJ: 12345,
  TOTAL_CURRNT_ANN: 12345,
  TOTAL_CURRNT_DEBIT: 12345,
  TOTAL_CURRNT_OH: 12345,
  TOTAL_CURRNT_UI: 12345,
  TOTAL_FREE_PENALTY: 12345,
  TOTAL_OPEN_ANN: 12345,
  TOTAL_OPEN_DEBIT: 12345,
  TOTAL_OPEN_OH: 12345,
  TOTAL_OPEN_UI: 12345,
  TOTALRECEIPTS: 12345,
  TRANSFERCREDIT: 12345,
  TRANSFERDEBIT: 12345,
  VIOLATIONS: 12345,
  VIOLATION_DEDUCTION_REFUND_CREDIT: 12345
};

export const establishmentHeaderMock = {
  registrationNo: 123123,
  name: {
    english: 'type',
    arabic: 'type'
  },
  gccEstablishment: {
    country: {
      english: 'type',
      arabic: 'type'
    },
    gccCountry: false,
    registrationNo: '131231231'
  },
  status: {
    english: 'type',
    arabic: 'type'
  },
  gccCountry: false
};
