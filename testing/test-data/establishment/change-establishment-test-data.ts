import { FormBuilder, Validators } from '@angular/forms';
import {
  Channel,
  Contributor,
  CRNDetails,
  Establishment,
  EstablishmentProfile,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  IdentityTypeEnum,
  lengthValidator,
  MainEstablishmentInfo,
  Person
} from '@gosi-ui/core';
import {
  ActionTypeEnum,
  Admin,
  AdminRoleEnum,
  BalanceAmount,
  BranchEligibility,
  BranchList,
  DocumentNameEnum,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentEligibilityEnum,
  EstablishmentTypeEnum,
  EstablishmentWorkFlowStatus,
  FlagCreationTypeEnum,
  FlagDetails,
  FlagQueryParam,
  FlagRequest,
  InspectionDetails,
  LegalEntityEnum,
  NavigationIndicatorEnum,
  OHRate,
  Owner,
  RequiredUploadDocumentsResponse,
  TerminateResponse
} from '@gosi-ui/features/establishment';
import { genericContactDetails } from '../features';

export const genericCrnReponse: CRNDetails = {
  number: 1234567890,
  issueDate: { gregorian: new Date(), hijiri: '' },
  mciVerified: true
};

export const genericEstablishmentResponse: Establishment = {
  proactiveStatus: 0,
  mainCrn: undefined,
  activityType: { arabic: '', english: '' },
  authorisedPerson: null,
  registrationCompleted: false,
  name: { arabic: '', english: 'Saudi Aramco' },
  fieldOfficeName: { arabic: '', english: '' },
  nationalityCode: { arabic: '', english: '' },
  establishmentType: { arabic: '', english: EstablishmentTypeEnum.MAIN },
  legalEntity: { arabic: '', english: LegalEntityEnum.GOVERNMENT },
  registrationNo: 100011182,
  departmentNumber : null,
  lawType : { arabic: '', english: '' },
  ppaEstablishment : null,
  mainEstablishmentRegNo: 100011182,
  organizationCategory: { arabic: '', english: '' },
  recruitmentNo: 345678,
  startDate: { gregorian: new Date(), hijiri: null },
  establishmentManager: null,
  contactDetails: null,
  status: { english: EstablishmentStatusEnum.REGISTERED, arabic: 'test' },
  scanDocuments: null,
  comments: '',
  transactionMessage: null,
  proactive: false,
  navigationIndicator: null,
  gccCountry: false,
  revisionList: null,
  validatorEdited: false,
  adminRegistered: true,
  transactionTracingId: null,
  gccEstablishment: null,
  engagementInfo: {
    activeSaudiCount: 2,
    activeNonSaudiCount: 4,
    totalSaudiCount: 2,
    totalNonSaudiCount: 4
  },
  license: {
    issueDate: null,
    expiryDate: null,
    issuingAuthorityCode: null,
    number: null
  },
  establishmentAccount: {
    referenceNo: undefined,
    navigationIndicator: undefined,
    registrationNo: 123,
    bankAccount: {
      ibanAccountNo: '123',
      bankName: { arabic: '', english: '' }
    },
    lateFeeIndicator: { english: 'No', arabic: undefined },
    paymentType: { arabic: '', english: '' },
    startDate: { gregorian: new Date('1990-02-28T00:00:00.000Z'), hijiri: '1410-08-03' }
  },
  crn: {
    number: 123456,
    mciVerified: true,
    issueDate: null
  },
  molEstablishmentIds: null
};
export const establishmentResponse: Establishment = {
  proactiveStatus: 0,
  activityType: { arabic: '', english: '' },
  authorisedPerson: null,
  name: { arabic: '', english: 'Saudi Aramco' },
  fieldOfficeName: { arabic: '', english: '' },
  nationalityCode: { arabic: '', english: '' },
  establishmentType: { arabic: '', english: 'Main' },
  legalEntity: { arabic: '', english: 'Individual' },
  registrationNo: 100011182,
  departmentNumber : 1233445,
  lawType : { arabic: '', english: '' },
  registrationCompleted: false,
  mainEstablishmentRegNo: 100011182,
  ppaEstablishment : false,
  organizationCategory: { arabic: '', english: '' },
  recruitmentNo: 345678,
  startDate: null,
  establishmentManager: null,
  contactDetails: null,
  status: { english: EstablishmentStatusEnum.OPENING_IN_PROGRESS, arabic: '' },
  scanDocuments: null,
  comments: '',
  transactionMessage: null,
  proactive: false,
  navigationIndicator: null,
  revisionList: null,
  validatorEdited: false,
  adminRegistered: true,
  transactionTracingId: null,
  gccEstablishment: null,
  engagementInfo: {
    activeSaudiCount: 2,
    activeNonSaudiCount: 4,
    totalSaudiCount: 2,
    totalNonSaudiCount: 4
  },
  license: {
    issueDate: null,
    expiryDate: null,
    issuingAuthorityCode: null,
    number: null
  },
  establishmentAccount: {
    referenceNo: undefined,
    registrationNo: 123,
    navigationIndicator: undefined,
    bankAccount: {
      ibanAccountNo: '123',
      bankName: { arabic: '', english: '' }
    },
    paymentType: { arabic: '', english: '' },
    startDate: { gregorian: new Date('1990-02-28T00:00:00.000Z'), hijiri: '1410-08-03' },
    lateFeeIndicator: { english: undefined, arabic: undefined }
  },
  crn: {
    number: 123456,
    mciVerified: true,
    issueDate: null
  },
  mainCrn: undefined,
  molEstablishmentIds: {
    molEstablishmentId: 123456,
    molEstablishmentOfficeId: 123456,
    molOfficeId: 123456,
    molunId: 123456
  }
};

