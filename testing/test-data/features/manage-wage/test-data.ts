export const getContributorWageResponse = {
  contributorWageList: [
    {
      nationality: {
        arabic: 'السودان',
        english: 'Sudan'
      },
      identity: [
        {
          idType: 'PASSPORT',
          passportNo: 77646,
          expiryDate: null,
          issueDate: {
            gregorian: '2002-02-02T00:00:00.000Z',
            hijiri: '1422-11-19'
          }
        },
        {
          idType: 'IQAMA',
          iqamaNo: 2194234445,
          expiryDate: {
            gregorian: '2009-04-26T00:00:00.000Z',
            hijiri: '1430-05-01'
          }
        }
      ],
      name: {
        arabic: {
          firstName: 'ممدوح',
          secondName: 'ساتي',
          thirdName: 'سيد',
          familyName: 'احمد'
        },
        english: {}
      },
      socialInsuranceNo: 952732544,
      engagementId: 1538218317,
      engagementPeriod: {
        occupation: {
          arabic: 'اختصاصي في أعمال الوقاية من الحريق',
          english: 'Fire prevention specialist'
        },
        startDate: {
          gregorian: '2020-02-01T00:00:00.000Z',
          hijiri: '1441-06-07'
        },
        wage: {
          basicWage: 19000,
          housingBenefit: 10,
          commission: 10,
          otherAllowance: 10,
          totalWage: 21000,
          contributoryWage: 21000
        },
        lastUpdatedDate: {
          gregorian: '2020-02-01T00:00:00.000Z',
          hijiri: '1441-06-07'
        }
      }
    }
  ],
  totalNumberOfActiveContributors: 1,
  pageNo: 0,
  pageSize: 1
};
