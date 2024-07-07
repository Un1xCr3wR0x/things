export const violationDetailedBillMockData = {
  totalViolationAmountAggregate: 119930,
  violatedContributorsCountAggregate: 12,
  summary: [
    {
      violationType: {
        arabic: 'ادخال سبب استبعاد لا يتوافق مع السبب الفعلي للاستبعاد',
        english: 'Providing leave reason that does not correspond to actual reason'
      },
      violatedContributorsCount: 6,
      totalViolationAmount: 60000
    },
    {
      violationType: {
        arabic: 'عدم تسجيل الاجر الفعلي الخاضع للاشتراك',
        english: 'Failure to register the actual contributory wage of a contributor'
      },
      violatedContributorsCount: 6,
      totalViolationAmount: 59930
    }
  ],
  violatedContributorsList: [
    {
      violationType: {
        arabic: 'عدم تسجيل الاجر الفعلي الخاضع للاشتراك',
        english: 'Failure to register the actual contributory wage of a contributor'
      },
      violationId: 1000342267,
      violationDate: {
        gregorian: '2021-07-06T00:00:00.000Z',
        hijiri: '1442-11-26'
      },
      contributorInfo: {
        violationAmount: 9990,
        contributionAmount: null,
        contributorId: 910288962,
        person: {
          sin: 910288962,
          nationality: {
            arabic: 'السعودية ',
            english: 'Saudi Arabia'
          },
          name: {
            arabic: 'على معلا صالح العمرى',
            english: null
          },
          identity: [
            {
              idType: 'NIN',
              newNin: 1008175547
            }
          ]
        }
      }
    }
  ]
};