export const branchEligibilityResponse: BranchEligibility[] = [
  {
    key: EstablishmentEligibilityEnum.CBM,
    messages: {
      message: { arabic: 'Cannot Change Branch to main.', english: 'Cannot Change Branch to main.' },
      details: [
        {
          arabic: 'لا يمكن إكمال هذا الاجراء، يوجد طلب قيد الاجراء لفصل فرع عن المنشأة الرئيسية. رقم المعاملة: 492664',
          english:
            'A request to delink branch from a main establishment already exists for the establishment , cannot proceed. Transaction id: 492664'
        }
      ]
    },
    eligible: false
  },
  {
    key: EstablishmentEligibilityEnum.CLOSE_EST,
    messages: {
      message: { arabic: 'Cannot Change Branch to main.', english: 'Cannot Change Branch to main.' },
      details: [
        {
          arabic: 'لا يمكن إكمال هذا الاجراء، يوجد طلب قيد الاجراء لفصل فرع عن المنشأة الرئيسية. رقم المعاملة: 492664',
          english:
            'A request to delink branch from a main establishment already exists for the establishment , cannot proceed. Transaction id: 492664'
        }
      ]
    },
    eligible: true
  },
  {
    key: EstablishmentEligibilityEnum.DELINK,
    messages: {
      message: { arabic: 'Cannot Delink/Link establishment.', english: 'Cannot Delink/Link establishment.' },
      details: [
        {
          arabic: 'لا يمكن إكمال هذا الاجراء، رقم المنشأة الرئيسية المدخلة مرتبط مسبقا',
          english: 'The main establishment entered is linked, cannot proceed'
        }
      ]
    },
    eligible: false
  }
];

export const establishmentProfileResponse: EstablishmentProfile = {
  registrationNo: 110009305,
  name: { arabic: 'سعودىفرنسى/بنك', english: 'abcd' },
  recruitmentNo: null,
  mainEstablishmentRegNo: 110009305,
  status: { arabic: 'إنتهاء النشاط', english: 'CLOSED' },
  startDate: { gregorian: new Date('1973-06-01T00:00:00.000Z'), hijiri: '1393-04-29' },
  city: { arabic: 'جدة', english: 'Jeddeh' },
  establishmentType: { arabic: 'رئيسية', english: 'Main' },
  noOfBranches: 2,
  closingDate: { gregorian: new Date('1990-02-28T00:00:00.000Z'), hijiri: '1410-08-03' },
  legalEntity: { arabic: 'منشأة مساهمة', english: 'Individual' },
  nationalityCode: { arabic: 'غير سعودي', english: 'Non Saudi' },
  gccEstablishment: false
};
export const branchListItemGenericResponse: BranchList = {
  name: { arabic: 'سعودىفرنسى/بنك', english: null },
  registrationNo: 110009305,
  status: { arabic: 'إنتهاء النشاط', english: EstablishmentStatusEnum.REGISTERED },
  location: { arabic: 'جدة', english: 'Jeddeh' },
  fieldOffice: { arabic: 'جدة', english: 'Jeddeh' },
  billAmount: 102455,
  billStatus: 'Paid',
  certificateStatus: true,
  delinked: false,
  establishmentType: { arabic: 'رئيسية', english: 'Main' },
  legalEntity: {
    english: LegalEntityEnum.GOVERNMENT,
    arabic: ''
  }
};
export const branchListItemGenericResponse2: BranchList = {
  name: { arabic: 'سعودىفرنسى/بنك', english: null },
  registrationNo: 100011183,
  status: { arabic: 'إنتهاء النشاط', english: EstablishmentStatusEnum.REGISTERED },
  location: { arabic: 'جدة', english: 'Jeddeh' },
  fieldOffice: { arabic: 'جدة', english: 'Jeddeh' },
  billAmount: 102455,
  billStatus: 'Paid',
  certificateStatus: true,
  delinked: false,
  establishmentType: { arabic: 'رئيسية', english: 'Main' },
  legalEntity: {
    english: LegalEntityEnum.GOVERNMENT,
    arabic: ''
  }
};

