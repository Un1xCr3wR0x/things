export const commentsMockData = [
  {
    transactionType: 'Change Engagement',
    referenceNo: 274302,
    userName: {
      arabic: 'افيل',
      english: 'Afil'
    },
    role: {
      arabic: 'المدقق الأول',
      english: 'First Validator'
    },
    rejectionReason: null,
    returnReason: null,
    comments: null,
    createdDate: {
      gregorian: new Date('2020-05-28T08:58:02.000Z'),
      hijiri: '1441-10-05'
    },
    bilingualComments: null,
    transactionStepStatus: 'Submit',
    reopenReason: null
  }
];

export const workflowListMockData = [
  {
    transactionList: [
      {
        status: {
          arabic: 'بدأت',
          english: 'Approved'
        },
        approverRole: null,
        approverName: {
          arabic: null,
          english: null
        },
        date: {
          gregorian: '2021-05-21T14:00:54.000Z'
        },
        display: true
      }
    ],
    workFlowList: [
      {
        status: {
          arabic: 'بدأت',
          english: 'Completed'
        },
        approverRole: null,
        approverName: {
          arabic: null,
          english: null
        },
        date: {
          gregorian: '2021-05-21T14:00:54.000Z'
        },
        display: true
      }
    ]
  }
];
