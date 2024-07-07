/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export const participantsList = [
  {
    contractId: 1,
    isdCode: 'string',
    contractType: {
      english: 'Str',
      arabic: 'str'
    },
    doctorName: {
      english: 'Str',
      arabic: 'str'
    },
    location: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    isAvailable: true,
    mbProfessionalId: 1,
    memberType: {
      english: 'Str',
      arabic: 'str'
    },
    participantType: {
      english: 'Str',
      arabic: 'str'
    },
    mobileNumber: 'string',
    identity: 1,
    identityNumber: 1,
    specialty: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    subSpecialty: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    nationalIdType: 'string',
    assessmentType: {
      english: 'Str',
      arabic: 'str'
    },
    noOfDaysInQueue: 1,
    inviteeId: 1,
    participantId: 1,
    name: {
      english: 'Str',
      arabic: 'str'
    },
    type: {
      english: 'Str',
      arabic: 'str'
    },
    disabilityType: {
      english: 'Str',
      arabic: 'str'
    }
  }
];
export const bulkParticipants = [
  {
    contractId: 1,
    assessmentType: {
      english: 'Str',
      arabic: 'str'
    },
    participantId: 1,
    noOfDaysInQueue: 1,
    mobileNumber: 'string',
    identityNumber: 1,
    location: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    specialty: {
      english: 'Str',
      arabic: 'str'
    }
  }
];
export const contractedMembers = [
  {
    contractId: 1,
    contractType: {
      english: 'Str',
      arabic: 'str'
    },
    doctorName: {
      english: 'Str',
      arabic: 'str'
    },
    location: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    isAvailable: true,
    mbProfessionalId: 1,
    memberType: {
      english: 'Str',
      arabic: 'str'
    },
    medicalBoardType: 'string',
    mobileNumber: 'string',
    nationalId: 1,
    speciality: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    subSpeciality: [
      {
        english: 'Str',
        arabic: 'str'
      }
    ],
    nationalIdType: 'string'
  }
];
export const boardFilterData = {
  listOfStatus: [
    {
      arabic: 'معتمد',
      english: 'Active'
    }
  ],
  pageNo: 0,
  pageSize: 10,
  sortOrder: 'DESC'
};
export class medicalBoardForm {
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createHoldSessionForm() {
    return this.fb.group({
      comments: [null],
      reason: this.fb.group({
        english: 'Monday',
        arabic: 'معتمد'
      })
    });
  }
  public createStopSessionForm() {
    return this.fb.group({
      stopDate: this.fb.group({
        gregorian: '1982-05-11T00:00:00.000Z',
        hijiri: '1402-07-18'
      }),
      stopReasonComments: ['comments'],
      stopReason: this.fb.group({
        english: 'Monday',
        arabic: 'معتمد'
      })
    });
  }
  public sessionStatusForm() {
    return this.fb.group({
      cancelSessionForm: this.fb.group({
        comments: [null],
        reason: [null]
      })
    });
  }
}
export const holdSessionFormData = {
  endDate: {
    gregorian: '1982-05-11T00:00:00.000Z',
    hijiri: '1402-07-18'
  },
  holdReason: {
    english: 'Monday',
    arabic: 'معتمد'
  },
  startDate: {
    gregorian: '1982-05-11T00:00:00.000Z',
    hijiri: '1402-07-18'
  },
  comments: 'comments'
};

