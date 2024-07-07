/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const billHistoryMockData = {
  bills: [
    {
      billNumber: 177,
      issueDate: {
        gregorian: new Date('2019-04-01'),
        hijiri: ''
      },
      details: [
        {
          amount: 500,
          type: {
            english: 'Settled',
            arabic: 'تم تسويته'
          }
        },
        {
          amount: 1500,
          type: {
            english: 'Contribution',
            arabic: 'الاشتراكات'
          }
        },
        {
          amount: 2000,
          type: {
            english: 'Violations',
            arabic: 'المخالفات'
          }
        },
        {
          amount: 900,
          type: {
            english: 'Penalty',
            arabic: ''
          }
        },
        {
          amount: 1300,
          type: {
            english: 'Rejected OH Claims',
            arabic: 'إصابات العمل المرفوضة'
          }
        }
      ]
    },
    {
      billNumber: 177,
      issueDate: {
        gregorian: new Date('2019-05-01'),
        hijiri: ''
      },
      details: [
        {
          amount: 1500,
          type: {
            english: 'Settled',
            arabic: 'تم تسويته'
          }
        },
        {
          amount: 0,
          type: {
            english: 'Contribution',
            arabic: 'الاشتراكات'
          }
        },
        {
          amount: 3000,
          type: {
            english: 'Violations',
            arabic: 'المخالفات'
          }
        },
        {
          amount: 700,
          type: {
            english: 'Penalty',
            arabic: ''
          }
        },
        {
          amount: 1600,
          type: {
            english: 'Rejected OH Claims',
            arabic: 'إصابات العمل المرفوضة'
          }
        }
      ]
    }
  ],
  firstBillIssueDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  lastBillIssueDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  }
};
export const changeEngagementDetails = {
  changeRequest: [
    {
      changeType: [
        {
          changeType: {
            english: 'Wage Change',
            arabic: ' '
          },
          endDate: {
            gregorian: new Date('2019-04-01'),
            hijiri: ''
          },
          newContributoryWage: 1000,
          newOHPercentage: 2,
          oldContributoryWage: 500,
          oldOHPercentage: 5,
          startDate: {
            gregorian: new Date('2019-04-01'),
            hijiri: ''
          },
          transactionDate: {
            gregorian: new Date('2019-04-01'),
            hijiri: ''
          }
        }
      ],
      person: {
        name: {
          arabic: {
            firstName: 'شاورين',
            familyName: 'راتاناش'
          },
          english: {}
        },
        identity: {
          idType: 'PASSPORT',
          passportNo: 70045,
          expiryDate: null,
          issueDate: null
        },
        nationality: {
          arabic: 'تايلند ',
          english: 'Thailand'
        }
      }
    }
  ],
  noOfRecords: 3,
  total: 450
};
export const getBillHistoryVicSearchFilterMockData = {
  bills: [
    {
      billNumber: 177,
      issueDate: {
        gregorian: new Date('2019-04-01'),
        hijiri: ''
      },
      details: [
        {
          amount: 500,
          type: {
            english: 'Settled',
            arabic: 'تم تسويته'
          }
        },
        {
          amount: 1500,
          type: {
            english: 'Contribution',
            arabic: 'الاشتراكات'
          }
        },
        {
          amount: 2000,
          type: {
            english: 'Violations',
            arabic: 'المخالفات'
          }
        },
        {
          amount: 900,
          type: {
            english: 'Penalty',
            arabic: ''
          }
        },
        {
          amount: 1300,
          type: {
            english: 'Rejected OH Claims',
            arabic: 'إصابات العمل المرفوضة'
          }
        }
      ]
    }
  ],
  firstBillIssueDate: {
    gregorian: new Date('2019-04-01'),
    hijiri: ''
  },
  firstBillIssueMonth: {
    english: '',
    arabic: ''
  },
  fullyPaidMonth: null,
  noOfMonthsSinceLastPaid: 1241,
  totalNoOfRecords: 2514,
  contributorName: {
    english: '',
    arabic: ''
  },
  installmentIndicator: {
    english: '',
    arabic: ''
  },
  minimumPaymentRequired: 10
};
