import { of } from 'rxjs';

export class MedicalBoardServiceStub {
  getTransactions() {
    return of(boardMembersListMock);
  }
}
export const SessionCalendarMock = {
  participantsInQueue: 123,
  sessionDetails: [
    {
      count: 12,
      date: { gregorian: null, hijiri: '1442-08-25' },
      dateString: '2012-12-11',
      isSlotsAvailable: true,
      sessionId: 123
    }
  ]
};
export const terminateContractMock = {
  contractId: 123123,
  dateOfTermination: { gregorian: new Date('1994-06-10T00:00:00.000Z'), hijiri: '1415-01-01' },
  reasonForTermination: {
    arabic: 'حسين على حسين الشرباتى',
    english: 'Holiday'
  },
  transactionTraceId: 34534,
  comments: 'added'
};
export const contractMock = {
  mbProfessionalId: 1213,
  contractId: 1213,
  transactionTraceId: 1213,
  contractType: {
    arabic: 'طبيب متعاقد',
    english: 'Contracted Doctor'
  },
  specialty: {
    arabic: 'طبيب متعاقد',
    english: 'Contracted Doctor'
  },
  subSpecialty: [
    {
      arabic: 'طبيب متعاقد',
      english: 'Contracted Doctor'
    }
  ],
  medicalBoardType: undefined,
  region: [
    {
      arabic: 'طبيب متعاقد',
      english: 'Contracted Doctor'
    }
  ],
  hospital: {
    arabic: 'طبيب متعاقد',
    english: 'Contracted Doctor'
  },
  fees: 1213,
  feesPerVisit: {
    arabic: 'طبيب متعاقد',
    english: 'Contracted Doctor'
  },
  status: {
    arabic: 'طبيب متعاقد',
    english: 'Contracted Doctor'
  },
  startDate: { gregorian: new Date('1994-06-10T00:00:00.000Z'), hijiri: '1415-01-01' },
  endDate: { gregorian: new Date('1994-06-10T00:00:00.000Z'), hijiri: '1415-01-01' },
  commentsDto: {
    comments: 'added'
  }
};
export const boardMembersListMock = {
  mbList: [
    {
      identity: 2015767656,
      mobileNo: '745756745',
      name: {
        arabic: 'حسين على حسين الشرباتى',
        english: 'Contracted Doctor'
      },
      contractType: {
        arabic: 'طبيب متعاقد',
        english: 'Contracted Doctor'
      },
      specialty: {
        arabic: 'التخدير',
        english: 'Anesthesia'
      },
      region: [
        {
          arabic: 'الكويت',
          english: 'Region Kuwait'
        }
      ],
      status: {
        arabic: 'معتمد',
        english: 'Active'
      },
      timestamp: '2021-03-09T14:37:42.573+03:00'
    },
    {
      identity: 2015767656,
      mobileNo: '785478956',
      name: {
        arabic: 'حسين على حسين الشرباتى',
        english: 'Docter'
      },
      contractType: {
        arabic: 'طبيب متعاقد',
        english: 'Nurse'
      },
      specialty: {
        arabic: 'التخدير',
        english: 'Anesthesia'
      },
      region: [
        {
          arabic: 'الكويت',
          english: 'Kuwait'
        }
      ],
      status: {
        arabic: 'معتمد',
        english: 'Active'
      },
      timestamp: '2021-03-09T14:37:42.573+03:00'
    },
    {
      identity: 2647282546,
      mobileNo: '343453777',
      name: {
        arabic: 'على شيخ على العولقي',
        english: 'name'
      },
      contractType: {
        arabic: 'طبيب متعاقد',
        english: 'Contracted Doctor'
      },
      region: [],
      status: {
        arabic: 'معتمد',
        english: 'Active'
      },
      timestamp: '2021-03-09T15:10:51.842+03:00'
    },
    {
      identity: 2063508788,
      mobileNo: '345452353',
      name: {
        arabic: 'على شيخ على العولقي',
        english: 'name'
      },
      contractType: {
        arabic: 'طبيب متعاقد',
        english: 'Contracted Doctor'
      },
      region: [],
      status: {
        arabic: 'معتمد',
        english: 'Active'
      },
      timestamp: '2021-03-16T07:20:44.581+03:00'
    }
  ],
  totalNoOfRecords: 30
};
