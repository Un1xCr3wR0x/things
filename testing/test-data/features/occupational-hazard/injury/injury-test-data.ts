import { FormBuilder, Validators } from '@angular/forms';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export const injuryFeedbackTestData = {
  injuryNo: 1002345550,
  status: { arabic: 'معـلّـق', english: 'Pending' },
  transactionMessage: {
    arabic: 'تم استلام بلاغ الإصابة المهنية. رقم الطلب:269742',
    english: 'Report occupational injury is successfully submitted. Transaction Number: 269742'
  }
};
export const injuryStatisticsTestData = {
  previousInjuryDate: {
    gregorian: '2019-08-02T00:00:00.000Z',
    hijiri: '1440-12-01'
  },
  previousInjuryStatus: {
    arabic: 'رفض',
    english: 'Rejected'
  },
  lastYearInjuryCount: 2,
  totalInjuryCount: 3
};
export const injuryRejectionTestData = {
  responseMessage: {
    arabic: 'تم تقديم طلبك لمعاملة رفض الإصابة بنجاح',
    english: 'Your request for rejecting the Injury Transaction is submitted successfully'
  },
  code: 'ERR-234',
  message: '',
  referenceNo: [23425, 24254]
};
export const reopenReasonOthers = {
  reason: {
    arabic: '',
    english: 'Others'
  }
};
export const reopenReason = {
  reason: {
    arabic: '',
    english: 'Modifying injury data '
  }
};
export const rejectionDetailsData = {
  comments: 'fesgdfg',
  rejectionReason: {
    arabic: '',
    english: 'Wrong Document'
  },
  parentInjuryRejectionReason: {
    arabic: '',
    english: 'Wrong Document'
  },
  returnReason: {
    arabic: '',
    english: 'Wrong Document'
  },
  rejectionIndicator: true
};
export const lovListMockData = {
  items: [
    {
      code: 1001,
      sequence: 1,
      value: {
        arabic: 'Others',
        english: 'Others'
      }
    },
    {
      code: 1002,
      sequence: 2,
      value: {
        arabic: 'arabic',
        english: 'english'
      }
    }
  ]
};
export const inspectionListMockData = {
  value: [
    {
      arabic: 'arabic',
      english: 'english'
    },
    {
      arabic: 'arabic',
      english: 'english'
    }
  ]
};