export const configurationWrapperTest = {
  totalCount: 12,
  summaryDetails: [
    {
      sessionTemplateId: 12,
      sessionType: {
        english: 'Appeal',
        arabic: 'معتمد'
      },
      medicalBoardType: {
        english: 'Regular',
        arabic: 'معتمد'
      },
      officeLocation: {
        english: 'Saudi',
        arabic: 'معتمد'
      },
      frequency: {
        english: 'Every week',
        arabic: 'معتمد'
      },
      days: [
        {
          english: 'Monday',
          arabic: 'معتمد'
        },
        {
          english: 'Tuesday',
          arabic: 'معتمد'
        }
      ],
      status: {
        english: 'Active',
        arabic: 'معتمد'
      },
      startDate: {
        gregorian: '1982-05-11T00:00:00.000Z',
        hijiri: '1402-07-18'
      },
      endDate: {
        gregorian: '1982-05-11T00:00:00.000Z',
        hijiri: '1402-07-18'
      },
      startTime: '00::11',
      endTime: '00::12'
    }
  ]
};
export const MedicalBoardListMock = {
  contractType: {
    english: 'Saudi',
    arabic: 'معتمد'
  },
  inviteeId: 123123,
  identity: 123123,
  isdCode: 'sa',
  mobileNo: 124123123123,
  name: {
    english: 'Dentist',
    arabic: 'معتمد'
  },
  specialty: {
    english: 'Surgeaon',
    arabic: 'معتمد'
  },
  subSpecialty: {
    english: 'Nurse',
    arabic: 'معتمد'
  }
};
export const participantsListMock = {
  identity: 123123,
  name: {
    english: 'Abdul',
    arabic: 'معتمد'
  },
  participantType: {
    english: 'Contributor',
    arabic: 'معتمد'
  },
  assessmentType: {
    english: 'First Assessment',
    arabic: 'معتمد'
  },
  location: {
    english: 'Saudi',
    arabic: 'معتمد'
  },
  isPhoneClicked: true,
  inviteeId: 12312313,
  mobileNo: '28934679823748',
  disabilityType: {
    english: 'Saudi',
    arabic: 'معتمد'
  }
};
export const bulkPartipantsMock = [
  {
    assessmentType: {
      english: 'Saudi',
      arabic: 'معتمد'
    },
    participantId: 8757587,
    noOfDaysInQueue: 45354,
    mobileNumber: '979798798789',
    identityNumber: 7856786587687,
    location: [
      {
        english: 'Saudi',
        arabic: 'معتمد'
      }
    ]
  }
];
export const SessionRequestActionsock = {
  comments: 'added',
  reason: {
    english: 'Holiday',
    arabic: 'معتمد'
  }
};

