import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { PayeeDetails } from '../models';

export const activeAdjustments = {
  adjustments: [
    {
      actionType: { english: 'Add', arabic: 'Add' },
      adjustmentId: 1554,
      beneficiaryId: 1234,
      createdDate: { gregorian: new Date('2021-03-31T00:00:00.000Z'), hijiri: '1442-08-18' },
      benefitType: { arabic: 'معاش تقاعد', english: 'Old Age-Normal Retirement Pension' },
      benefitRequestDate: { gregorian: new Date('2020-01-01T00:00:00.000Z'), hijiri: '1441-05-06' },
      adjustmentType: { arabic: 'دائن', english: 'Credit' },
      adjustmentAmount: 2000,
      adjustmentBalance: 2000,
      adjustmentPercentage: 0,
      adjustmentStatus: { arabic: 'نشط', english: 'Active' },
      benefitRequestStatus: { arabic: 'يصرف', english: 'Active' },
      adjustmentReason: { arabic: 'مبلغ الشراء', english: 'Buy In' },
      notes: null,
      adjustmentHistoryDetails: [
        {
          afterModification: {
            adjustmentAmount: 2000,
            adjustmentPercentage: 50,
            adjustmentReason: { arabic: 'مبلغ الشراء', english: 'Buy In' },
            adjustmentType: null,
            benefitType: null
          },
          beforeModification: {
            adjustmentAmount: 1000,
            adjustmentPercentage: 50,
            adjustmentReason: { arabic: 'مبلغ الشراء', english: 'Buy In' },
            adjustmentType: null,
            benefitType: null
          },
          modificationDate: {
            gregorian: new Date('2021-03-31T00:00:00.000Z'),
            hijiri: '1442-08-18'
          },
          notes: 'TEST',
          referenceNo: 2789
        }
      ],
      modificationDetails: null,
      cancellationDetails: null,
      payeeId: 1234
    },
    {
      actionType: { english: 'Modify', arabic: 'Modify' },
      adjustmentId: 1555,
      beneficiaryId: 1234,
      createdDate: { gregorian: new Date('2021-03-31T00:00:00.000Z'), hijiri: '1442-08-18' },
      benefitType: { arabic: 'معاش التعطل عن العمل', english: 'Saned Pension' },
      benefitRequestDate: { gregorian: new Date('2021-05-01T00:00:00.000Z'), hijiri: '1442-09-19' },
      adjustmentType: { arabic: 'مدين', english: 'Debit' },
      adjustmentAmount: 1000,
      adjustmentBalance: 1000,
      adjustmentPercentage: 30,
      adjustmentStatus: { arabic: 'نشط', english: 'Active' },
      benefitRequestStatus: { arabic: 'يصرف', english: 'Active' },
      adjustmentReason: { arabic: 'مبلغ الشراء', english: 'Buy In' },
      notes: null,
      adjustmentHistoryDetails: [
        {
          afterModification: {
            adjustmentAmount: 2000,
            adjustmentPercentage: 50,
            adjustmentReason: { arabic: 'مبلغ الشراء', english: 'Buy In' },
            adjustmentType: null,
            benefitType: null
          },
          beforeModification: {
            adjustmentAmount: 1000,
            adjustmentPercentage: 50,
            adjustmentReason: { arabic: 'مبلغ الشراء', english: 'Buy In' },
            adjustmentType: null,
            benefitType: null
          },
          modificationDate: {
            gregorian: new Date('2021-03-31T00:00:00.000Z'),
            hijiri: '1442-08-18'
          },
          notes: 'TEST',
          referenceNo: 2789
        }
      ],
      modificationDetails: null,
      cancellationDetails: null
    }
  ]
};
export const benefits = {
  beneficiaryBenefitList: [
    {
      sourceId: 1005494569,
      source: { arabic: 'Annuity', english: 'Annuity' },
      startDate: { gregorian: new Date('2020-03-01T00:00:00.000Z'), hijiri: '1441-07-06' },
      stopDate: { gregorian: new Date('2021-05-12T00:00:00.000Z'), hijiri: '1442-09-30' },
      benefitType: { arabic: 'معاش تقاعد', english: 'Old Age-Normal Retirement Pension' },
      benefitRequestStatus: { arabic: 'يصرف', english: 'Active' },
      benefitAmount: 1983.75,
      basicBenefitAmount: 1234,
      deathGrantComponentAmount: 1234,
      dependentComponentAmount: 1234,
      helperComponentAmount: 1234,
      initialBenefitAmount: 1234,
      subsequentBenefitAmount: 1234,
      totalBenefitAmount: 1234,
      deductionAmount: 1234,
      benefitAmountAfterDeduction: 1234
    },
    {
      sourceId: 47422146,
      source: { arabic: 'SANED', english: 'SANED' },
      startDate: { gregorian: new Date('2021-05-01T00:00:00.000Z'), hijiri: '1442-09-19' },
      stopDate: { gregorian: new Date('2021-05-25T00:00:00.000Z'), hijiri: '1442-10-13' },
      benefitType: { arabic: 'معاش التعطل عن العمل', english: 'Saned Pension' },
      benefitRequestStatus: { arabic: 'يصرف', english: 'Active' },
      benefitAmount: 2000,
      basicBenefitAmount: 1234,
      deathGrantComponentAmount: 1234,
      dependentComponentAmount: 1234,
      helperComponentAmount: 1234,
      initialBenefitAmount: 1234,
      subsequentBenefitAmount: 1234,
      totalBenefitAmount: 1234,
      deductionAmount: 1234,
      benefitAmountAfterDeduction: 1234
    }
  ]
};
export const adjustmentModificationById = {
  adjustments: [
    {
      adjustmentId: 1614,
      createdDate: {
        gregorian: new Date('2021-03-31T00:00:00.000Z'),
        hijiri: '1442-08-18'
      },
      benefitType: {
        arabic: 'معاش تقاعد',
        english: 'Old Age-Normal Retirement Pension'
      },
      benefitRequestDate: {
        gregorian: new Date('2020-03-01T00:00:00.000Z'),
        hijiri: '1441-07-06'
      },
      adjustmentType: {
        arabic: 'مدين',
        english: 'Debit'
      },
      adjustmentAmount: 2000,
      adjustmentBalance: 1000,
      adjustmentPercentage: 50,
      adjustmentStatus: {
        arabic: 'المدفوع',
        english: 'Paid Up'
      },
      benefitRequestStatus: {
        arabic: 'يصرف',
        english: 'Active'
      },
      adjustmentReason: {
        arabic: 'مبلغ الشراء',
        english: 'Buy In'
      },
      notes: 'This is a sample test',
      rejectionReason: '',
      adjustmentHistoryDetails: [
        {
          referenceNo: 2789,
          modificationDate: {
            gregorian: new Date('2021-03-31T00:00:00.000Z'),
            hijiri: '1442-08-18'
          },
          beforeModification: {
            adjustmentPercentage: 50,
            adjustmentAmount: 1000,
            adjustmentReason: {
              arabic: 'مبلغ الشراء',
              english: 'Buy In'
            },
            adjustmentType: new BilingualText(),
            source: new BilingualText(),
            adjustmentBalance: 10,
            createdDate: new GosiCalendar(),
            benefitType: new BilingualText(),
            benefitRequestDate: new GosiCalendar(),
            status: new BilingualText(),
            reason: new BilingualText()
          },
          afterModification: {
            adjustmentPercentage: 50,
            adjustmentAmount: 2000,
            adjustmentReason: {
              arabic: 'مبلغ الشراء',
              english: 'Buy In'
            }
          },
          notes: 'TEST'
        }
      ],
      actionType: {
        arabic: 'Cancel',
        english: 'Cancel'
      },
      benefitAmount: 1983.75,
      modificationDetails: null,
      cancellationDetails: {
        rejectionReason: 'sss',
        notes: 'ssss'
      }
    },
    {
      adjustmentId: 1615,
      createdDate: {
        gregorian: new Date('2021-03-31T00:00:00.000Z'),
        hijiri: '1442-08-18'
      },
      benefitType: {
        arabic: 'معاش التعطل عن العمل',
        english: 'Saned Pension'
      },
      benefitRequestDate: {
        gregorian: new Date('2021-05-01T00:00:00.000Z'),
        hijiri: '1442-09-19'
      },
      adjustmentType: {
        arabic: 'دائن',
        english: 'Credit'
      },
      adjustmentAmount: 1000,
      adjustmentBalance: 1000,
      adjustmentPercentage: 0,
      adjustmentStatus: {
        arabic: 'المدفوع',
        english: 'Paid Up'
      },
      benefitRequestStatus: {
        arabic: 'يصرف',
        english: 'Active'
      },
      adjustmentReason: {
        arabic: 'مبلغ الشراء',
        english: 'Buy In'
      },
      notes: 'This is a sample test',
      adjustmentHistoryDetails: [
        {
          referenceNo: 2788,
          modificationDate: {
            gregorian: new Date('2021-05-26T00:00:00.000Z'),
            hijiri: '1442-10-14'
          },
          beforeModification: {
            adjustmentPercentage: 0,
            adjustmentAmount: 1000,
            adjustmentReason: {
              arabic: 'مبلغ الشراء',
              english: 'Buy In'
            },
            adjustmentType: new BilingualText(),
            source: new BilingualText(),
            adjustmentBalance: 10,
            createdDate: new GosiCalendar(),
            benefitType: new BilingualText(),
            benefitRequestDate: new GosiCalendar(),
            status: new BilingualText(),
            reason: new BilingualText()
          },
          afterModification: {
            adjustmentPercentage: 0,
            adjustmentAmount: 2000,
            adjustmentReason: {
              arabic: 'مبلغ الشراء',
              english: 'Buy In'
            },
            adjustmentType: new BilingualText(),
            source: new BilingualText(),
            adjustmentBalance: 10,
            createdDate: new GosiCalendar(),
            benefitType: new BilingualText(),
            benefitRequestDate: new GosiCalendar(),
            status: new BilingualText(),
            reason: new BilingualText()
          },
          notes: 'TEST1'
        }
      ],
      actionType: {
        arabic: 'Modify',
        english: 'Modify'
      },
      benefitAmount: 2000,
      modificationDetails: {
        beforeModification: {
          adjustmentPercentage: 0,
          adjustmentAmount: 1000,
          adjustmentReason: {
            arabic: 'مبلغ الشراء',
            english: 'Buy In'
          },
          adjustmentType: new BilingualText(),
          source: new BilingualText(),
          adjustmentBalance: 10,
          createdDate: new GosiCalendar(),
          benefitType: new BilingualText(),
          benefitRequestDate: new GosiCalendar(),
          status: new BilingualText(),
          reason: new BilingualText()
        },
        afterModification: {
          adjustmentAmount: 100000,
          adjustmentPercentage: 0,
          adjustmentReason: {
            arabic: 'مبلغ الشراء',
            english: 'Buy In'
          },
          adjustmentType: new BilingualText(),
          source: new BilingualText(),
          adjustmentBalance: 10,
          createdDate: new GosiCalendar(),
          benefitType: new BilingualText(),
          benefitRequestDate: new GosiCalendar(),
          status: new BilingualText(),
          reason: new BilingualText()
        },
        notes: 'saasas sas'
      },
      cancellationDetails: null
    },
    {
      adjustmentId: null,
      createdDate: null,
      benefitType: {
        arabic: 'معاش تقاعد',
        english: 'Old Age-Normal Retirement Pension'
      },
      benefitRequestDate: {
        gregorian: new Date('2020-03-01T00:00:00.000Z'),
        hijiri: '1441-07-06'
      },
      adjustmentType: {
        arabic: 'مدين',
        english: 'Debit'
      },
      adjustmentAmount: 1000,
      adjustmentBalance: 1000,
      adjustmentPercentage: 50,
      adjustmentStatus: {
        arabic: 'مسترد',
        english: 'Recovered'
      },
      benefitRequestStatus: {
        arabic: 'يصرف',
        english: 'Active'
      },
      adjustmentReason: {
        arabic: 'مبلغ الشراء',
        english: 'Buy In'
      },
      notes: 'ssss',
      adjustmentHistoryDetails: null,
      actionType: {
        arabic: 'Recovery',
        english: 'Recovery'
      },
      benefitAmount: 1983.75,
      modificationDetails: null,
      cancellationDetails: null
    },
    {
      adjustmentId: null,
      createdDate: null,
      benefitType: {
        arabic: 'معاش التعطل عن العمل',
        english: 'Saned Pension'
      },
      benefitRequestDate: {
        gregorian: new Date('2021-05-01T00:00:00.000Z'),
        hijiri: '1442-09-19'
      },
      adjustmentType: {
        arabic: 'دائن',
        english: 'Credit'
      },
      adjustmentAmount: 55500000,
      adjustmentBalance: 55500000,
      adjustmentPercentage: 0,
      adjustmentStatus: {
        arabic: 'جديد',
        english: 'New'
      },
      benefitRequestStatus: {
        arabic: 'يصرف',
        english: 'Active'
      },
      adjustmentReason: {
        arabic: 'مبلغ الشراء',
        english: 'Buy In'
      },
      notes: 'sasa',
      adjustmentHistoryDetails: null,
      actionType: {
        arabic: 'Add',
        english: 'Add'
      },
      benefitAmount: 2000,
      modificationDetails: null,
      cancellationDetails: null
    }
  ],
  person: {
    identity: [
      {
        idType: 'NIN',
        newNin: 1103516876
      }
    ],
    birthDate: {
      gregorian: new Date('1950-05-01T00:00:00.000Z'),
      hijiri: '1369-07-13'
    },
    name: {
      arabic: 'احمد صمع احمدالجمعان',
      english: 'Ahmed Samaa Ahmed Aljamaan'
    },
    age: 71,
    nameBilingual: {
      arabic: 'احمد صمع احمد الجمعان',
      english: 'Ahmed Samaa Ahmed Aljamaan'
    }
  }
};
export const payeeDetails: PayeeDetails[] = [
  {
    payeeName: { arabic: 'الجمعان', english: 'Annuity' },
    payeeCode: '11',
    payeeId: 100,
    payeeType: { arabic: 'geg', english: 'Anthyrthnuity' },
    crn: 'hhh',
    nationalId: 10000232,
    iban: '44',
    iqama: null,
    nin: null
  },
  {
    payeeName: { arabic: 'harvest', english: 'Anthyrthnuity' },
    payeeCode: '22',
    payeeId: 101,
    payeeType: { arabic: 'rrerw', english: 'Anthyrthnuity' },
    nationalId: null,
    crn: 'sdgdjfhfkygl',
    iban: '6879789',
    iqama: 132,
    nin: null
  },
  {
    payeeName: { arabic: 'billing', english: 'Anthyrthnuity' },
    payeeCode: '33',
    payeeId: 102,
    nationalId: 10000236,
    payeeType: { arabic: 'gdghh', english: 'Anthyrthnuity' },
    crn: 'sdgdjfhfkygl',
    iban: '1010',
    iqama: null,
    nin: null
  }
];
export const eligibilityMockData = {
  eligibility: {
    eligible: true,
    key: 'isActive',

    messages: {
      details: [
        {
          english: 'in workflow',
          arabic: 'in workflow arabic'
        },
        {
          english: 'in workflow 2',
          arabic: 'in workflow arabic2'
        },
        {
          english: 'in workflow 3',
          arabic: 'in workflow arabic3'
        }
      ],
      message: {
        english: 'nothing english',
        arabic: 'nothing arabic'
      }
    }
  }
};