export const genericBranchListResponse: BranchList[] = [
  branchListItemGenericResponse,
  {
    ...branchListItemGenericResponse,
    ...{ establishmentType: { arabic: 'فرعية', english: 'Branch' } }
  },
  {
    ...branchListItemGenericResponse,
    ...{ status: { arabic: 'إنتهاء النشاط', english: EstablishmentStatusEnum.CLOSED } }
  },
  {
    ...branchListItemGenericResponse,
    ...{ registrationNo: 123 }
  },
  {
    ...branchListItemGenericResponse,
    ...{ registrationNo: 1234 },
    delinked: true,
    recordActionType: ActionTypeEnum.ADD
  },
  {
    ...branchListItemGenericResponse,
    ...{ registrationNo: 12345 },
    delinked: true,
    recordActionType: ActionTypeEnum.REMOVE
  }
];

export const genericBranchListWithStatusResponse: EstablishmentBranchWrapper = {
  branchList: [
    branchListItemGenericResponse,
    {
      ...branchListItemGenericResponse,
      ...{ establishmentType: { arabic: 'فرعية', english: 'Branch' } }
    },
    {
      ...branchListItemGenericResponse,
      ...{ status: { arabic: 'إنتهاء النشاط', english: EstablishmentStatusEnum.CLOSED } }
    }
  ],
  branchStatus: {
    activeEstablishments: 0,
    openingInProgress: 0,
    closingInProgress: 0,
    totalBranches: 2,
    closedEstablishments: 0,
    gccEstablishments: 0,
    proactiveEstablishments: 0
  },
  filter: undefined
};

export const branchGenericEstablishment = {
  ...genericEstablishmentResponse,
  ...{
    establishmentType: { arabic: '', english: 'Branch' }
  }
};

