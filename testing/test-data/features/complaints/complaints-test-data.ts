import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { docList } from '..';
import {
  bindToObject,
  DocumentItem,
  AdminDto,
  RouterData,
  GosiCalendar,
  WorkFlowActions,
  emailValidator,
  BilingualText
} from '@gosi-ui/core';
export class ValidatorRoutingServicestub {
  setRouterToken() {}
}
export class ContactForms {
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createContactForm(): FormGroup {
    return this.fb.group({
      category: this.fb.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      type: this.createTypeForm(),
      subType: this.createTypeForm(),
      message: [null, Validators.compose([Validators.required])]
    });
  }
  public ActionForm(): FormGroup {
    return this.fb.group({
      comments: [null, Validators.compose([Validators.required])],
      head: [null, Validators.compose([Validators.required])],
      clerkId: [null, Validators.compose([Validators.required])],
      departmentId: [null, Validators.compose([Validators.required])]
    });
  }
  public CommentForm(): FormGroup {
    return this.fb.group({
      csrComment: [null, Validators.compose([Validators.required])]
    });
  }
  public OtpForm(): FormGroup {
    return this.fb.group({
      otp: [null]
    });
  }
  public ItTicketForm(): FormGroup {
    return this.fb.group({
      itsmForm: this.fb.group({
        reason: [null, Validators.compose([Validators.required])],
        note: [null, Validators.compose([Validators.required])]
      })
    });
  }
  public searchForm(): FormGroup {
    return this.fb.group({
      searchKeyForm: this.fb.group({
        searchKey: [null]
      }),
      AdvsearchKeyForm: this.fb.group({
        personIdentifier: [null],
        registrationNo: [null]
      })
    });
  }
  public ContactListForm(): FormGroup {
    return this.fb.group({
      categoryForm: this.fb.group({
        category: this.fb.group({
          english: ['Complaint', Validators.compose([Validators.required])],
          arabic: ['null']
        }),
        type: this.fb.group({
          english: ['Complaint', Validators.compose([Validators.required])],
          arabic: ['null']
        }),
        subType: this.fb.group({
          english: ['Disconnect', Validators.compose([Validators.required])],
          arabic: ['null']
        }),
        message: ['comment', Validators.compose([Validators.required])]
      })
    });
  }
  public ContactTypeForm(): FormGroup {
    return this.fb.group({
      contactForm: this.fb.group({
        category: this.fb.group({
          english: [null, Validators.compose([Validators.required])],
          arabic: [null]
        }),
        type: this.fb.group({
          english: [null, Validators.compose([Validators.required])],
          arabic: [null]
        }),
        subType: this.fb.group({
          english: [null, Validators.compose([Validators.required])],
          arabic: [null]
        }),
        message: [null, Validators.compose([Validators.required])]
      })
    });
  }
  createContactTypeForm(): FormGroup {
    return this.fb.group({
      typeForm: this.fb.group({
        name: [null, Validators.compose([Validators.required])],
        idType: this.fb.group({
          english: [null, Validators.compose([Validators.required])],
          arabic: [null]
        }),
        mobileNo: this.fb.group({
          primary: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
              updateOn: 'blur'
            }
          ],
          isdCodePrimary: [null, { updateOn: 'blur' }]
        }),
        email: [null, Validators.compose([Validators.required, emailValidator, Validators.maxLength(35)])],
        idNumber: [null]
      })
    });
  }
  public TransactionTypeForm(): FormGroup {
    return this.fb.group({
      category: this.fb.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      type: this.createTypeForm(),
      subType: this.createTypeForm(),
      priority: this.createTypeForm()
    });
  }
  public SuggestionTypeForm(): FormGroup {
    return this.fb.group({
      category: this.createTypeForm(),
      subCategory: this.createTypeForm()
    });
  }
  public createTypeForm(): FormGroup {
    return this.fb.group({
      english: [null, Validators.compose([Validators.required])],
      arabic: [null]
    });
  }
  public createFindUsForm(): FormGroup {
    return this.fb.group({
      office: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
}
export class PriorirtyForm {
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createPriorirtyForm(): FormGroup {
    return this.fb.group({
      priority: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: null
      })
    });
  }
  public createTypeForm(): FormGroup {
    return this.fb.group({
      english: [null, Validators.compose([Validators.required])],
      arabic: [null]
    });
  }
}

