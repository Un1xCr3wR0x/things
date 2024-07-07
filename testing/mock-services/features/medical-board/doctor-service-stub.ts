import { IdentityTypeEnum } from '@gosi-ui/core';
import { of } from 'rxjs';
import { contractMock, terminateContractMock } from './medical-board-service-stub';

export class DoctorServiceStub {
  getPersonDetails() {
    return of(personDetailsMock);
  }
  contractDetails;
  getContractDetails() {
    return of(contractsDetails);
  }
  getMemberDetails() {
    return of(memberDetailsResponseMock);
  }
  getSessionDetails() {
    return of(sessionDataMock);
  }
  saveDoctorDetail() {
    return of(updateDoctorMock);
  }
  getUnavailablePeriod() {
    return of(updateDoctorMockArray);
  }
  removeUnavailablePeriod() {
    return of(deleteUnavaialbleMock);
  }
  revertTransactionDetails() {
    return of(true);
  }
  SubmitTerminateContract() {
    return of(terminateContractMock);
  }
  saveContactDetails() {
    return of(mbProfileMock);
  }
  submitModifyContractDetail() {
    return of(contractMock);
  }
  getmbProfessionalId() {
    return of(12345);
  }
  setmbProfessionalId() {}
  saveAddressDetails() {
    return of(mbProfileMock);
  }
  saveBankDetails() {
    return of(mbProfileMock);
  }
  getInvitationDetails() {
    return of(sessionDataMock);
  }
  acceptInvitation() {
    return of(messageMock);
  }
  addUnavailablePeriod() {
    return of(unavailablePeriodMock);
  }
  modifyUnavailablePeriod() {
    return of(unavailablePeriodMock);
  }
  getFees() {
    return of(memberDataMock);
  }
  modifyDoctorDetail() {
    return of(unAvailabilityPeriodMock);
  }
  terminateContract() {
    return of(terminationMock);
  }
  getContractHistory() {
    return of(memberDetailsMock);
  }
  submitTerminateContract() {
    return of(respContractMock);
  }
}

export const memberDataMock = {
  personId: 1234,
  registrationNo: 1234,
  mbProfessionalId: 1234,
  contractId: 1234,
  transactionTraceId: 1234,
  birthDate: null,
  name: null,
  nationality: null,
  identity: [
    {
      idType: IdentityTypeEnum.PASSPORT,
      passportNo: 'A18803474',
      issueDate: {
        gregorian: new Date('2016-08-13T00:00:00.000Z'),
        hijiri: '1437-11-10'
      },
      expiryDate: undefined
    }
  ],
  sex: null,
  contactDetail: null,
  personType: null,
  bankAccount: {
    bankAccountList: [
      {
        approvalStatus: null,
        bankAddress: null,
        bankCode: null,
        bankName: {
          arabic: 'الكويت',
          english: 'Riyadh'
        },
        comments: null,
        ibanBankAccountNo: '12345566',
        isNonSaudiIBAN: true,
        referenceNo: null,
        serviceType: null,
        status: null,
        swiftCode: null,
        verificationStatus: 'Success'
      }
    ]
  },
  contractType: { english: 'ghe', arabic: 'زيارة الطبيب' },
  hospital: null,
  medicalBoardType: { english: 'ghe', arabic: 'زيارة الطبيب' },
  specialty: null,
  subSpecialty: null,
  feesPerVisit: null,
  fees: null,
  region: null,
  govtEmp: null,
  status: null,
  scanDocuments: null,
  commentsDto: null,
  isReturn: null
};
export const updateRequestMock = {
  closingStatus: null,
  action: 'string',

  taskId: 'string',
  outcome: 'UPDATE',
  comments: 'string',
  registrationNo: 'string',
  rejectionReason: null,
  selectedInspection: null,
  returnReason: null,
  statu: 'string',
  user: 'string',
  route: 'string',
  referenceNo: 'string',
  resourceType: 'string',
  requiredDocumentsList: null,
  rejectionIndicator: false,
  workflowType: 'string',

  constructor() {}
};
export const unavailablePeriodMock = {
  calendarId: 1000000148,
  comments: null,
  endDate: { gregorian: '2021-04-07T00:00:00.000Z', hijiri: '1442-08-25' },
  reason: 'teee',
  startDate: { gregorian: '2021-04-01T00:00:00.000Z', hijiri: '1442-08-19' }
};
export const terminationMock = {
  contractId: 12,
  dateOfTermination: null,
  reasonForTermination: { arabic: 'تم حذف الفترة بنجاح ', english: 'Unavailable  successfully' },
  comments: 'string'
};
export const unAvailabilityPeriodMock = {
  calendarId: 1000000148,
  professionalId: 1234,
  comments: null,
  endDate: { gregorian: null, hijiri: '1442-08-25' },
  reason: { arabic: 'تم حذف الفترة بنجاح ', english: 'Unavailable  successfully' },
  startDate: { gregorian: null, hijiri: '1442-08-19' },
  confirmMessage: null
};
export const updateDoctorResponseMock = {
  contractId: 32412123,

  message: { english: 'added', arabic: 'احمد' },
  transactionTraceId: 123123123
};
export const mbProfileMock = {
  nationality: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  identity: [{ idType: 'NIN', newNin: 1008866509 }],
  name: {
    arabic: { firstName: 'احمد', secondName: 'صمع', thirdName: 'احمد', familyName: 'الجمعان' },
    english: { name: 'Ahmed Samaa Ahmed Aljamaan' }
  },
  sex: { arabic: 'ذكر', english: 'Male' },
  birthDate: { gregorian: '2021-03-01T00:00:00.000Z', hijiri: '1442-07-17' },
  maritalStatus: { arabic: 'متزوج', english: 'Married' },
  contactDetail: { addresses: null },
  prisoner: null,
  student: null,
  proactive: null,
  bankAccount: {
    ibanBankAccountNo: 'SA7255043SG66083110DS519',
    bankName: 'Banque Saudi Fransi'
  },
  personId: 1234,
  contracts: [
    {
      mbProfessionalId: 123,
      contractId: 123,
      transactionTraceId: 123,
      contractType: { arabic: 'ذكر', english: 'abc' },
      specialty: { arabic: 'ذكر', english: 'xyz' },
      subSpecialty: [{ arabic: 'ذكر', english: 'abc' }],
      medicalBoardType: '',
      region: [{ arabic: 'ذكر', english: 'region' }],
      hospital: { arabic: 'ذكر', english: 'hospital' },
      fees: 1200,
      feesPerVisit: { arabic: '200', english: '200' },
      status: { arabic: 'ذكر', english: 'active' },
      startDate: { gregorian: '2021-03-01T00:00:00.000Z', hijiri: '1442-07-17' },
      endDate: { gregorian: '2021-03-01T00:00:00.000Z', hijiri: '1442-07-17' },
      resourceType: 'string',
      terminateReason: { arabic: 'ذكر', english: 'reason' },
      commentsDto: {
        comments: ''
      }
    }
  ]
};
export const deleteUnavaialbleMock = {
  confirmMessage: { arabic: 'تم حذف الفترة بنجاح ', english: 'Unavailable  successfully' },
  id: null
};
export const updateDoctorMockArray = [
  {
    contractId: 145,
    message: {
      arabic: 'الاردن',
      english: 'Jordan'
    },
    transactionTraceId: 1234
  }
];
export const updateDoctorMock = {
  contractId: 145,
  message: {
    arabic: 'الاردن',
    english: 'Jordan'
  },
  transactionTraceId: 1234
};

