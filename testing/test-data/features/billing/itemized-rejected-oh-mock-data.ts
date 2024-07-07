export const itemizedRejectedOHMockData = {
  rejectedInjuryCount: 1,
  amount: 195,
  cases: [
    {
      personId: {
        personIdentifier: 3497453641,
        idType: 'Border No',
        nationality: {
          arabic: 'اليمن',
          english: 'Yemen'
        }
      },
      name: {
        arabic: {
          firstName: 'معمر',
          secondName: 'عبد الحافظ',
          thirdName: 'علي',
          familyName: 'عبد الودود'
        },
        english: {}
      },
      type: {
        arabic: 'الإصابة',
        english: 'Injury'
      },
      caseNumber: 1001922584,
      rejectionDate: {
        gregorian: '2019-11-04T00:00:00.000Z',
        hijiri: '1441-03-07'
      },
      rejectionReason: {
        arabic: 'الاصابة  لعدم تجاوب صاحب العمل خلال 10 أيام',
        english: 'Injury pending action by employer for more than 10 days'
      },
      expenses: [
        {
          id: null,
          amount: 195,
          type: {
            arabic: 'بدل النقل للمرافق',
            english: 'Companion Conveyance Allowance'
          },
          startDate: null,
          endDate: null
        }
      ]
    }
  ]
};
export const itemizedInstallmentMockData = {
  currentInstallmentAmount: 2014.22,
  previouslyPaidAmount: 2014.22,
  remainingInstallmentAmount: 34241.78,
  totalInstallmentAmount: 36256
};
