import { of } from 'rxjs';

export class MemberServiceStub {
  verifyMember(id: string, birthDate: string, nationality: string, personType: string) {
    return of(memberListMock);
  }
  updateAdminDetails() {
    return of(memberListMock);
  }
  saveMemberDetails(data, status) {
    if (status === 1) {
      return of(personResposeMock);
    } else if (status === 3) {
      return of(contractResponse);
    }
  }
  getMemberDetails() {
    return of(memberResponseMock);
  }
  revertTransactionDetails() {
    return of(true);
  }
}
export const personResposeMock = {
  mbProfessionalId: 1000000004,
  contractId: null,
  contractType: null,
  specialty: null,
  subSpecialty: null,
  medicalBoardType: null,
  region: null,
  hospital: null,
  fees: null,
  feesPerVisit: null,
  status: null,
  startDate: null,
  endDate: null
};
export const personInDbResposeMock = {
  mbProfessionalId: 1000000191,
  contractId: 1000000410,
  contractType: {
    arabic: 'ممرض أو ممرضه',
    english: 'Nurse'
  },
  specialty: null,
  subSpecialty: null,
  medicalBoardType: null,
  region: [
    {
      arabic: 'الكويت',
      english: 'Region Kuwait'
    }
  ],
  hospital: {
    arabic: 'حجيلان الطبى/مستوصف',
    english: 'حجيلان الطبى/مستوصف'
  },
  fees: 300,
  feesPerVisit: null,
  status: {
    arabic: 'معتمد',
    english: 'Active'
  },
  startDate: {
    gregorian: '2021-03-17T09:50:20.000Z',
    hijiri: '1442-08-04'
  },
  endDate: null
};
export const memberListMock = {
  personId: 1023629949,
  bankAccount: null,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  issueDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  expiryDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  passportNo: 'A18803474',
  identity: [
    {
      idType: 'NIN',
      newNin: 1017511369
    }
  ],
  name: {
    arabic: {
      firstName: 'احمد',
      secondName: 'صمع',
      thirdName: 'احمد',
      familyName: 'الجمعان'
    },
    english: {
      name: 'Ahmed Samaa Ahmed Aljamaan'
    }
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  birthDate: {
    gregorian: '2021-04-01T00:00:00.000Z',
    hijiri: '1442-08-19'
  },
  deathDate: null,
  contactDetail: {
    addresses: [
      {
        type: 'NATIONAL',
        city: {
          arabic: 'سليلة جهينة',
          english: 'Slelat Johainah'
        },
        buildingNo: '2312',
        postalCode: '32123',
        district: 'sadasdasd',
        streetName: 'dasdasda',
        additionalNo: '2131',
        unitNo: null,
        cityDistrict: {
          arabic: 'ينبع',
          english: 'District0302'
        }
      },
      {
        type: 'POBOX',
        country: {
          arabic: 'السعودية ',
          english: 'Saudi Arabia'
        },
        city: {
          arabic: 'سليلة جهينة',
          english: 'Slelat Johainah'
        },
        postalCode: '23123',
        postBox: '3122132123',
        cityDistrict: {
          arabic: 'ينبع',
          english: 'District0302'
        }
      }
    ],
    emailId: {
      primary: 'pasul@gosi.gov.sa'
    },
    telephoneNo: {
      primary: '4757455475',
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: '111111111',
      secondary: null,
      isdCodePrimary: 'sa',
      isdCodeSecondary: null
    },
    faxNo: null,
    currentMailingAddress: 'POBOX',
    createdBy: 9914070,
    createdDate: {
      gregorian: '2021-02-15T12:18:50.000Z',
      hijiri: '1442-07-03'
    },
    lastModifiedBy: 9914070,
    lastModifiedDate: {
      gregorian: '2021-04-01T15:48:48.000Z',
      hijiri: '1442-08-19'
    },
    mobileNoVerified: false
  },
  lifeStatus: 'حي يرزق',
  prisoner: false,
  student: false,
  govtEmp: false
};

export const contractResponse = {
  contractId: 1000000640,
  message: {
    arabic: 'The contract details are added successfully.',
    english: 'The contract details are added successfully.'
  },
  transactionTraceId: 1003092
};

export const memberDetails = [
  {
    calendarId: 1000000161,
    comments: null,
    endDate: { gregorian: '2021-04-29T00:00:00.000Z', hijiri: '1442-09-17' },
    eason: 'sample multi',
    startDate: { gregorian: '2021-04-29T00:00:00.000Z', hijiri: '1442-09-17' }
  }
];

export const memberResponseMock = [
  {
    member: {
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
      contracts: null
    },
    modifiedContract: {
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
    },
    terminatedContract: {
      dateOfTermination: {
        gregorian: new Date('2021-03-16T07:22:42.000Z'),
        hijiri: '1442-08-03'
      },
      reasonForTermination: {
        arabic: 'معتمد',
        english: 'Active'
      },
      comments: 'string',
      contractId: 12345
    }
  }
];