export const memberDetailsMock = [
  {
    status: null,
    contractType: null,
    endDate: { gregorian: '2021-05-31T00:00:00.000Z', hijiri: '1442-10-19' },
    startDate: { gregorian: '2021-05-31T00:00:00.000Z', hijiri: '1442-10-19' }
  }
];
export const memberDetailsResponseMock = [
  {
    calendarId: 1000000148,
    professionalId: 1234,
    comments: null,
    endDate: { gregorian: null, hijiri: '1442-08-25' },
    reason: { arabic: 'تم حذف الفترة بنجاح ', english: 'Unavailable  successfully' },
    startDate: { gregorian: null, hijiri: '1442-08-19' },
    confirmMessage: null
  }
];
export const contractsDetails = {
  mbProfessionalId: 1000000084,
  contractId: 1000000396,
  contractType: {
    arabic: 'طبيب متعاون',
    english: 'Visiting Doctor'
  },
  specialty: {
    arabic: 'التخدير',
    english: 'Anesthesia'
  },
  subSpecialty: null,
  medicalBoardType: null,
  region: null,
  hospital: {
    arabic: 'حجيلان الطبى/مستوصف',
    english: 'حجيلان الطبى/مستوصف'
  },
  fees: null,
  feesPerVisit: {
    arabic: 1000,
    english: 1000
  },
  status: {
    arabic: 'معتمد',
    english: 'Active'
  },
  startDate: {
    gregorian: new Date('2021-03-16T07:22:42.000Z'),
    hijiri: '1442-08-03'
  },
  endDate: null
};
export const contractHistoryMock = {
  endDate: { gregorian: '2021-05-31T00:00:00.000Z', hijiri: '1442-10-19' },
  startDate: { gregorian: '2021-05-31T00:00:00.000Z', hijiri: '1442-10-19' },
  status: {
    arabic: 'الاردن',
    english: 'success'
  }
};