export const genericGccEstablishment = {
  ...genericEstablishmentResponse,
  ...{
    gccEstablishment: {
      country: { arabic: 'فرعية', english: 'Kuwait' },
      registrationNo: '1233456',
      gccCountry: true
    },
    gccCountry: true,
    legalEntity: {
      english: LegalEntityEnum.INDIVIDUAL,
      arabic: ''
    }
  }
};
export const transactionReferenceData = {
  transactionType: 'Register Contributor',
  referenceNo: 10276,
  rejectionReason: {
    english: LegalEntityEnum.INDIVIDUAL,
    arabic: ''
  },
  comments: null,
  createdDate: {
    gregorian: '2019-09-17',
    hijiri: '1441-01-17'
  }
};
export const transactionReferenceDataTestData = {
  transactionType: 'Register Contributor',
  referenceNo: 10276,
  rejectionReason: {
    english: ['SA0380000000608010167519'],
    arabic: ['SA0380000000608010167519']
  },
  comments: null,
  createdDate: {
    gregorian: '2019-09-17',
    hijiri: '1441-01-17'
  },
  role: { arabic: 'فرعية', english: 'Kuwait' },
  userName: { arabic: 'فرعية', english: 'Kuwait' },
  bilingualComments: { arabic: 'فرعية', english: 'Kuwait' }
};
export const documentResponseItemList = [
  {
    name: { english: 'Commercial Registration', arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'passport',
    fileName: 'dfsdf',
    id: '123',
    show: true,
    required: true
  },
  {
    name: { english: 'Commercial Registration', arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'passport',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'passport',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.NATIONAL_ID_IQAMA, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'national',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.PROOF_TERMINATION, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'proof',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.AUTH_DELEGATION_LETTER, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'autth',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.OTHERS_DOCUMENT, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'other',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.TERMINATE_REQ_LETTER, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'terminate',
    fileName: 'dfsdf',
    id: '123',
    show: false
  },
  {
    name: { english: DocumentNameEnum.IBAN_PROOF_CERTIFICATE, arabic: '' },
    content: 'dfsvsdfgv',
    documentName: 'IBAN',
    fileName: 'dfsdf',
    id: '123',
    show: false
  }
];

export const mainEstablishmentMockData = {
  mainCrn: undefined,
  activityType: null,
  name: null,
  fieldOfficeName: null,
  nationalityCode: null,
  establishmentType: null,
  legalEntity: {
    english: 'Organization regional or international',
    arabic: ''
  },
  registrationNo: null,
  registrationCompleted: false,
  mainEstablishmentRegNo: null,
  organizationCategory: null,
  recruitmentNo: null,
  startDate: null,
  contactDetails: null,
  status: { english: null, arabic: null },
  scanDocuments: null,
  comments: null,
  transactionMessage: null,
  transactionReferenceData: null,
  proactive: null,
  navigationIndicator: null,
  revisionList: null,
  validatorEdited: null,
  adminRegistered: null,
  transactionTracingId: null,
  gccEstablishment: {
    country: { arabic: 'فرعية', english: 'Kuwait' },
    registrationNo: '357900',
    gccCountry: true
  },
  engagementInfo: {
    activeSaudiCount: 2,
    activeNonSaudiCount: 4,
    totalSaudiCount: 2,
    totalNonSaudiCount: 4
  },
  license: null,
  establishmentAccount: null,
  crn: null,
  molEstablishmentIds: null,
  GosiCalendar: null,
  gccCountry: true
};
export const transactionFeedbackMockData = {
  transactionId: 12345,
  successMessage: { arabic: 'فرعية', english: 'Kuwait' },
  message: { arabic: 'فرعية', english: 'Kuwait' }
};
export const patchBasicDetailsMockData = {
  activityType: {
    english: '',
    arabic: ''
  },
  nationalityCode: {
    english: '',
    arabic: ''
  },
  gccEstablishment: {
    country: { arabic: 'فرعية', english: 'Kuwait' },
    registrationNo: '357900',
    gccCountry: true
  },
  name: { arabic: 'سعودىفرنسى/بنك', english: null },
  navigationIndicator: 54,
  comments: 'hello world',
  startDate: { gregorian: new Date('201-10-01'), hijiri: '1393-04-29' },
  contentIds: ['hellooooo'],
  referenceNo: 4553,
  uuid: 'gdvsidgis9sd8789s7d987ds90'
};
export const branchWrapperResponse = {
  branchList: null,
  branchStatus: null
};

export const patchAddressDetailsMockData = {
  addresses: null,
  comments: null,
  contentIds: null,
  currentMailingAddress: null,
  navigationIndicator: 243,
  referenceNo: 5345,
  uuid: 'gdvsidgis9sd8789s7d987ds90'
};
export const patchContactDetailsMockData = {
  comments: 'hello world',
  contentIds: ['hellooooo'],
  emailId: null,
  faxNo: 'hello world',
  mobileNo: null,
  telephoneNo: null,
  navigationIndicator: 34,
  referenceNo: 4353,
  uuid: 'gdvsidgis9sd8789s7d987ds90'
};
export const patchMofDetailsMockData = {
  comments: 'hello world',
  navigationIndicator: 79,
  paymentType: true,
  referenceNo: 4353
};
export const patchLegalEntityMockData = {
  legalEntity: { arabic: 'سعودىفرنسى/بنك', english: null },
  paymentType: { arabic: 'سعودىفرنسى/بنك', english: null },
  transactionDate: { gregorian: new Date('201-10-01'), hijiri: '1393-04-29' },
  nationalityCode: { arabic: 'سعودىفرنسى/بنك', english: null },
  owners: null,
  navigationIndicator: 12341,
  comments: null,
  referenceNo: null,
  contentIds: null,
  uuid: undefined
};
export const patchIdentifierDetailsMockData = {
  license: {
    issueDate: { gregorian: new Date('201-10-01'), hijiri: '1393-04-29' },
    expiryDate: { gregorian: new Date('201-10-01'), hijiri: '1393-04-29' },
    issuingAuthorityCode: { arabic: 'سعودىفرنسى/بنك', english: null },
    number: 454456456
  },
  navigationIndicator: 54,
  recruitmentNumber: 45445356,
  comments: 'hello world',
  contentIds: ['hellooooo'],
  crn: {
    number: 454456456,
    mciVerified: false,
    issueDate: { gregorian: new Date('201-10-01'), hijiri: '1393-04-29' },
    expiryDate: { gregorian: new Date('201-10-01'), hijiri: '1393-04-29' }
  },
  uuid: 'gdvsidgis9sd8789s7d987ds90'
};
export const documentItems = {
  documentContent: 'gffg',
  documentType: 'gfgf',
  name: { arabic: '', english: 'License' },
  required: false,
  reuse: false,
  started: false,
  valid: false,
  contentId: 'dfsg',
  fileName: 'ghj',
  sequenceNumber: 123,
  uploaded: false,
  isUploading: false,
  size: 'jj',
  isContentOpen: false,
  percentageLoaded: 123,
  icon: 'jj',
  businessKey: 123,
  transactionId: '3413',
  uploadFailed: false,
  isScanning: false,
  show: true
};
export const estListResponse = [
  establishmentProfileResponse,
  {
    ...establishmentProfileResponse,
    ...{ registrationNo: 110009305 }
  }
];
export const patchBankDetailsMockData = {
  bankAccount: null,
  navigationIndicator: null,
  registrationNo: null,
  startDate: null,
  paymentType: null,
  comments: null,
  contentIds: null,
  referenceNo: null,
  uuid: 'gdvsidgis9sd8789s7d987ds90'
};
export const establishmentOwnersWrapperTestData = {
  molOwnerPersonId: [],
  owners: []
};
export const establishmentWorkFlowStatusTestData = {
  type: 'abcd',
  message: { arabic: 'مصر', english: 'abcd' },
  referenceNo: 1230,
  count: 12345,
  recordActionType: 'abcd'
};

export const genericPersonResponse = {
  personId: 1036053648,
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
  deathDate: null,
  maritalStatus: { arabic: 'الزراعة', english: 'single' },
  contactDetail: genericContactDetails,
  lifeStatus: null,
  govtEmp: false,
  role: 'contributor',
  socialInsuranceNumber: [],
  fromJsonToObject: () => {
    return undefined;
  }
};

export const genericOwnerReponse: Owner = {
  ownerId: 1002129252,
  person: genericPersonResponse,
  startDate: {
    gregorian: new Date('2007-05-01T00:00:00.000Z'),
    hijiri: '1428-04-14'
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  recordAction: 'Modify',
  bindToNewInstance: instance => {
    const owner = new Owner();
    Object.keys(instance).forEach(key => {
      if (key in new Owner()) {
        if (key === 'person') {
          owner[key] = new Person().fromJsonToObject(instance[key]);
        } else {
          owner[key] = instance[key];
        }
      }
    });
    return owner;
  }
};

export const statusErrorKeyTestData = {
  key: 'Opening in progress',
  canNavigate: true
};

export class Forms {
  mobileMinLength = 5;
  mobileMaxLength = 15;
  extensionLength = 5;
  emailMaxLength = 35;
  engNameMaxLength = 60;
  arabicNameMaxLength = 80;
  minLengthName = EstablishmentConstants.PERSON_NAME_MIN_LENGTH;
  maxLengthArabicName = EstablishmentConstants.PERSON_NAME_ARABIC_MAX_LENGTH;
  maxLengthEnglishName = EstablishmentConstants.PERSON_NAME_ENGLISH_MAX_LENGTH;
  fb: FormBuilder = new FormBuilder();
  getForm: any;
  constructor() {}
  public createMockPaymentDetailsForm() {
    return this.fb.group({
      paymentType: this.fb.group({
        arabic: [],
        english: [null]
      }),
      startDate: this.fb.group({
        gregorian: [null],
        hijiri: null
      }),
      registrationNo: [0]
    });
  }
  public createMockChangeIdentifierDetailsForm() {
    return this.fb.group({
      license: this.fb.group({
        expiryDate: this.fb.group({
          gregorian: [null],
          hijiri: ['']
        }),
        issueDate: this.fb.group({
          gregorian: [null],
          hijiri: ['']
        }),
        issuingAuthorityCode: this.fb.group({
          arabic: [],
          english: [null]
        }),
        number: [null]
      }),
      recruitmentNo: [123456],
      navigationIndicator: '11',
      comments: ''
    });
  }
  public createMockEditBasicDetailsForm() {
    return this.fb.group({
      name: this.fb.group({
        arabic: [null],
        english: [null]
      }),
      activityType: this.fb.group({
        arabic: [],
        english: [null]
      }),
      navigationIndicator: 11,
      comments: ''
    });
  }
  public createMockEditContactDetailsForm() {
    return this.fb.group({
      comments: ''
    });
  }
  public createMockSafetyDetailsForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      referenceNo: [null],
      action: [null],
      establishmentAction: [null],
      registrationNo: [null],
      contributionRate: this.fb.group({
        english: [
          2,
          {
            validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        arabic: [null]
      }),
      effectiveStartDate: this.fb.group({
        gregorian: new Date(),
        hijri: ['']
      })
    });
  }

  public createMockEditAddressDetailsForm() {
    return this.fb.group({
      comments: '',
      currentMailingAddress: ''
    });
  }

  public createMockEditBankDetailsForm() {
    return this.fb.group({
      ibanAccountNo: [null],
      bankName: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      navigationIndicator: NavigationIndicatorEnum.CSR_CHANGE_BANK_DETAILS_SUBMIT,
      comments: ''
    });
  }
  public createReinspectionForm() {
    return this.fb.group({
      comments: '',
      declaration: ''
    });
  }
  public createAdminForm() {
    return new FormBuilder().group({
      isVerified: true,
      isSaved: false,
      role: 'admin',
      personExists: true,
      roleType: '',
      assignedRole: '',
      checkBoxFlag: false,
      comments: '',
      referenceNo: '',
      contactDetail: this.fb.group({
        telephoneNo: this.fb.group({
          primary: [
            '',
            {
              validators: Validators.compose([
                Validators.maxLength(this.mobileMaxLength),
                Validators.pattern('[0-9]+')
              ]),
              updateOn: 'blur'
            }
          ],
          extensionPrimary: [
            '',
            {
              validators: Validators.compose([lengthValidator(this.extensionLength), Validators.pattern('[0-9]+')]),
              updateOn: 'blur'
            }
          ]
        }),
        emailId: this.fb.group({
          primary: [
            '',
            {
              validators: Validators.compose([Validators.email, Validators.maxLength(this.emailMaxLength)]),
              updateOn: 'blur'
            }
          ]
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
        mobileNoVerified: [false]
      })
    });
  }
  public createMockAdminForm() {
    return new FormBuilder().group({
      isVerified: false,
      isSaved: false,
      role: 'admin',
      personExists: true,
      roleType: '',
      assignedRole: '',
      checkBoxFlag: false,
      comments: '',
      referenceNo: ''
    });
  }
  public personForm() {
    const fb = new FormBuilder();
    return fb.group({
      name: this.fb.group({
        arabic: this.fb.group({
          firstName: [
            null,
            {
              validators: Validators.compose([
                Validators.required,
                Validators.minLength(this.minLengthName),
                Validators.maxLength(this.maxLengthArabicName)
              ]),
              updateOn: 'blur'
            }
          ],
          secondName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.maxLengthArabicName)]),
              updateOn: 'blur'
            }
          ],
          thirdName: [
            null,
            {
              validators: Validators.compose([Validators.maxLength(this.maxLengthArabicName)]),
              updateOn: 'blur'
            }
          ],
          familyName: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.maxLength(this.maxLengthArabicName)]),
              updateOn: 'blur'
            }
          ]
        }),
        english: this.fb.group({
          name: [
            null,
            {
              validators: Validators.compose([
                Validators.minLength(this.minLengthName),
                Validators.maxLength(this.maxLengthEnglishName)
              ]),
              updateOn: 'blur'
            }
          ]
        })
      }),
      sex: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
      // startDate:    this.fb.group({
      //   gregorian: [
      //     null
      //   ],
      //   hijiri: null
      // }),

      // endDate:
      // this.fb.group({
      //   gregorian: [
      //     null
      //   ],
      //   hijiri: null
      // })
    });
  }
  public createMockFlagForm() {
    return new FormBuilder().group({
      flagType: this.fb.group({
        arabic: [],
        english: [
          'Stop gosi Certifictae',
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      startDate: this.fb.group({
        gregorian: [
          '2019-05-01T00:00:00.000Z',
          { validators: Validators.compose([Validators.required]), updateOn: 'blur' }
        ],
        hijiri: null
      }),
      endDate: this.fb.group({
        gregorian: [null, { updateOn: 'blur' }],
        hijiri: null
      }),
      reason: this.fb.group({
        arabic: [],
        english: [
          'test',
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      justification: [
        'test',
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      comments: '',
      referenceNo: 123456
    });
  }
}

export class AddressDcComponentMock {
  getAddressValidity(): boolean {
    return true;
  }
}
export const mobileNoTestData = {
  primary: 6565675675,
  secondary: null,
  isdCodePrimary: null,
  isdCodeSecondary: null
};
export const nameRes = {
  arabic: {
    familyName: 'first',
    firstName: 'second',
    secondName: 'third',
    thirdName: 'four'
  },
  english: {
    name: 'string'
  },
  fromJsonToObject: {}
};

export const biNameRes = {
  arabic: 'second third four first',
  english: 'string'
};
export const BPMUpdateRequestTestData = {
  taskId: 'abcd',
  outcome: 'abcd',
  comments: 'abcd',
  registrationNo: 123,
  rejectionReason: '',
  returnReason: '',
  status: 'abcd',
  user: 'abcd',
  route: 'abcd',
  penaltyIndicator: 123,
  engagementAction: 'abcd',
  referenceNo: 'abcd',
  resourceType: 'abcd'
};

export const BranchListMockData = {
  registrationNo: 123456,
  name: {
    english: 'Test',
    arabic: ''
  },
  location: {
    english: 'Dammam',
    arabic: ''
  },
  status: {
    english: 'Registered',
    arabic: ''
  },
  establishmentType: {
    english: 'Branch',
    arabic: ''
  },
  closingDate: null,
  billStatus: '',
  billAmount: null,
  legalEntity: {
    english: '',
    arabic: ''
  },
  certificateStatus: false
};

export const genericEstablishmentRouterData: EstablishmentRouterData = {
  assignedRole: '',
  previousOwnerRole: '',
  referenceNo: 123456,
  fromJsonToObject: () => undefined,
  registrationNo: 123456,
  resetRouterData: () => undefined,
  resourceType: '',
  channel: Channel.FIELD_OFFICE,
  setRouterDataToEstablishmenRouterData: () => undefined,
  tabIndicator: 0,
  taskId: '',
  user: '',
  flagId: undefined,
  inspectionId: undefined,
  comments: []
};

export const genericAdminResponse: Admin = {
  person: genericPersonResponse,
  roles: [{ english: AdminRoleEnum.SUPER_ADMIN, arabic: '' }]
};
export const branchesWithRoleTestData: Array<{ registrationNo: number; admin: Admin }> = [
  { registrationNo: 123456, admin: genericAdminResponse }
];

export const personFormData = {
  name: {
    arabic: {
      firstName: 'الرياض',
      secondName: 'الرياض',
      thirdName: 'الرياض',
      familyName: 'الرياض'
    },
    english: {
      name: 'RIBL'
    }
  },
  sex: {
    arabic: 'ذكر',
    english: 'Male'
  }
  // startDate: { gregorian: new Date('2019-05-01T00:00:00.000Z'), hijiri: '' },
  // endDate: { gregorian: new Date('2020-05-01T00:00:00.000Z'), hijiri: '' }
};

export const mockBalanceAmount: BalanceAmount = {
  outStandingAmount: 0,
  unBilledViolationAmount: 0,
  unBilledRejectedOHAmount: 0,
  unBilledAdjustments: 0,
  unBilledContributions: 0,
  unBilledPenalty: 0,
  unBilledAdjustmentsPenalty: 0,
  unBilledViolationAdjustments: 0,
  creditBalance: undefined,
  billedAmount: 0
};

export const genericInspectionResponse: InspectionDetails = {
  inspectionDecision: [
    {
      name: 'InspectionType',
      value: 'SafetyCheck',
      comments: 'asdas'
    },
    {
      name: 'InspectionType',
      value: 'SafetyCheck',
      comments: 'asdas'
    }
  ],
  inspectionId: null,
  inspectionRefNo: 'GOSI/SC/2020/5291',
  previousVisitDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
  reInspectionDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
  inspectionRequestdate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
  inspectionTypeInfo: {
    type: 'SC',
    status: 'Initiated',
    reason: null,
    registrationNumber: 123123,
    socialInsuranceNumber: 123234435,
    injuryID: 35434
  },
  origin: null
};

export const genericOhRateResponse: OHRate = {
  disableReInspection: false,
  currentOhRate: 2,
  applicableRates: [2, 3],
  compliant: false,
  baseRate: undefined,
  ohRateHistory: [
    {
      contributionPercentage: 4,
      startDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
      endDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' }
    },
    {
      contributionPercentage: 3,
      startDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
      endDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' }
    }
  ],
  latestInspectionEntity: genericInspectionResponse,
  sameMonthRequest: false,
  ohRateConsecutiveFour: false,
  punishmentPeriodEndDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
  inspectionId: 123
};

export const requiredUploadDocumentResponseMock: RequiredUploadDocumentsResponse = {
  fieldActivityNo: null,
  contributors: [],
  dateOfSubmission: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
  inspectionDate: { gregorian: new Date('2020-12-01T07:32:28.000Z'), hijiri: '1442-04-16' },
  inspectedBy: 'sdff',
  inspectorName: 'rtyy'
};

export const terminateResponseMock: TerminateResponse = {
  // blacklisted:false,
  activeFlags: 2,
  pendingTransactions: 0,
  debit: false,
  hasActiveContributors: false,
  balance: mockBalanceAmount,
  numberOfContributors: 0,
  message: null,
  successMessage: null,
  transactionId: 123,
  hasProactiveContributors: false,
  paymentType: undefined,
  hasActiveBranches: false
};
export const establishmentData = {
  registrationNo: 110000103,
  name: {
    arabic: 'البنك الاهلي التجاري',
    english: 'National Commercial Bank'
  },
  legalEntity: {
    arabic: 'منشأة مساهمة',
    english: 'Stock Share Company'
  },
  nationalityCode: {
    arabic: 'السعودية ',
    english: 'Saudi Arabia'
  },
  recruitmentNo: 7000025887,
  mainEstablishmentRegNo: 110000103,
  activityType: {
    arabic: 'أنشطة أخرى من البنوك التجارية ',
    english: 'Other activities of commercial banks'
  },
  status: {
    arabic: 'مسجلة',
    english: 'Registered'
  },
  gccCountry: false,
  crn: {
    number: 4030001588,
    issueDate: {
      gregorian: '1957-07-25T00:00:00.000Z',
      hijiri: '1376-12-27'
    },
    mciVerified: false
  },
  license: null,
  startDate: {
    gregorian: '1973-02-04T00:00:00.000Z',
    hijiri: '1393-01-01'
  },
  contactDetails: {
    addresses: [
      {
        type: 'NATIONAL',
        city: {
          arabic: 'الرياض',
          english: 'Riyadh'
        },
        buildingNo: '4',
        postalCode: '11452',
        district: 'الفيصليه',
        streetName: 'بجوار النقل الجماعى',
        additionalNo: null,
        unitNo: null,
        cityDistrict: { arabic: 'الرياض', english: 'District0101' }
      }
    ],
    emailId: { primary: 'noreply@gosi.gov.sa' },
    telephoneNo: { primary: '012780000', extensionPrimary: '14', secondary: null, extensionSecondary: null },
    mobileNo: { primary: null, secondary: null, isdCodePrimary: null, isdCodeSecondary: null },
    currentMailingAddress: 'NATIONAL',
    latitude: null,
    longitude: null,
    createdBy: 1,
    createdDate: { gregorian: '2004-03-16T00:00:00.000Z', hijiri: '1425-01-25' },
    lastModifiedBy: 971761,
    lastModifiedDate: { gregorian: '2017-12-31T23:23:19.000Z', hijiri: '1439-04-13' }
  },
  transactionReferenceData: [],
  comments: null,
  transactionMessage: null,
  establishmentType: { arabic: 'رئيسية', english: 'Main' },
  proactive: true,
  establishmentAccount: {
    paymentType: null,
    startDate: null,
    bankAccount: null,
    navigationIndicator: null,
    comments: null,
    contentIds: null,
    referenceNo: null
  },
  molEstablishmentIds: { molEstablishmentId: 2619, molOfficeId: 9, molEstablishmentOfficeId: 9, molunId: 2619 },
  gccEstablishment: null,
  navigationIndicator: null,
  molRecordId: null,
  revisionList: null,
  transactionTracingId: 0,
  organizationCategory: null,
  organizationType: null,
  fieldOfficeName: { arabic: 'مكتب منطقة مكة المكرمة', english: 'Makkah R Office' },
  validatorEdited: false,
  adminRegistered: false,
  registrationCompleted: false
};

export const flagDetailsMock: FlagDetails = {
  creationType: {
    arabic: '',
    english: FlagCreationTypeEnum.SYSTEM
  },
  flagType: {
    arabic: 'إيقاف الشهادة عن منشأة',
    english: 'Stop GOSI certificate'
  },
  flagReason: {
    arabic: 'غير ملتزمة بنظام ولوائح المؤسسة',
    english: 'Noncompliance with GOSI law and regulations'
  },
  justification: 'test',
  startDate: {
    gregorian: new Date('2007-05-01T00:00:00.000Z'),
    hijiri: '1428-04-14'
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  status: 'DRAFT',
  referenceNo: 840300,
  initiatedBy: {
    arabic: 'لشهادة عن منشأة',
    english: 'CCD'
  },
  initiatedRole: {
    arabic: 'إيقاف الشهادة عن منشأ',
    english: 'CCD'
  }
};
export const flagDetails: FlagDetails = {
  creationType: {
    arabic: '',
    english: FlagCreationTypeEnum.SYSTEM
  },
  flagType: {
    arabic: 'إيقاف الشهادة عن منشأة',
    english: 'Stop HRSD Services'
  },
  flagReason: {
    arabic: '',
    english: 'Others'
  },
  justification: 'test',
  startDate: {
    gregorian: new Date('2007-05-01T00:00:00.000Z'),
    hijiri: '1428-04-14'
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  status: 'DRAFT',
  referenceNo: 840300,
  initiatedBy: {
    arabic: 'لشهادة عن منشأة',
    english: 'CCD'
  },
  initiatedRole: {
    arabic: 'إيقاف الشهادة عن منشأ',
    english: 'CCD'
  }
};
export const FlagRequestTestData: FlagRequest = {
  type: {
    arabic: 'إيقاف الشهادة عن منشأة',
    english: 'Stop GOSI certificate'
  },
  navigationIndicator: 62,
  reason: {
    arabic: 'غير ملتزمة بنظام ولوائح المؤسسة',
    english: 'Noncompliance with GOSI law and regulations'
  },
  justification: 'test',
  startDate: {
    gregorian: new Date('2007-05-01T00:00:00.000Z'),
    hijiri: '1428-04-14'
  },
  endDate: {
    gregorian: new Date('2020-04-14T00:00:00.000Z'),
    hijiri: '1441-08-21'
  },
  transactionId: null,
  comments: ''
};
export const flagQueryParamData: FlagQueryParam = {
  flagType: 'abcd',
  flagReason: ['abc', 'sdf'],
  initiatedBy: ['rtyu'],
  startDate: '1441-08-21',
  endDate: '1441-08-21',
  status: 'yes',
  transactionTraceId: 1233,
  getTransient: true,
  getWorkflow: true,
  flagId: 12334,
  orderBy: null,
  sortBy: null,
  isFlagTransaction: true
};

export const workflowRequest: EstablishmentWorkFlowStatus[] = [
  {
    type: 'change establishment contact details',
    message: {
      arabic: 'يوجد طلب قيد الإجراء لتعديل بيانات الاتصال. رقم المعاملة: 991617',
      english: 'Change establishment contact details transaction is in progress. Transaction id: 991617'
    },
    referenceNo: 991617,
    count: 0,
    recordActionType: null,
    status: null
  }
];

export const genericMainEstInfo: MainEstablishmentInfo = {
  status: genericEstablishmentResponse?.status,
  legalEntity: genericEstablishmentResponse?.legalEntity,
  registrationNo: genericEstablishmentResponse?.mainEstablishmentRegNo
};

export const contributorDataArray: Contributor[] = [
  {
    person: genericPersonResponse,
    active: false,
    contributorType: 'saudi',
    socialInsuranceNo: 423659266,
    vicIndicator: false,
    statusType: 'ACTIVE',
    fromJsonToObject: () => {
      return undefined;
    }
  }
];