export const sessionCalendarMock = {
  participantsInQueue: 123,
  sessionDetails: [
    {
      count: 123,
      date: {
        gregorian: '1982-05-11T00:00:00.000Z',
        hijiri: '1402-07-18'
      },
      dateString: '2021-11-20',
      isSlotsAvailable: true,
      noOfDates: 0,
      sessionId: 123
    }
  ]
};
export const SessionDataMock = {
  fieldOffice: {
    english: 'Saudi',
    arabic: 'معتمد'
  },
  maximumBeneficiaries: 12,
  noOfDoctorsInvited: 23,
  noOfDoctorsAccepted: 23,
  noOfParticipants: 32,
  sessionId: 12123,
  templateId: 123123,
  sessionStartTime: '00::12',
  sessionEndTime: '00::12',
  sessionType: {
    english: 'Appeal',
    arabic: 'معتمد'
  },
  status: {
    english: 'Active',
    arabic: 'معتمد'
  },
  membersCount: 12132,
  membersTotalCount: 12323,
  participantsCount: 123123,
  participantsTotalCount: 123123
};
export const individualSessionData = {
  beneficiarySlotOpenDays: 12,
  days: [
    {
      english: 'Monday',
      arabic: 'معتمد'
    },
    {
      english: 'Tuesday',
      arabic: 'معتمد'
    },
    {
      english: 'Wednesday',
      arabic: 'معتمد'
    },
    {
      english: 'Thursday',
      arabic: 'معتمد'
    }
  ],
  doctorDetails: [
    {
      doctorType: {
        english: 'Dentist',
        arabic: 'معتمد'
      },
      sessionSpecialityId: 123,
      speciality: {
        english: 'Monday',
        arabic: 'معتمد'
      },
      subSpeciality: {
        english: 'Monday',
        arabic: 'معتمد'
      }
    }
  ],
  officeLocation: {
    english: 'HeadOffice',
    arabic: 'معتمد'
  },
  doctorInviteCancelGraceDays: 12,
  endDate: {
    gregorian: '1982-05-11T00:00:00.000Z',
    hijiri: '1402-07-18'
  },
  endTime: '00::11',
  holdDetails: [
    {
      holdEndDate: {
        gregorian: '1982-05-11T00:00:00.000Z',
        hijiri: '1402-07-18'
      },
      holdReason: {
        english: 'Monday',
        arabic: 'معتمد'
      },
      holdStartDate: {
        gregorian: '1982-05-11T00:00:00.000Z',
        hijiri: '1402-07-18'
      }
    }
  ],
  maximumBeneficiaries: 12,
  medicalBoardType: {
    english: 'Monday',
    arabic: 'معتمد'
  },
  fieldOfficeCode: 0,
  minimumBeneficiaries: 12,
  sessionChannel: {
    english: 'Monday',
    arabic: 'معتمد'
  },
  isAmbUser: false,
  sessionCreationGraceDays: 12,
  isDoctorInviteCancelAllowed: true,
  sessionFrequency: {
    english: 'Monday',
    arabic: 'معتمد'
  },
  sessionTemplateId: 12,
  sessionType: {
    english: 'Monday',
    arabic: 'معتمد'
  },
  startDate: {
    gregorian: '1982-05-11T00:00:00.000Z',
    hijiri: '1402-07-18'
  },
  startTime: '00::12',
  status: {
    english: 'Monday',
    arabic: 'معتمد'
  }
};
export const saudiMemberFormDetails = {
  birthDate: {
    gregorian: 'Thu Apr 01 2021 09:53:55 GMT+0300 (Arabian Standard Time)',
    hijiri: '1422-11-19'
  },
  id: null,
  idType: 'NIN',
  iqamaNo: null,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  newNin: '1017511369',
  passportNo: null
};

export const NonSaudiMemberFormDetails = {
  birthDate: {
    gregorian: 'Thu Apr 01 2021 09:53:55 GMT+0300 (Arabian Standard Time)',
    hijiri: '1422-11-19'
  },
  id: null,
  idType: 'IQAMA',
  iqamaNo: '2647282546',
  nationality: {
    english: 'Iraq',
    arabic: 'العراق '
  },
  newNin: null,
  passportNo: null
};

export const GccMemberFormDetails = {
  birthDate: {
    gregorian: 'Thu Apr 01 2021 09:53:55 GMT+0300 (Arabian Standard Time)',
    hijiri: ''
  },
  id: '465847647654',
  idType: 'GCCID',
  iqamaNo: null,
  nationality: {
    english: 'Kuwait',
    arabic: 'الكويت'
  },
  newNin: null,
  passportNo: null
};
export const GccDataNotInDB = {
  birthDate: {
    gregorian: 'Thu Apr 01 2021 09:53:55 GMT+0300 (Arabian Standard Time)',
    hijiri: ''
  },
  id: '46584764765',
  idType: 'GCCID',
  iqamaNo: null,
  nationality: {
    english: 'Qatar',
    arabic: 'الكويت'
  },
  newNin: null,
  passportNo: null
};