export const injuryDetailsTestData = {
  injuryDetailsDto: {
    injuryStatus: {
      arabic: 'معـلّـق',
      english: 'pending'
    },
    injuryTime: '00',
    reopenReason: {
      arabic: '',
      english: 'Modifying injury data '
    },
    scanDocuments: null,
    status: {
      arabic: 'معـلّـق',
      english: 'Pending'
    },
    treatmentCompleted: true,
    finalDiagnosis: 'null',
    auditStatus: 'true',
    allowancePayee: 2,
    rejectionAllowedIndicator: true,
    hasPendingChangeRequest: true,
    injuryId: 1002318957,
    workFlowStatus: 2015,
    processType: 'modify',
    injuryDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    closingDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    engagementStartDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    injuryHour: '2',
    injuryMinute: '00',
    injuryTimeAmPm: null,
    injuryToDeathIndicator: null,
    workDisabilityDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    employeeInformedDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    city: null,
    latitude: '26.443821924396136',
    longitude: '50.18751165691583',
    place: null,
    detailedPlace: 'ورشة صيانة مؤسسة ناصر الناصر منطقة المساندة لميناء',
    occupation: null,
    injuryReason: {
      arabic: 'الإصابة بواسطة شيء ملقى أو ساقط أو هابط ، مكان غير محدد ، أثناء نشاط غير محدد',
      english: 'Struck by thrown, projected or falling object, unspecified place, during unspecified activity'
    },
    deathDate: null,
    reasonForDelay: null,
    lineOfTreatment: {
      arabic: 'التعرض لقوى ميكانيكية غير حية',
      english: 'EXPOSURE TO NON-LIVING FORCES'
    },
    cityDistrict: null,
    accidentType: {
      arabic: 'التعرض لقوى ميكانيكية غير حية',
      english: 'EXPOSURE TO NON-LIVING FORCES'
    },
    autoValidationComments: [],
    employerInformedDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    emergencyContactNo: {
      primary: '142542354364',
      secondary: '131241235235',
      isdCodePrimary: 'sa',
      isdCodeSecondary: '+944',
      fromJsonToObject: () => {
        return undefined;
      }
    },
    governmentSector: null,
    engagementId: null,
    comments: null,
    injuryNo: 1002323413,
    injuryType: {
      arabic: 'الإصابة',
      english: 'Injury'
    },
    country: null,
    establishmentName: {
      arabic: 'الشركة السعودية للكهرباء - منطقة اعمال الوسطى',
      english: 'Government Establisment'
    },
    establishmentRegNo: 200025555,
    reportingViolationCodes: [],
    requiredDocuments: [],
    rejectionReason: null,
    rejectInitiatedDate: null,
    reopenInitiatedDate: null
  },
  modifiedInjuryDetails: {
    injuryStatus: {
      arabic: 'معـلّـق',
      english: 'Pending'
    },
    injuryTime: '00',
    reopenReason: {
      arabic: '',
      english: 'Modifying injury data '
    },
    scanDocuments: null,
    status: {
      arabic: 'معـلّـق',
      english: 'Pending'
    },
    treatmentCompleted: true,
    finalDiagnosis: 'null',
    auditStatus: 'true',
    allowancePayee: 2,
    rejectionAllowedIndicator: true,
    hasPendingChangeRequest: true,
    injuryId: 1002318957,
    workFlowStatus: 2015,
    processType: 'modify',
    injuryDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    closingDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    engagementStartDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    injuryHour: '2',
    injuryMinute: '00',
    injuryTimeAmPm: null,
    injuryToDeathIndicator: null,
    workDisabilityDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    employeeInformedDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    city: null,
    latitude: '26.443821924396136',
    longitude: '50.18751165691583',
    place: null,
    detailedPlace: 'ورشة صيانة مؤسسة ناصر الناصر منطقة المساندة لميناء',
    occupation: null,
    injuryReason: {
      arabic: 'الإصابة بواسطة شيء ملقى أو ساقط أو هابط ، مكان غير محدد ، أثناء نشاط غير محدد',
      english: 'Struck by thrown, projected or falling object, unspecified place, during unspecified activity'
    },
    deathDate: null,
    reasonForDelay: null,
    lineOfTreatment: {
      arabic: 'التعرض لقوى ميكانيكية غير حية',
      english: 'EXPOSURE TO NON-LIVING FORCES'
    },
    cityDistrict: null,
    accidentType: {
      arabic: 'التعرض لقوى ميكانيكية غير حية',
      english: 'EXPOSURE TO NON-LIVING FORCES'
    },
    autoValidationComments: [],
    employerInformedDate: {
      gregorian: new Date(),
      hijiri: '1441-03-02'
    },
    emergencyContactNo: {
      primary: '142542354364',
      secondary: '131241235235',
      isdCodePrimary: 'sa',
      isdCodeSecondary: '+944',
      fromJsonToObject: () => {
        return undefined;
      }
    },
    governmentSector: null,
    engagementId: null,
    comments: null,
    injuryNo: 1002323413,
    injuryType: {
      arabic: 'الإصابة',
      english: 'Injury'
    },
    country: null,
    establishmentName: {
      arabic: 'الشركة السعودية للكهرباء - منطقة اعمال الوسطى',
      english: 'Government Establisment'
    },
    establishmentRegNo: 200025555,
    reportingViolationCodes: [],
    requiredDocuments: [],
    rejectionReason: null,
    rejectInitiatedDate: null,
    reopenInitiatedDate: null
  },
  establishmentRegNo: 10000602
};
export const transactionReferenceDatas = {
  transactionType: 'Add Injury',
  transactionStepStatus: 'Reject',
  referenceNo: 10276,
  rejectionReason: null,
  comments: null,
  createdDate: {
    gregorian: '2019-09-17',
    hijiri: '1441-01-17'
  }
};
export const reqDocList = {
  requiredDocumentsList: [
    {
      arabic: 'إعتماد',
      english: 'Approved'
    }
  ]
};
export const validatorActionData = {
  comments: 'wsg',
  requiredList: [],
  requiredDocumentsList: [
    {
      arabic: 'إعتماد',
      english: 'Approved'
    }
  ],
  formData: {
    closingStatus: {
      arabic: 'إعتماد',
      english: 'Approved'
    },
    action: 'REJECT',
    taskId: '1315235',
    outcome: 'UPDATE',
    comments: 'qrwtwe',
    selectedInspection: {
      arabic: 'إعتماد',
      english: 'Approved'
    },
    registrationNo: 10000602,
    rejectionReason: {
      arabic: 'إعتماد',
      english: 'Approved'
    },
    parentInjuryRejectionReason: {
      arabic: 'إعتماد',
      english: 'Approved'
    },
    returnReason: {
      arabic: 'إعتماد',
      english: 'Approved'
    },
    status: 'Approved',
    user: 'Avijit',
    route: 'home/oh',
    penaltyIndicator: 3,
    engagementAction: null,
    referenceNo: null,
    resourceType: null,
    requiredDocumentsList: [
      {
        arabic: 'إعتماد',
        english: 'Approved'
      }
    ],
    rejectionIndicator: true
  }
};
export const documentArray = [
  {
    documentContent: 'jhfjhfjhfjhfjf',
    documentType: null,
    name: {
      english: 'Request Form',
      arabic: 'Nipid'
    },
    required: false,
    reuse: false,
    started: false,
    valid: false,
    contentId: null,
    uploaded: false,
    sequenceNumber: 1,
    isUploading: false,
    size: null,
    isContentOpen: false,
    percentageLoaded: 0,
    icon: null,
    businessKey: null,
    transactionId: null,
    uploadFailed: false,
    isScanning: false,
    fileName: 'test'
  },
  {
    documentContent: 'jhkjhkh',
    documentType: null,
    name: {
      english: 'Dipin',
      arabic: 'Nipid'
    },
    required: false,
    reuse: false,
    started: false,
    valid: false,
    contentId: null,
    uploaded: false,
    sequenceNumber: 2,
    isUploading: false,
    size: null,
    isContentOpen: false,
    percentageLoaded: 0,
    icon: null,
    businessKey: null,
    transactionId: null,
    uploadFailed: false,
    isScanning: false,
    fileName: 'test'
  }
];
export const contactDatas = {
  primary: '0510220145',
  secondary: '0510220145',
  isdCodePrimary: 'sa',
  isdCodeSecondary: null
};
export const personDataReim = {
  personId: 1031169904,
  deathDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: null
  },
  lifeStatus: '',
  specialization: {
    arabic: 'الهند',
    english: 'India'
  },
  nationality: {
    arabic: 'الهند',
    english: 'India'
  },
  identity: [
    {
      idType: 'IQAMA',
      iqamaNo: 2408227102,
      borderNo: '12345',
      expiryDate: null
    }
  ],
  name: {
    arabic: {
      firstName: 'محمد',
      secondName: 'رشاد',
      thirdName: 'مصطفى',
      familyName: 'ابو هنديه',
      fromJsonToObject: () => {
        return undefined;
      }
    },
    english: {
      name: 'Khalid hossaini',
      fromJsonToObject: () => {
        return undefined;
      }
    },
    fromJsonToObject: () => {
      return undefined;
    }
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  },
  education: {
    arabic: 'بكالوريس',
    english: 'Bachelor'
  },
  birthDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: null
  },
  maritalStatus: {
    arabic: 'اعزب',
    english: 'Single'
  },
  contactDetail: {
    addresses: [
      {
        type: 'POBOX',
        country: {
          arabic: 'السعودية ',
          english: 'Saudi Arabia'
        },
        buildingNo: '1234',
        district: 'alhamid',
        streetName: 'raizo',
        additionalNo: '1234',
        unitNo: '12',
        detailedAddress: 'jahdjsh',
        city: {
          arabic: 'الجابرية',
          english: 'Aljabryah'
        },
        postalCode: '00047',
        postBox: '088909',
        cityDistrict: {
          arabic: 'ينبع',
          english: 'District0302'
        },
        fromJsonToObject: () => {
          return undefined;
        }
      }
    ],
    emailId: {
      primary: 'APETER@gosi.gov.sa',
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
    mobileNo: {
      primary: '0510220145',
      secondary: '0510220145',
      isdCodePrimary: 'sa',
      isdCodeSecondary: null,
      fromJsonToObject: () => {
        return undefined;
      }
    },
    faxNo: null,
    currentMailingAddress: 'POBOX',
    mobileNoVerified: false,
    emergencyContactNo: null,
    fromJsonToObject: () => {
      return undefined;
    }
  },
  userPreference: {
    commPreferences: 'En'
  },
  prisoner: false,
  student: false,
  govtEmp: false,
  personType: 'Saudi_Person'
};
export class Form {
  engNameMaxLength = 60;
  arabicNameMaxLength = 80;
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createAuditForm() {
    return this.fb.group({
      auditComments: [null],
      auditReason: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  public createRejectInjuryForm() {
    return this.fb.group({
      comments: 'fdf',
      checkBoxFlag: [false],
      rejectionReason: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  public createEngagementForm() {
    return this.fb.group({
      engagementWhenInjuryOccured: this.fb.group({
        english: ['ff', { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  public getAmountForm() {
    return this.fb.group({
      invoiceAmount: [1315235],
      vatAmount: [10]
    });
  }

  public createAllowanceDetailsForm() {
    return this.fb.group({
      taskId: ['1315235'],
      user: ['Avijit'],
      status: ['Approved']
    });
  }
  public createRejectForm() {
    return this.fb.group({
      comments: '',
      checkBoxFlag: [false],
      rejectionReason: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  public createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: ['Contributor'],
        arabic: [null]
      })
    });
  }
  public createInjuryModalForm() {
    return this.fb.group({
      comments: 'ff',
      document: this.fb.group({
        english: [''],
        arabic: ['']
      })
    });
  }
  public createCloseInjuryForm() {
    return this.fb.group({
      injuryStatus: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  public createPayeeListForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: ['Contributor'],
        arabic: null
      })
    });
  }
  //Method to get the contact details in a form
  public getContactMockForm() {
    return this.fb.group({
      contactDetail: this.fb.group({
        telephoneNo: this.fb.group({
          primary: [
            '',
            {
              validators: Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]+')]),
              updateOn: 'blur'
            }
          ],
          extensionPrimary: ['sa']
        }),
        emailId: this.fb.group({
          primary: ['xxx@gmail.com']
        }),
        mobileNo: this.fb.group({
          primary: [987654324],
          secondary: [987654324],
          isdCodePrimary: ['sa', { updateOn: 'blur' }],
          isdCodeSecondary: [null]
        }),
        mobileNoVerified: [false]
      })
    });
  }
  createInjuryForm() {
    return this.fb.group({
      injuryDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      governmentSector: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      datePicker: this.fb.group({
        injuryHour: [null],
        injuryMinute: [null]
      }),
      workDisabilityDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      employeeInformedDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      place: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      deathDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      detailedPlace: [null],
      occupation: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      employerInformedDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      accidentType: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      injuryReason: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      comments: [null],
      reasonForDelay: [null],
      injuryToDeathIndicator: [false, { updateOn: blur }],
      emergencyContactNo: [null]
    });
  }
  createUploadForm() {
    return this.fb.group({
      checkBoxFlag: [false],
      comments: []
    });
  }
  public getYesorNoList() {
    return this.fb.group({
      isTreatmentWithinSaudiArabia: this.fb.group({
        english: ['Yes'],
        arabic: null
      })
    });
  }
}