export const personDetailsMock = {
  nationality: {
    arabic: 'الاردن',
    english: 'Jordan'
  },
  identity: [
    {
      idType: 'PASSPORT',
      passportNo: '266609',
      expiryDate: null,
      issueDate: null
    },
    {
      idType: 'IQAMA',
      iqamaNo: 2015767656,
      expiryDate: null
    }
  ],
  name: {
    arabic: {
      firstName: 'حسين',
      secondName: 'على',
      thirdName: 'حسين',
      familyName: 'الشرباتى'
    },
    english: {
      firstName: 'john',
      secondName: 'die',
      thirdName: 'hard',
      familyName: 'here'
    }
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  education: null,
  specialization: null,
  birthDate: {
    gregorian: new Date('1944-07-01T00:00:00.000Z'),
    hijiri: '1363-07-11'
  },
  deathDate: null,
  maritalStatus: {
    arabic: 'متزوج',
    english: 'Married'
  },
  contactDetail: {
    addresses: [
      {
        type: 'POBOX',
        country: {
          arabic: 'السعودية',
          english: 'Saudi Arabia'
        },
        city: {
          arabic: 'جراجر',
          english: 'Jrajer'
        },
        postalCode: 34536,
        postBox: 4543534534,
        cityDistrict: {
          arabic: 'ينبع',
          english: 'District0302'
        }
      }
    ],
    emailId: {
      primary: 'Testing@Testing.com'
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: 745756745,
      secondary: null,
      isdCodePrimary: 'sa',
      isdCodeSecondary: null
    },
    faxNo: null,
    currentMailingAddress: 'POBOX',
    createdBy: 9914070,
    createdDate: {
      gregorian: new Date('2021-03-08T07:25:05.000Z'),
      hijiri: '1442-07-24'
    },
    lastModifiedBy: 9914070,
    lastModifiedDate: {
      gregorian: new Date('2021-03-16T06:39:48.000Z'),
      hijiri: '1442-08-03'
    },
    emergencyContactNo: null,
    mobileNoVerified: false
  },
  lifeStatus: null,
  prisoner: false,
  student: false,
  proactive: false,
  religion: null,
  bankAccount: {
    ibanBankAccountNo: 'SA0380000000608010167519',
    bankName: {
      arabic: 'زيارة الطبيب',
      english: 'Al Rajhi Bank'
    },
    bankCode: null,
    verificationStatus: null,
    approvalStatus: null,
    bankAddress: null,
    swiftCode: null,
    comments: null,
    isNonSaudiIBAN: false
  },
  personId: 70700,
  contracts: [
    {
      mbProfessionalId: 1000000084,
      contractId: 1000000396,
      contractType: {
        arabic: 'زيارة الطبيب',
        english: 'Visiting Doctor'
      },
      specialty: {
        arabic: 'التخدير',
        english: 'Anesthesia'
      },
      subSpecialty: null,
      medicalBoardType: null,
      region: null,
      hospital: {
        arabic: 'حجيلان الطبى/مستوصف',
        english: 'حجيلان الطبى/مستوصف'
      },
      fees: null,
      feesPerVisit: {
        arabic: 1000,
        english: 1000
      },
      status: {
        arabic: 'معتمد',
        english: 'Active'
      },
      startDate: {
        gregorian: new Date('2021-03-16T07:22:42.000Z'),
        hijiri: '1442-08-03'
      },
      endDate: null
    }
  ]
};
export const sessionDataMock = [
  {
    startDate: {
      gregorian: new Date('2020-11-21T00:00:00.000Z'),
      hijiri: '1442-04-06'
    },
    sessionID: 12345,
    status: { english: 'Scheduled', arabic: 'مجدول' },
    startTime: '9::00',
    endTime: '12::00',
    fee: 500,
    paymentStatus: { english: 'Not Paid', arabic: 'Not Paid' },
    transactionID: 1003126,
    type: { english: 'Regular', arabic: 'Regular' },
    channel: { english: 'GOSI Office', arabic: 'GOSI Office' },
    fieldOffice: { english: 'Riyadh', arabic: 'Riyadh' }
  },
  {
    startDate: {
      gregorian: new Date('2020-11-22T00:00:00.000Z'),
      hijiri: '1442-04-07'
    },
    sessionID: 11478,
    status: { english: 'Completed', arabic: 'Completed' },
    startTime: '11::00',
    endTime: '13::00',
    fee: 550,
    paymentStatus: { english: 'Paid', arabic: 'Paid' },
    transactionID: 1003890,
    channel: { english: 'Virtual', arabic: 'Virtual' },
    type: { english: 'Regular', arabic: 'Regular' },
    fieldOffice: { english: 'Makkah', arabic: 'Makkah' }
  }
];
export const messageMock = {
  arabic: 'الاردن',
  english: 'Jordan'
};
export const respContractMock = {
  contractId: 1000000201,
  message: { english: 'Modified contract', arabic: 'Modified contract' },
  transactionTraceId: 7934056
};