export const MemberDetails = {
  personId: 1037307749,
  nationality: {
    arabic: 'الكويت',
    english: 'Kuwait'
  },
  identity: [
    {
      idType: 'GCCID',
      id: 465847647654
    }
  ],
  name: {
    arabic: {
      firstName: 'امجاد',
      familyName: 'امجاد'
    },
    english: {
      name: 'Amjad'
    }
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  birthDate: {
    gregorian: '1982-05-11T00:00:00.000Z',
    hijiri: '1402-07-18'
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
        buildingNo: '0038',
        postalCode: '89030',
        district: 'S',
        streetName: 'SDHO',
        additionalNo: '3243',
        unitNo: null,
        cityDistrict: {
          arabic: 'ينبع',
          english: 'District0302'
        }
      }
    ],
    emailId: {
      primary: 'sas@asdas.com'
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: '324234234',
      secondary: null,
      isdCodePrimary: 'sa',
      isdCodeSecondary: null
    },
    faxNo: null,
    currentMailingAddress: 'NATIONAL',
    createdBy: 9914070,
    createdDate: {
      gregorian: '2021-03-01T19:29:17.000Z',
      hijiri: '1442-07-17'
    },
    lastModifiedBy: 9914070,
    lastModifiedDate: {
      gregorian: '2021-03-31T13:19:21.000Z',
      hijiri: '1442-08-18'
    },
    mobileNoVerified: false
  },
  lifeStatus: null,
  prisoner: false,
  student: false,
  bankAccount: {
    isNonSaudiIBAN: true,
    ibanBankAccountNo: 'SA7255043SG66083110DS519',
    bankName: {
      arabic: 'Banque Saudi Fransi',
      english: 'Banque Saudi Fransi'
    },
    bankCode: null,
    verificationStatus: 'Sama Not Verified',
    approvalStatus: 'Sama Verification Pending',
    bankAddress: null,
    swiftCode: null,
    comments: null,
    active: null
  },
  govtEmp: false
};

export const personDetails = {
  bankAccount: {
    bankName: {
      arabic: 'البنك السعودي الفرنسي',
      english: 'Banque Saudi Fransi'
    },
    ibanAccountNo: 'SA7255043SG66083110DS519'
  },
  personId: 1023629949,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
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
  }
};