export const documentTestArray = docList.map(doc => bindToObject(new DocumentItem(), doc));
export const ComplaintRequestTest = {
  approvedBy: ' ',
  approvedRole: ' ',
  category: 'SUGGESTIONS',
  createdFor: ' ',
  createdForId: ' ',
  description: ' ',
  initiatedRole: ' ',
  initiatedBy: ' ',
  subType: 'Branch',
  type: 'Gosi Website & Taminaty',
  uuid: '93a93126-1b3e-486e-ab63-e97bb634d381'
};
export const FieldOfficeDetailsData = {
  fieldOfficeName: {
    english: 'ABAD Office',
    arabic: ' '
  },
  faxId: '123456789',
  latitude: 23.45,
  longitude: 12.34,
  serviceCenter: 'er3467',
  telephoneNumber: 'sdfsd34'
};
export const CustomerSummaryData = {
  customerName: {
    arabic: '',
    english: 'unknown'
  },
  id: {
    idType: 'iqama',
    iqamaNo: 1234567890,
    borderNo: '1234',
    expiryDate: new GosiCalendar()
  },
  contactId: '12345678',
  emailId: 'abc@gmail.com',
  customerType: 'user'
};
export const EstablishmentData = {
  organizationCategory: null,
  startDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' },
  activityType: {
    arabic: 'تشييد المباني وأعمال الهندسة المدنية',
    english: 'Activity 5.1.3'
  },
  comments: null,
  contactDetails: {
      currentMailingAddress: 'NATIONAL',
      createdBy: null,
      createdDate: null,
      lastModifiedBy: 0,
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
        streetName: 'true'
      }
    ],
    emailId: null,
    faxNo: null,
    mobileNo: {
      primary: null,
      isdCodePrimary: null,
      isdCodeSecondary: null,
      secondary: null
    },
    telephoneNo: {
      primary: null,
      extensionPrimary: null,
      secondary: null,
      extensionSecondary: null
    }
  },
  crn: {
    number: 12312,
    mciVerified: true,
    issueDate: { gregorian: new Date('2019-07-01'), hijiri: '1440-10-28' }
  },
  establishmentAccount: {
    registrationNo: null,
    paymentType: null,
    startDate: null,
    bankAccount: null
  },
  establishmentType: { arabic: 'رئيسي ', english: 'Main' },
  gccCountry: false,
  gccEstablishment: null,
  legalEntity: { arabic: 'منشأة تضامن', english: 'Partnership' },
  license: null,
  mainEstablishmentRegNo: 123456,
  molEstablishmentIds: {
    molEstablishmentId: 79636,
    molOfficeId: 5,
    molEstablishmentOfficeId: 25,
    molunId: 5742
  },
  name: { arabic: 'CRN issue date from MCI', english: null },
  nationalityCode: { arabic: 'السعودية ', english: 'Saudi Arabia' },
  navigationIndicator: null,
  proactive: true,
  recruitmentNo: 23423432,
  registrationNo: 123456,
  scanDocuments: null,
  status: 'REGISTERED',
  transactionMessage: null,
  transactionReferenceData: null,
  validatorEdited: false,
  adminRegistered: false,
  transactionTracingId: 135
};
export const TxnSUmmary = {
  entryChannel: {
    english: '',
    arabic: ''
  },
  registrationNo: '10000602',
  transactionRefNo: 104660847,
  complainant: 1022039385,
  referenceNo: 982445,
  transactionTraceId: '987654',
  category: {
    english: 'Complaint',
    arabic: ' '
  },
  createdDate: new GosiCalendar(),
  completedDate: new GosiCalendar(),
  gosiComments: '',
  transactionId: 123,
  location: new BilingualText(),
  description: 'ADCD',
  priority: {
    arabic: 'High',
    english: 'High'
  },
  status: {
    arabic: 'accepted',
    english: 'accepted'
  },
  type: {
    arabic: 'Annuity',
    english: 'Annuity'
  },
  taskId: '1234',
  subtype: {
    arabic: 'appeal',
    english: 'appeal'
  },
  channel: 'Ameen',
  fromJsonToObject: () => {
    return undefined;
  }
};
export const CustomActionsData = {
  customActions: [
    { action: 'RETURN', displayName: 'RETURN' },
    { action: 'RESOLVE', displayName: 'RESOLVE' },
    { action: 'ESCALLATE', displayName: 'ESCALLATE' },
    { action: 'REQUEST_INFORMATION', displayName: 'REQUEST_INFORMATION' }
  ]
};
export const ItTicketResponse = {
  incidentNumber: 'INC10000602'
};
export const OTPResponse = {
  message: {
    english: 'success',
    arabic: ' '
  },
  resend: true
};
export const TransactionSummaryData = {
  category: {
    english: 'Complaint',
    arabic: ' '
  },
  complaintFrom: {
    english: 'admin',
    arabic: ' '
  },
  complaintId: 1234,
  date: {
    gregorian: '2020-12-04T15:49:10.000Z',
    hijiri: '1442-04-19'
  },
  description: 'ADCD',
  priority: {
    arabic: 'High',
    english: 'High'
  },
  status: {
    arabic: 'accepted',
    english: 'accepted'
  },
  transactionId: 1234,
  transactionType: {
    arabic: 'Complaint',
    english: 'Complaint'
  }
};
export const CategoryLov = {
  value: {
    arabic: 'Complaint',
    english: 'Complaint'
  },
  code: 1234,
  sequence: 1001,
  items: [
    {
      value: {
        arabic: 'Complaint',
        english: 'Complaint'
      },
      code: 1234,
      sequence: 1001
    }
  ]
};
export const PriorityLov = {
  items: [
    {
      code: 0,
      sequence: 0,
      value: { english: 'High', arabic: 'عالي' }
    },
    {
      code: 1,
      sequence: 1,
      value: { english: 'Medium', arabic: 'متوسط' }
    },
    {
      code: 2,
      sequence: 2,
      value: { english: 'Low', arabic: 'منخفض' }
    }
  ]
};
export const departmentitemsTest = {
  items: [
    {
      value: {
        arabic: 'Economics Department',
        english: 'Economics Department'
      },
      code: 1234,
      sequence: 1001
    },
    {
      value: {
        arabic: 'IT Department',
        english: 'IT Department'
      },
      code: 1235,
      sequence: 1002
    },
    {
      value: {
        arabic: 'Finance Department',
        english: 'Finance Department'
      },
      code: 1236,
      sequence: 1003
    }
  ]
};
export const delegateTest = {
  items: [
    {
      value: {
        arabic: 'Clerk',
        english: 'Clerk'
      },
      code: 1234,
      sequence: 1001
    },
    {
      value: {
        arabic: 'Teacher',
        english: 'Teacher'
      },
      code: 1235,
      sequence: 1002
    },
    {
      value: {
        arabic: 'Doctor',
        english: 'Doctor'
      },
      code: 1236,
      sequence: 1003
    },
    {
      value: {
        arabic: 'Admin',
        english: 'Admin'
      },
      code: 1237,
      sequence: 1004
    }
  ]
};
export const ComplaintRouterTest = {
  businessKey: 1234,
  transactionTraceId: 1234,
  requestType: '',
  taskId: '',
  assigneeId: '',
  assignedRole: ''
};
export const ComplaintRouterTestData = {
  businessKey: 1234,
  transactionTraceId: 1234,
  requestType: '',
  taskId: 'asfgfdgfjhyktptitr',
  assigneeId: '',
  assignedRole: '',
  departmentId: 'dept',
  customActions: [{ action: 'DELEGATE', displayName: 'DELEGATE' }],
  deptHead: 'head'
};
export const complaintTypeUpdateRequestData = {
  subType: 'noResponse',
  type: 'Branch'
};
export const customerData = {
  customerName: {
    arabic: '',
    english: 'unknown'
  },
  id: {
    idType: 'iqama',
    iqamaNo: 1234567890,
    borderNo: '1234',
    expiryDate: new GosiCalendar()
  },
  contactId: '12345678',
  emailId: 'abc@gmail.com',
  customerType: 'user'
};
export const initializeRouterData = {
  channel: null,
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'Doctor',
  assigneeName: undefined,
  assigneeId: '12345',
  previousOwnerRole: 'Doctor',
  route: '10000602',
  resourceId: '601336235',
  tabIndicator: 12345,
  content: null,
  tabId: 1,
  transactionId: 989100,
  sourceChannel: 'qwerty',
  state: 'RETURN',
  idParams: new Map(),
  documentFetchTypes: [],
  tpaComments: [],
  customActions: [WorkFlowActions.RESUBMIT, WorkFlowActions.REQUEST_INFORMATION],
  userComment: [
    {
      comment: 'comment',
      commentScope: 'BPM',
      taskId: 'ahfkube123jhj78',
      updatedBy: { id: '12345', displayName: 'name', type: 'complaint' },
      updatedDate: '25-05-2021'
    }
  ],
  initiatorUserId: '12345',
  initiatorRoleId: 'hdfgt',
  initiatorCommentDate: '26-03-2021',
  initiatorComment: 'first comment',
  priority: 1,
  comments: [
    {
      referenceNo: 12345,
      createdDate: null,
      transactionType: 'complaint',
      bilingualComments: [
        {
          english: 'comment',
          arabic: '---'
        }
      ],
      comments: 'comment',
      rejectionReason: {
        english: 'reject',
        arabic: '---'
      },
      returnReason: {
        english: 'return',
        arabic: '---'
      },
      reopenReason: {
        english: 'open',
        arabic: '---'
      },
      transactionStepStatus: 'withdrawn',
      transactionStatus: 'completed',
      role: {
        english: 'name',
        arabic: '---'
      },
      userName: {
        english: 'name',
        arabic: '---'
      }
    }
  ],
  fromJsonToObject(json) {
    Object.keys(new RouterData()).forEach(key => {
      if (key in json) {
        if (key === 'payload' && json[key]) {
          this[key] = json[key];
          const payload = JSON.parse(json.payload);
          Object.keys(payload).forEach(payloadKey => {
            this.idParams.set(payloadKey, payload[payloadKey]);
          });
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  },
  resourceType: 'Close Injury TPA',

  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","transactionId":"3413"}]'
};
export const customerCareOfficerData = {
  channel: null,
  taskId: 'fdgdggfd-fsdfd',
  assignedRole: 'CustomerCareOfficer',
  assigneeId: '9876543',
  assigneeName: undefined,
  previousOwnerRole: 'CustomerCareOfficer',
  route: '10000602',
  resourceId: '601336235',
  tabIndicator: 543221,
  tabId: 1,
  content: null,
  transactionId: 989100,
  sourceChannel: 'rtyui',
  state: 'COMPLETED',
  idParams: new Map(),
  customActions: [WorkFlowActions.RESUBMIT, WorkFlowActions.REQUEST_INFORMATION],
  documentFetchTypes: [],
  initiatorUserId: '12345',
  initiatorRoleId: 'hdfgt',
  initiatorCommentDate: '26-03-2021',
  initiatorComment: 'first comment',
  priority: 1,
  tpaComments: [],
  userComment: [
    {
      comment: 'comment',
      commentScope: 'BPM',
      taskId: 'ahfkube123jhj78',
      updatedBy: { id: '12345', displayName: 'name', type: 'complaint' },
      updatedDate: '25-05-2021'
    }
  ],
  comments: [
    {
      referenceNo: 12345,
      createdDate: null,
      transactionType: 'complaint',
      bilingualComments: [
        {
          english: 'comment',
          arabic: '---'
        }
      ],
      comments: 'comment',
      rejectionReason: {
        english: 'reject',
        arabic: '---'
      },
      returnReason: {
        english: 'return',
        arabic: '---'
      },
      reopenReason: {
        english: 'open',
        arabic: '---'
      },
      transactionStepStatus: 'withdrawn',
      transactionStatus: 'completed',
      role: {
        english: 'name',
        arabic: '---'
      },
      userName: {
        english: 'name',
        arabic: '---'
      }
    }
  ],
  fromJsonToObject(json) {
    Object.keys(new RouterData()).forEach(key => {
      if (key in json) {
        if (key === 'payload' && json[key]) {
          this[key] = json[key];
          const payload = JSON.parse(json.payload);
          Object.keys(payload).forEach(payloadKey => {
            this.idParams.set(payloadKey, payload[payloadKey]);
          });
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  },
  resourceType: 'Enquiry',
  payload:
    '[{"socialInsuranceNo":"601336235","resource":"Enquiry","registrationNo":"10000602","channel":"gosi-online","id":"1001926370","transactionId":"8765"}]'
};
export const AdminDetailsData: AdminDto[] = [
  {
    roles: [3, 5, 6],
    deathDate: null,
    birthDate: null,
    role: '',
    maritalStatus: { arabic: 'اعزب', english: 'Single' },
    contactDetail: {
      emergencyContactNo: 12234345566,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: '',
      lastModifiedDate: null,
      currentMailingAddress: 'NATIONAL',
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
      emergencyContactNo: 12234345566,
      currentMailingAddress: 'NATIONAL',
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
