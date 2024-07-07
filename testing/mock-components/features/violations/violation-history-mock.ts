export const violationHistoryListData = {
  violationSummaryDtoList: [
    {
      violationType: {
        english: 'incorect-termination',
        arabic: ''
      },
      status: {
        english: 'incorect-termination',
        arabic: ''
      },
      channel: {
        english: 'Rased',
        arabic: ''
      },
      dateReported: {
        gregorian: new Date('2020-07-24T08:23:53.000Z'),
        hijiri: '1441-12-03'
      },
      paidAmount: 10000,
      penaltyAmount: 123123,
      transactionId: 12312,
      violationId: 12312312
    }
  ],
  estViolationsCount: 2341
};

export const violationFilterMock = {
  violationType: [
    {
      english: 'incorect-termination',
      arabic: ''
    },
    {
      english: 'incorrect-wage',
      arabic: ''
    }
  ],
  period: {
    endDate: '12/02/2021',
    startDate: '12/06/2022'
  },
  status: [
    {
      english: 'incorect-termination',
      arabic: ''
    },
    {
      english: 'incorrect-wage',
      arabic: ''
    }
  ],
  channel: [
    {
      english: 'Rased',
      arabic: ''
    }
  ]
};
export const filterHistoryData = {
  filter: violationFilterMock,
  page: {
    pageNo: 0,
    size: 10,
    fromJsonToObject: () => {
      return undefined;
    }
  },
  searchKey: '10245236',
  sort: {
    column: 'transactionId',
    direction: 'DESC'
  },
  fromJsonToObject: () => {
    return undefined;
  }
};