export const personDetailsInDb = {
  bankAccount: {
    bankName: {
      arabic: 'البنك السعودي الفرنسي',
      english: 'Banque Saudi Fransi'
    },
    ibanAccountNo: 'SA7255043SG66083110DS519'
  },
  personId: 1037870942,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  identity: [
    {
      idType: 'NIN',
      newNin: 1027194495
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
  contactDetail: {
    addresses: [
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
        postalCode: '53453',
        postBox: '4354543345',
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
  }
};
export const MbContractDetails = {
  personId: 1023629949,
  nationality: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
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
      gregorian: '2021-04-02T19:16:36.000Z',
      hijiri: '1442-08-20'
    },
    mobileNoVerified: false
  },
  lifeStatus: 'حي يرزق',
  prisoner: false,
  student: false,
  govtEmp: false,
  mbProfessionalId: 1000000004,
  contractType: {
    english: 'Nurse',
    arabic: 'ممرض'
  },
  medicalBoardType: {},
  hospital: {
    english: 'حجيلان الطبى/مستوصف',
    arabic: 'حجيلان الطبى/مستوصف'
  },
  region: [
    {
      sequence: 1,
      english: 'Region Kuwait',
      arabic: 'الكويت'
    }
  ],
  specialty: {},
  subSpecialty: [],
  fees: 300,
  feesPerVisit: null
};
export const configListData = {
  sessionTemplateId: 19,
  sessionType: { english: 'Ad Hoc', arabic: 'محددة' },
  medicalBoardType: {
    arabic: 'اللجنة الطبية  الاستئنافية ',
    english: 'Primary Medical Board'
  },
  frequency: {
    arabic: 'Every week',
    english: 'Every week'
  },
  status: {
    arabic: 'Active',
    english: 'Active'
  },
  sessionId: 123,
  days: [
    {
      arabic: 'الأحد',
      english: 'Sunday'
    }
  ],
  startTime: 'd',
  endTime: '2',
  startDate: {
    gregorian: '2021-10-29T00:00:00.000Z',
    hijiri: '1443-03-23',
    entryFormat: null
  },
  endDate: {
    gregorian: '2021-10-29T00:00:00.000Z',
    hijiri: '1443-03-23',
    entryFormat: null
  }
};
export const configListregularSession = {
  sessionTemplateId: 19,
  sessionType: {
    english: 'Regular',
    arabic: 'دورية'
  },
  medicalBoardType: {
    arabic: 'اللجنة الطبية  الاستئنافية ',
    english: 'Primary Medical Board'
  },
  frequency: {
    arabic: 'Every week',
    english: 'Every week'
  },
  status: {
    arabic: 'Active',
    english: 'Active'
  },
  sessionId: 123,
  days: [
    {
      arabic: 'الأحد',
      english: 'Sunday'
    }
  ],
  startTime: 'd',
  endTime: '2',
  startDate: {
    gregorian: '2021-10-29T00:00:00.000Z',
    hijiri: '1443-03-23',
    entryFormat: null
  },
  endDate: {
    gregorian: '2021-10-29T00:00:00.000Z',
    hijiri: '1443-03-23',
    entryFormat: null
  }
};
export class RegularSessionForms {
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public SessionForm(): FormGroup {
    return this.fb.group({
      medicalForm: this.fb.array([this.specialityForm()]),
      inviteForm: this.fb.group({
        medicalBoardList: this.fb.group({
          english: ['Primary Medical Board', { validators: Validators.required }],
          arabic: [null]
        }),
        sessionChannelList: this.fb.group({
          english: ['GOSI Office', { validators: Validators.required }],
          arabic: [null]
        }),
        officeLocation: this.fb.group({
          english: ['Riyadh'],
          arabic: ['الرياض']
        }),
        sessionFrequency: this.fb.group({
          arabic: [],
          english: [
            null,
            {
              validators: Validators.compose([Validators.required]),
              updateOn: 'blur'
            }
          ]
        }),
        startDate: this.fb.group({
          gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
          hijiri: null
        }),
        startTimePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        timePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        day: this.fb.group({
          sunday: [null, { validators: Validators.required }],
          monday: [null, { validators: Validators.required }],
          tuesday: [null, { validators: Validators.required }],
          wednesday: [null, { validators: Validators.required }],
          thursday: [null, { validators: Validators.required }],
          friday: [null, { validators: Validators.required }],
          saturday: [null, { validators: Validators.required }]
        }),
        noOfCancellationDays: [null]
      }),
      invitationForm: this.fb.group({
        noOfInvitationDays: [
          null,
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        doctorAcceptance: this.fb.group({
          english: ['Yes', { validators: Validators.required }],
          arabic: [null]
        }),
        noOfCancellationDays: [null, Validators.compose([Validators.required])]
      }),
      sessionDetails: this.fb.group({
        medicalBoardList: this.fb.group({
          english: ['Primary Medical Board', { validators: Validators.required }],
          arabic: [null]
        }),
        sessionChannelList: this.fb.group({
          english: ['GOSI Office', { validators: Validators.required }],
          arabic: [null]
        }),
        officeLocation: this.fb.group({
          english: ['Riyadh'],
          arabic: ['الرياض']
        }),
        sessionFrequency: this.fb.group({
          arabic: [],
          english: [
            null,
            {
              validators: Validators.compose([Validators.required]),
              updateOn: 'blur'
            }
          ]
        }),
        startDate: this.fb.group({
          gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
          hijiri: null
        }),
        startTimePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        timePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        day: this.fb.group({
          sunday: [null, { validators: Validators.required }],
          monday: [null, { validators: Validators.required }],
          tuesday: [null, { validators: Validators.required }],
          wednesday: [null, { validators: Validators.required }],
          thursday: [null, { validators: Validators.required }],
          friday: [null, { validators: Validators.required }],
          saturday: [null, { validators: Validators.required }]
        }),
        noOfCancellationDays: [null]
      }),
      sessionSlotForm: this.fb.group({
        noOfSessionDays: [null, Validators.required],
        noOfbeneficiaries: [null, Validators.required],
        noOfSessionPriorDays: [null, Validators.compose([Validators.required])]
      })
    });
  }
  public AdhocSessionForm() {
    return this.fb.group({
      inviteForm: this.fb.group({
        medicalBoardList: this.fb.group({
          english: ['Primary Medical Board', { validators: Validators.required }],
          arabic: [null]
        }),
        sessionChannelList: this.fb.group({
          english: ['GOSI Office', { validators: Validators.required }],
          arabic: [null]
        }),
        officeLocation: this.fb.group({
          english: ['Riyadh'],
          arabic: ['الرياض']
        }),
        sessionFrequency: this.fb.group({
          arabic: [null],
          english: [null]
        }),
        startDate: this.fb.group({
          gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
          hijiri: null
        }),
        startTimePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        timePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        day: this.fb.group({
          sunday: [null],
          monday: [null],
          tuesday: [null],
          wednesday: [null],
          thursday: [null],
          friday: [null],
          saturday: [null]
        }),
        noOfCancellationDays: [null]
      }),
      sessionDetails: this.fb.group({
        medicalBoardList: this.fb.group({
          english: ['Primary Medical Board', { validators: Validators.required }],
          arabic: [null]
        }),
        sessionChannelList: this.fb.group({
          english: ['GOSI Office', { validators: Validators.required }],
          arabic: [null]
        }),
        officeLocation: this.fb.group({
          english: ['Riyadh'],
          arabic: ['الرياض']
        }),
        sessionFrequency: this.fb.group({
          arabic: [null],
          english: [null]
        }),
        startDate: this.fb.group({
          gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
          hijiri: null
        }),
        startTimePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        timePicker: this.fb.group({
          injuryHour: [null, { validators: Validators.required }],
          injuryMinute: [null, { validators: Validators.required }]
        }),
        day: this.fb.group({
          sunday: [null],
          monday: [null],
          tuesday: [null],
          wednesday: [null],
          thursday: [null],
          friday: [null],
          saturday: [null]
        }),
        noOfCancellationDays: [null]
      }),
      sessionSlotForm: this.fb.group({
        noOfSessionDays: [null, Validators.required],
        noOfbeneficiaries: [null, Validators.required],
        noOfSessionPriorDays: [null, Validators.compose([Validators.required])]
      })
    });
  }
  public rescheduleForm() {
    return this.fb.group({
      endTime: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      }),
      session: this.SessionDateForm()
    });
  }
  public SessionDateForm() {
    return this.fb.group({
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        hijiri: null
      }),
      startTimePicker: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      })
    });
  }
  public specialityForm() {
    return this.fb.group({
      speciality: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      subspeciality: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
}
export const mbData = [
  {
    speciality: {
      english: 'Cardiac',
      arabic: 'الكويت'
    },
    subspeciality: {
      english: 'Cardiac',
      arabic: 'الكويت'
    }
  },
  {
    speciality: {
      english: 'Cardiac',
      arabic: 'الكويت'
    },
    subspeciality: {
      english: 'Cardiac',
      arabic: 'الكويت'
    }
  }
];
export const memberListData = {
  totalCount: 1,
  sessionMembers: [
    {
      contractId: 1234,
      contractType: { english: 'Contracted Doctor', arabic: null },
      doctorName: { english: 'ahmed', arabic: 'ahmed' },
      location: [],
      isAvailable: true,
      mbProfessionalId: 345678,
      memberType: { english: 'Contracted Doctor', arabic: null },
      medicalBoardType: 'PMB',
      mobileNumber: '5555555',
      nationalId: 21456789,
      speciality: [],
      subSpeciality: [],
      nationalIdType: 'Iqama'
    }
  ]
};
export const partcipantList = {
  count: 1,
  participantsList: [
    {
      assessmentType: { english: 'Reassessment', arabic: 'Reassessment' },
      contractId: 123,
      contractType: { english: 'Gosi Doctor', arabic: 'Gosi Doctor' },
      disabilityType: { english: 'Heir Disability', arabic: 'Heir Disability' },
      doctorName: { english: 'Mohammed', arabic: 'Mohammed' },
      identity: 12,
      identityNumber: 56578687,
      inviteeId: 78,
      isAvailable: true,
      isdCode: '966',
      location: [],
      mbProfessionalId: 100000097,
      memberType: { english: 'Gosi Doctor', arabic: 'Gosi Doctor' },
      mobileNumber: '5555555',
      nationalIdType: 'NIN',
      noOfDaysInQueue: 4,
      participantId: 56,
      participantType: null,
      specialty: [],
      subSpecialty: [],
      type: null
    }
  ]
};
export const message = {
  english: 'member added successfully',
  arabic: 'member added successfully'
};
export const rescheduleData = {
  mbList: [],
  totalNoOfRecords: 1,
  medicalBoardType: { english: 'Primary Medical Board', arabic: 'Primary Medical Board' },
  officeLocation: { english: 'Riyadh', arabic: 'Riyadh' },
  sessionType: { english: 'Regular', arabic: 'Regular' },
  sessionDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  startTime: '01::01',
  endTime: '02::08'
};
export const MockrescheduleData = {
  mbList: [],
  totalNoOfRecords: 1,
  medicalBoardType: { english: 'Appeal Medical Board', arabic: 'Appeal Medical Board' },
  officeLocation: { english: 'Riyadh', arabic: 'Riyadh' },
  sessionType: { english: 'Regular', arabic: 'Regular' },
  sessionDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  startTime: '01::01',
  endTime: '02::08'
};
export const sessionStatusDetails = {
  endTime: '05:08',
  maximumBeneficiaries: 10,
  mbList: [
    {
      contractType: { english: 'Gosi Doctor', arabic: 'Gosi Doctor' },
      inviteeId: 112,
      identity: 3214,
      isdCode: '966',
      mobileNo: 456798564656,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      specialty: null,
      subSpecialty: null
    }
  ],
  participantList: [
    {
      identity: 678,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      participantType: { english: 'type', arabic: 'type' },
      assessmentType: { english: 'Reassessment', arabic: 'Reassessment' },
      location: { english: 'Riyadh', arabic: 'Riyadh' },
      isPhoneClicked: false,
      inviteeId: 12345,
      mobileNo: '45657676',
      disabilityType: null
    }
  ],
  medicalBoardType: { english: 'Primary Medical Board', arabic: 'Primary Medical Board' },
  noOfDoctorsInvited: 15,
  noOfDoctorsAccepted: 10,
  noOfParticipants: 30,
  officeLocation: { english: 'Riyadh', arabic: 'Riyadh' },
  sessionDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  sessionType: { english: 'Regular', arabic: 'Regular' },
  startTime: '01:00',
  status: { english: 'Scheduled', arabic: 'مجدول' },
  totalNoOfMBRecords: 1,
  totalNoOfParticipantRecords: 1,
  fieldOfficeCode: 1,
  isAmbUser: 0
};
export const sessionStatusDetail = {
  endTime: '05:08',
  maximumBeneficiaries: 10,
  mbList: [
    {
      contractType: { english: 'Contracted Doctor', arabic: 'Contracted Doctor' },
      inviteeId: 112,
      identity: 3214,
      isdCode: '966',
      mobileNo: 456798564656,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      specialty: null,
      subSpecialty: null
    }
  ],
  participantList: [
    {
      identity: 678,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      participantType: { english: 'type', arabic: 'type' },
      assessmentType: { english: 'Reassessment', arabic: 'Reassessment' },
      location: { english: 'Riyadh', arabic: 'Riyadh' },
      isPhoneClicked: false,
      inviteeId: 12345,
      mobileNo: '45657676',
      disabilityType: null
    }
  ],
  medicalBoardType: { english: 'Primary Medical Board', arabic: 'Primary Medical Board' },
  noOfDoctorsInvited: 15,
  noOfDoctorsAccepted: 10,
  noOfParticipants: 30,
  officeLocation: { english: 'Riyadh', arabic: 'Riyadh' },
  sessionDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  sessionType: { english: 'Regular', arabic: 'Regular' },
  startTime: '01:00',
  status: { english: 'Scheduled', arabic: 'مجدول' },
  totalNoOfMBRecords: 1,
  totalNoOfParticipantRecords: 1,
  fieldOfficeCode: 1,
  isAmbUser: 0
};
export const MocksessionStatusDetails = {
  endTime: '05:08',
  maximumBeneficiaries: 10,
  mbList: [
    {
      contractType: { english: 'Gosi Doctor', arabic: 'Gosi Doctor' },
      inviteeId: 112,
      identity: 3214,
      isdCode: '966',
      mobileNo: 456798564656,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      specialty: null,
      subSpecialty: null
    }
  ],
  participantList: [
    {
      identity: 678,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      participantType: { english: 'type', arabic: 'type' },
      assessmentType: { english: 'Reassessment', arabic: 'Reassessment' },
      location: { english: 'Riyadh', arabic: 'Riyadh' },
      isPhoneClicked: false,
      inviteeId: 12345,
      mobileNo: '45657676',
      disabilityType: null
    }
  ],
  medicalBoardType: { english: 'Appeal Medical Board', arabic: 'Appeal Medical Board' },
  noOfDoctorsInvited: 15,
  noOfDoctorsAccepted: 10,
  noOfParticipants: 30,
  officeLocation: { english: 'Riyadh', arabic: 'Riyadh' },
  sessionDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  sessionType: { english: 'Regular', arabic: 'Regular' },
  startTime: '01:00',
  status: { english: 'Scheduled', arabic: 'Scheduled' },
  totalNoOfMBRecords: 1,
  totalNoOfParticipantRecords: 1,
  fieldOfficeCode: 1,
  isAmbUser: 1
};
export const DummysessionStatusDetails = {
  endTime: '05:08',
  maximumBeneficiaries: 10,
  mbList: [
    {
      contractType: { english: 'Contracted Doctor', arabic: 'Contracted Doctor' },
      inviteeId: 112,
      identity: 3214,
      isdCode: '966',
      mobileNo: 456798564656,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      specialty: null,
      subSpecialty: null
    }
  ],
  participantList: [
    {
      identity: 678,
      name: { english: 'Ahmed', arabic: 'Ahmed' },
      participantType: { english: 'type', arabic: 'type' },
      assessmentType: { english: 'Reassessment', arabic: 'Reassessment' },
      location: { english: 'Riyadh', arabic: 'Riyadh' },
      isPhoneClicked: false,
      inviteeId: 12345,
      mobileNo: '45657676',
      disabilityType: null
    }
  ],
  medicalBoardType: { english: 'Appeal Medical Board', arabic: 'Appeal Medical Board' },
  noOfDoctorsInvited: 15,
  noOfDoctorsAccepted: 10,
  noOfParticipants: 30,
  officeLocation: { english: 'Riyadh', arabic: 'Riyadh' },
  sessionDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  sessionType: { english: 'Regular', arabic: 'Regular' },
  startTime: '01:00',
  status: { english: 'Scheduled', arabic: 'Scheduled' },
  totalNoOfMBRecords: 1,
  totalNoOfParticipantRecords: 1,
  fieldOfficeCode: 1,
  isAmbUser: 1
};
export const unAvailableData = [
  {
    mbProfessionId: 1234,
    inviteId: 567,
    contractId: 45667888,
    identity: 1999776756,
    inviteeId: 56677,
    isRemoved: 0,
    memberType: { english: 'Contracted Doctor', arabic: 'Contracted Doctor' },
    name: { english: 'Contracted Doctor', arabic: 'Contracted Doctor' },
    sessionSpecialityId: 123444,
    speciality: null,
    subSpeciality: null
  }
];
