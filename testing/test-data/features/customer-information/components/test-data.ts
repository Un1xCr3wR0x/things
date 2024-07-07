import { bindToObject, IdentityTypeEnum, RouterData, TransactionWorkflowItem, AdminDto } from '@gosi-ui/core';
import { BilingualMessageWrapper } from '@gosi-ui/features/customer-information/lib/shared';
import { genericContactDetails } from 'testing';
import { FormBuilder, Validators } from '@angular/forms';

export const personRequest = {
  idType: 'NIN',
  newNin: '1034835742',
  birthDate: { gregorian: new Date('1969-09-12'), hijiri: '1424-07-01' }
};

export const bilingualWrapperResponse: BilingualMessageWrapper = {
  bilingualMessage: {
    english: 'SUccess',
    arabic: 'success'
  }
};
export const routerDataResponse = {
  taskId: 'fesgerh-345gdf-fbhhn',
  assignedRole: 'Validator1',
  resourceType: 'BorderNo-Update',
  transactionId: 112345,
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const changePasswordData = {
  confirmPassword: 'undefined',
  oldPassword: 'undefined',
  newPassword: 'undefined'
};
export const PayloadTest = {
  iss: 'http://IDMOHSLVT01.gosi.ins:7778/oauth2',
  aud: ['PrivateRServer', 'ab0'],
  exp: 1659761816,
  jti: 'cyuQAyEB4CFlWqEGHqkR7w',
  iat: 1628225816,
  sub: 'nj022969',
  uid: 'e0022969',
  gosiscp: '[{"role":["121"]}] ',
  longnamearabic: 'ابراهيم بن عبدالله الغباري',
  longnameenglish: 'NOT_FOUND',
  userreferenceid: '22969',
  customeAttr1: 'CustomValue',
  client: 'CRMEstablishment18',
  scope: ['PrivateRServer.read'],
  domain: 'PrivateDomain'
};
export const personResponse = {
  personId: 1036053648,
  nationality: { arabic: 'مصر', english: 'Egypt' },
  identity: [
    {
      idType: 'PASSPORT',
      passportNo: 'A18803474',
      issueDate: { gregorian: '2016-08-13T00:00:00.000Z', hijiri: '1437-11-10' }
    },
    /* {
      idType: 'IQAMA',
      iqamaNo: 2475362386,
      expiryDate: {
        gregorian: '2020-11-21T00:00:00.000Z',
        hijiri: '1442-04-06'
      }
    }, */
    { idType: 'BORDERNO', id: 3048746279 }
  ],
  name: {
    arabic: {
      firstName: 'هبه',
      secondName: 'عبد الرحيم',
      thirdName: 'حسين',
      familyName: 'محمد'
    },
    english: { name: 'Abdulah' }
  },
  sex: { arabic: 'انثى', english: 'Female' },
  education: { arabic: 'ثانويه عامه', english: 'High School' },
  specialization: { arabic: 'الزراعة', english: 'الزراعة' },
  birthDate: { gregorian: '1994-06-10T00:00:00.000Z', hijiri: '1415-01-01' },
  deathDate: null,
  maritalStatus: { arabic: 'اعزب', english: 'Single' },
  contactDetail: {
    address: {
      type: 'NATIONAL',
      city: { arabic: 'رخو', english: 'Rokho' },
      buildingNo: '1111',
      postalCode: '11391',
      district: 'streetarea',
      streetName: 'Ulala',
      additionalNo: null,
      unitNo: null,
      cityDistrict: null
    },
    emailId: { primary: 'hr@al-bilad.com' },
    telephoneNo: {
      primary: '0112153626',
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: '0501206817',
      secondary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null
    },
    mobileNoVerified: true,
    faxNo: null
  },
  lifeStatus: undefined,
  govtEmp: false
};

export const beneficiaryMockData = {
  isEditable: true,
  errorMessage: null
};

export const beneficiaryErrorMockData = {
  isEditable: true,
  errorMessage: {
    english: 'Cannot edit',
    arabic: 'Cannot edit'
  }
};

export const contributorPatchData = {
  iqamaNo: null,
  BORDERNO: null
};
export const educationPatchData = {
  education: { arabic: 'متوسطه', english: 'Secondary' },
  specialization: { arabic: 'ثانوي زراعي', english: 'ثانوي زراعي' },
  type: 'education'
};

export const BankPatchData = {
  isNonSaudiIBAN: false,
  ibanBankAccountNo: 'string',
  bankCode: 1234,
  bankName: null,
  bankAddress: 'string',
  swiftCode: 'string',
  verificationStatus: 'string',
  approvalStatus: 'string',
  comments: 'string',
  type: 'string'
};
export const contactPatchData = {
  emailId: null,
  faxNo: null,
  mobileNo: null,
  mobileNoVerified: false,
  telephoneNo: null,
  type: 'string'
};
export const addressPatchData = {
  addresses: null,
  type: 'string',
  currentMailingAddress: 'string'
};

export const updateEduReponse = {
  bilingualMessage: {
    english: 'Successfull',
    arabic: 'Successfull'
  }
};

export const bankDetailsReponse = {
  ibanBankAccountNo: 'SA595504ASG66086110DS519',
  bankName: { arabic: 'EBIL', english: 'EBIL' },
  samaVerificationStatus: 'Sama Not Verified',
  approvalStatus: 'Sama Verification Pending',
  isNonSaudiIBAN: false,
  bankAddress: 'Testing bank address'
};

export const engagementResponse = {
  socialInsuranceNo: 12354321,
  active: false
};

export const contributorResponse = {
  estRegistrationNo: 503346141,
  socialInsuranceNo: 11340962
};
export const terminatePayloadResponse = {
  leavingDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  leavingReason: { arabic: 'مصر', english: 'asdasf' }
};
export const EngagementData = {
  engagementId: 1234567,
  joiningDate: {
    gregorian: new Date('2016-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  leavingDate: {
    gregorian: new Date('2020-08-13T00:00:00.000Z'),
    hijiri: '1437-11-10'
  },
  leavingReason: { arabic: 'مصر', english: 'asdasf' },
  status: 'leave'
};
export const contributorSearchResponse = {
  socialInsuranceNo: 114142190,
  vicIndicator: false,
  contributorType: 'non-saudi',
  person: {
    personId: 1036053648,
    socialInsuranceNumber: null,
    nationality: { arabic: 'مصر', english: 'Egypt' },
    identity: [
      {
        idType: IdentityTypeEnum.PASSPORT,
        passportNo: 'A18803474',
        issueDate: {
          gregorian: new Date('2016-08-13T00:00:00.000Z'),
          hijiri: '1437-11-10'
        },
        expiryDate: undefined
      },
      {
        idType: IdentityTypeEnum.IQAMA,
        iqamaNo: 2475362386,
        borderNo: undefined,
        expiryDate: {
          gregorian: new Date('2020-11-21T00:00:00.000Z'),
          hijiri: '1442-04-06'
        }
      },
      { idType: IdentityTypeEnum.BORDER, id: 3048746279 }
    ],
    name: {
      arabic: {
        firstName: 'هبه',
        secondName: 'عبد الرحيم',
        thirdName: 'حسين',
        familyName: 'محمد',
        fromJsonToObject: () => {
          return undefined;
        }
      },
      english: { name: 'Abdulah' },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    sex: { arabic: 'انثى', english: 'Female' },
    education: { arabic: 'ثانويه عامه', english: 'High School' },
    specialization: { arabic: 'الزراعة', english: 'الزراعة' },
    birthDate: { gregorian: new Date('1994-06-10T00:00:00.000Z'), hijiri: '1415-01-01' },
    deathDate: { gregorian: new Date('1994-06-10T00:00:00.000Z'), hijiri: '1415-01-01' },
    maritalStatus: { arabic: 'الزراعة', english: 'single' },
    contactDetail: genericContactDetails,
    userPreferences: null,
    lifeStatus: null,
    govtEmp: true,
    personType: undefined,
    student: false,
    prisoner: false,
    proactive: false,
    role: 'contributor',
    fromJsonToObject: () => {
      return undefined;
    }
  },
  hasActiveWorkFlow: false,
  active: true,
  statusType: 'ACTIVE',
  fromJsonToObject: () => {
    return undefined;
  }
};

export const genericError = {
  error: {
    code: 'EST-12-1001',
    message: {
      english: 'No records',
      arabic: 'No records'
    }
  }
};
export const iqamaResponse = {
  iqamaNo: null,
  BORDERNO: null
};

export const documentResonseItemList = [
  {
    content: 'dfsvsdfgv',
    documentName: 'passport',
    fileName: 'dfsdf',
    id: '123'
  }
];
export const establishmentResponce = {
  navigationIndicator: null,
  proactive: false,
  recruitmentNo: null,
  registrationNo: 200085744,
  scanDocuments: null,
  contactDetails: {
    address: {
      country: {
        arabic: 'السعودية ',
        english: 'Saudi Arabia'
      },
      city: {
        arabic: 'القطيف',
        english: 'Alqateef'
      },
      postalCode: '31911',
      postBox: '744',
      cityDistrict: null,
      type: 'POBOX'
    },
    emailId: {
      primary: 'noreply@gosi.gov.sa'
    },
    telephoneNo: {
      primary: '0434743',
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    },
    mobileNo: {
      primary: null,
      secondary: null
    },
    faxNo: null
  }
};
export const searchContributorResponse = {
  estIdentifier: 503346141,
  cntIdentifier: 11340962
};
export const updateTaskRequest = {
  workflowUser: 'string',
  bpmTaskId: 1231
};
export const beneficiaryErrMockData = {
  isEditable: ' ',
  message: {
    english: 'Cannot edit',
    arabic: 'Cannot edit'
  }
};

export const getEstablishmentProfile = {
  registrationNo: 300001297,
  name: { arabic: 'شركه عبدالله سعيد بقشان واخوانه', english: null },
  recruitmentNo: 7000013156,
  mainEstablishmentRegNo: 110008406,
  status: { arabic: 'مسجلة', english: 'REGISTERED' },
  startDate: { gregorian: '1982-12-16T00:00:00.000Z', hijiri: '1403-03-01' },
  city: { arabic: 'خميس مشيط', english: 'Khamais Moshait' },
  establishmentType: { arabic: 'فرعية', english: 'Branch' },
  noOfBranches: 0,
  closingDate: null
};

export const feedbackMessageResponse = {
  bilingualMessage: {
    english: 'Successfull',
    arabic: 'Successfull'
  }
};
export const getTransactionWorkflowResponse = [
  {
    approverName: {
      arabic: 'طلبك لإضافة رقم الحدود: 4516516137 للمشترك تحت المعالجة',
      english: 'Your request to add Border number: 4516516137 for the contributor is in progress.'
    },
    approverRole: {
      arabic: 'طلبك لإضافة رقم الحدود: 4516516137 للمشترك تحت المعالجة',
      english: 'Your request to add Border number: 4516516137 for the contributor is in progress.'
    },
    status: {
      arabic: 'طلبك لإضافة رقم الحدود: 4516516137 للمشترك تحت المعالجة',
      english: 'Your request to add Border number: 4516516137 for the contributor is in progress.'
    },
    date: {
      gregorian: '2019-12-11T13:17:54.000Z',
      hijiri: '1441-04-14'
    },
    display: false
  }
];
export const transactionWorkflowList: TransactionWorkflowItem[] = getTransactionWorkflowResponse.map(res =>
  bindToObject(new TransactionWorkflowItem(), res)
);

export const getWorkflowResponse = [
  {
    type: IdentityTypeEnum.BORDER,
    status: 'WORKFLOW IN VALIDATION',
    message: {
      arabic: 'طلبك لإضافة رقم الحدود: 4516516137 للمشترك تحت المعالجة',
      english: 'Your request to add Border number: 4516516137 for the contributor is in progress.'
    },
    oldValue: 'null',
    newValue: '4516516137',
    transactionData: [
      {
        transactionType: 'Update Border Number',
        referenceNo: 10553,
        userName: { arabic: 'افيل', english: 'Afil' },
        role: { arabic: 'المدقق الأول', english: 'First Validator' },
        rejectionReason: null,
        returnReason: null,
        comments: 'Testing workflow',
        createdDate: {
          gregorian: '2019-12-11T13:17:54.000Z',
          hijiri: '1441-04-14'
        }
      }
    ]
  },
  {
    type: IdentityTypeEnum.IQAMA,
    status: 'WORKFLOW IN VALIDATION',
    message: {
      arabic: 'طلبك لإضافة رقم الحدود: 4516516137 للمشترك تحت المعالجة',
      english: 'Your request to add Border number: 4516516137 for the contributor is in progress.'
    },
    oldValue: 'null',
    newValue: '4516516137',
    transactionData: [
      {
        transactionType: 'Update Border Number',
        referenceNo: 10553,
        userName: { arabic: 'افيل', english: 'Afil' },
        role: { arabic: 'المدقق الأول', english: 'First Validator' },
        rejectionReason: null,
        returnReason: null,
        comments: 'Testing workflow',
        createdDate: {
          gregorian: '2019-12-11T13:17:54.000Z',
          hijiri: '1441-04-14'
        }
      }
    ]
  }
];
export class UserPreferenceForm {
  fb: FormBuilder = new FormBuilder();

  public userPreferenceForm() {
    return this.fb.group({
      applicationLanguage: this.fb.group({
        english: ['Arabic', { validators: Validators.required }],
        arabic: ['انجليزي']
      }),
      notificationLanguage: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      channel: this.fb.group({
        EMAIL: [],
        SMS: []
      })
    });
  }
}
export class ChangePasswordForm {
  fb: FormBuilder = new FormBuilder();

  public changePasswordForm() {
    return this.fb.group(
      {
        oldPassword: [''],
        newPassword: [''],
        confirmPassword: ['']
      },
      { updateOn: 'blur' }
    );
  }
}
export const UserPreferenceData = {
  languagePreference: 'en'
};
export const UserPreferenceValue = {
  email: 'email',
  mobile: '543567890',
  preferredLanguage: 'Arabic'
};
export const UserPreferenceEnglishValue = {
  email: 'email',
  mobile: '543567890',
  preferredLanguage: 'english'
};
export const UserPreferenceArabicValue = {
  email: 'email',
  mobile: '543567890',
  preferredLanguage: 'arabic'
};
export const ChangePasswordData = {
  userId: 12345678,
  result: 'SUCCESS'
};
export const UserPreferenceDatas = { commPreferences: 'Ar', contactPreferences: ['sms', 'email'] };
export const AdminWrapperDtoTest = {
  admins: [
    {
      roles: [3, 5, 6],
      deathDate: null,
      birthDate: null,
      role: '',
      maritalStatus: { arabic: 'اعزب', english: 'Single' },
      contactDetail: {
        currentMailingAddress: 'NATIONAL',
        emergencyContactNo: null,
        addresses: [
          {
            country: null,
            postBox: null,
            additionalNo: null,
            unitNo: null,
            detailedAddress: null,
            type: 'NATIONAL',
            city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
            buildingNo: null,
            cityDistrict: null,
            district: null,
            postalCode: null,
            streetName: 'true',
            fromJsonToObject: () => {
              return undefined;
            }
          }
        ],
        emailId: null,
        faxNo: null,
        mobileNo: {
          primary: null,
          isdCodePrimary: null,
          isdCodeSecondary: null,
          secondary: null,
          fromJsonToObject: () => {
            return undefined;
          }
        },
        telephoneNo: {
          primary: null,
          extensionPrimary: null,
          secondary: null,
          extensionSecondary: null,
          fromJsonToObject: () => {
            return undefined;
          }
        },
        fromJsonToObject: () => {
          return undefined;
        }
      },
      education: { arabic: 'ثانويه عامه', english: 'High School' },
      personType: '',

      identity: [{ id: 3048746279, idType: 'BORDERNO' }],
      name: {
        arabic: {
          firstName: 'هبه',
          secondName: 'عبد الرحيم',
          thirdName: 'حسين',
          familyName: 'محمد',
          fromJsonToObject: () => {
            return undefined;
          }
        },
        english: { name: 'Abdulah' },
        fromJsonToObject: () => {
          return undefined;
        }
      },
      specialization: { arabic: 'الزراعة', english: 'الزراعة' },
      nationality: { arabic: 'الكويت', english: 'Kuwait' },
      personId: 1037302935,
      sex: { arabic: 'ذكر', english: 'Male' },
      userPreferences: { commPreferences: 'En', contactPreferences: ['EMAIL', 'SMS'] },
      student: false,
      prisoner: false,
      govtEmp: false,
      fromJsonToObject: () => {
        return undefined;
      }
    }
  ],
  adminFilterResponseDto: {
    nationalitiesPresent: null,
    roles: [121, 131]
  }
};
export const AdminWrapperDtoTests = {
  admins: [
    {
      roles: [3, 5, 6],
      deathDate: null,
      birthDate: null,
      role: '',
      maritalStatus: { arabic: 'اعزب', english: 'Single' },
      contactDetail: {
        currentMailingAddress: 'NATIONAL',
        emergencyContactNo: null,
        addresses: [
          {
            country: null,
            postBox: null,
            additionalNo: null,
            unitNo: null,
            detailedAddress: null,
            type: 'NATIONAL',
            city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
            buildingNo: null,
            cityDistrict: null,
            district: null,
            postalCode: null,
            streetName: 'true',
            fromJsonToObject: () => {
              return undefined;
            }
          }
        ],
        emailId: null,
        faxNo: null,
        mobileNo: {
          primary: null,
          isdCodePrimary: null,
          isdCodeSecondary: null,
          secondary: null,
          fromJsonToObject: () => {
            return undefined;
          }
        },
        telephoneNo: {
          primary: null,
          extensionPrimary: null,
          secondary: null,
          extensionSecondary: null,
          fromJsonToObject: () => {
            return undefined;
          }
        },
        fromJsonToObject: () => {
          return undefined;
        }
      },
      education: { arabic: 'ثانويه عامه', english: 'High School' },
      personType: '',

      identity: [{ id: 3048746279, idType: 'BORDERNO' }],
      name: {
        arabic: {
          firstName: 'هبه',
          secondName: 'عبد الرحيم',
          thirdName: 'حسين',
          familyName: 'محمد',
          fromJsonToObject: () => {
            return undefined;
          }
        },
        english: { name: 'Abdulah' },
        fromJsonToObject: () => {
          return undefined;
        }
      },
      specialization: { arabic: 'الزراعة', english: 'الزراعة' },
      nationality: { arabic: 'الكويت', english: 'Kuwait' },
      personId: 1037302935,
      sex: { arabic: 'ذكر', english: 'Male' },
      userPreferences: { commPreferences: 'Ar', contactPreferences: ['EMAIL', 'SMS'] },
      student: false,
      prisoner: false,
      govtEmp: false,
      fromJsonToObject: () => {
        return undefined;
      }
    }
  ],
  adminFilterResponseDto: {
    nationalitiesPresent: null,
    roles: [121, 131]
  }
};
export const AdminTestData: AdminDto[] = [
  {
    roles: [3, 5, 6],
    deathDate: null,
    birthDate: null,
    role: '',
    maritalStatus: { arabic: 'اعزب', english: 'Single' },
    contactDetail: {
      currentMailingAddress: 'NATIONAL',
      emergencyContactNo: null,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: '',
      lastModifiedDate: null,
      addresses: [
        {
          country: null,
          postBox: null,
          additionalNo: null,
          unitNo: null,
          detailedAddress: null,
          type: 'NATIONAL',
          city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
          buildingNo: null,
          cityDistrict: null,
          district: null,
          postalCode: null,
          streetName: 'true',
          fromJsonToObject: () => {
            return undefined;
          }
        }
      ],
      emailId: null,
      faxNo: null,
      mobileNo: {
        primary: null,
        isdCodePrimary: null,
        isdCodeSecondary: null,
        secondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      telephoneNo: {
        primary: null,
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    education: { arabic: 'ثانويه عامه', english: 'High School' },
    personType: '',

    identity: [{ id: 3048746279, idType: 'BORDERNO' }],
    name: {
      arabic: {
        firstName: 'هبه',
        secondName: 'عبد الرحيم',
        thirdName: 'حسين',
        familyName: 'محمد',
        fromJsonToObject: () => {
          return undefined;
        }
      },
      english: { name: 'Abdulah' },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    specialization: { arabic: 'الزراعة', english: 'الزراعة' },
    nationality: { arabic: 'الكويت', english: 'Kuwait' },
    personId: 1037302935,
    sex: { arabic: 'ذكر', english: 'Male' },
    userPreferences: { commPreferences: 'En', contactPreferences: ['EMAIL', 'SMS'] },
    student: false,
    prisoner: false,
    govtEmp: false,
    socialInsuranceNumber: [],
    fromJsonToObject: () => {
      return undefined;
    }
  },
  {
    roles: [3, 5, 6],
    deathDate: null,
    birthDate: null,
    role: '',
    maritalStatus: { arabic: 'اعزب', english: 'Single' },
    contactDetail: {
      currentMailingAddress: 'NATIONAL',
      emergencyContactNo: null,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: '',
      lastModifiedDate: null,
      addresses: [
        {
          country: null,
          postBox: null,
          additionalNo: null,
          unitNo: null,
          detailedAddress: null,
          type: 'NATIONAL',
          city: { arabic: 'رأس تنورة', english: 'RasTanorh' },
          buildingNo: null,
          cityDistrict: null,
          district: null,
          postalCode: null,
          streetName: 'true',
          fromJsonToObject: () => {
            return undefined;
          }
        }
      ],
      emailId: null,
      faxNo: null,
      mobileNo: {
        primary: null,
        isdCodePrimary: null,
        isdCodeSecondary: null,
        secondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      telephoneNo: {
        primary: null,
        extensionPrimary: null,
        secondary: null,
        extensionSecondary: null,
        fromJsonToObject: () => {
          return undefined;
        }
      },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    education: { arabic: 'ثانويه عامه', english: 'High School' },
    personType: '',

    identity: [{ id: 3048746279, idType: 'BORDERNO' }],
    name: {
      arabic: {
        firstName: 'هبه',
        secondName: 'عبد الرحيم',
        thirdName: 'حسين',
        familyName: 'محمد',
        fromJsonToObject: () => {
          return undefined;
        }
      },
      english: { name: 'Abdulah' },
      fromJsonToObject: () => {
        return undefined;
      }
    },
    specialization: { arabic: 'الزراعة', english: 'الزراعة' },
    nationality: { arabic: 'الكويت', english: 'Kuwait' },
    personId: 1037302935,
    sex: { arabic: 'ذكر', english: 'Male' },
    userPreferences: { commPreferences: 'Ar', contactPreferences: ['EMAIL', 'SMS'] },
    student: false,
    prisoner: false,
    govtEmp: false,
    socialInsuranceNumber: [],
    fromJsonToObject: () => {
      return undefined;
    }
  }
];
export const TransactionFeedbackData = {
  message: {
    english: 'Successfull',
    arabic: 'Successfull'
  },
  successMessage: {
    english: 'SUCCESS',
    arabic: 'Successfull'
  },
  transactionId: 123456
};
