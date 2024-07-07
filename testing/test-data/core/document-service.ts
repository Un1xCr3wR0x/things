import { bindToObject, DocumentItem, DocumentResponseItem } from '@gosi-ui/core';

export const fileUploadTestData = {
  documentName: 'FEAAPPLVD01006806'
};

const requiredDoc = {
  documentContent: null,
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
  sequenceNumber: 0,
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
};

export const requiredDocumentItem = bindToObject(new DocumentItem(), requiredDoc);

const docList = [
  {
    documentContent: 'jhfjhfjhfjhfjf',
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
    sequenceNumber: 0,
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
    sequenceNumber: 0,
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
export const documentListItemArray = docList.map(doc => bindToObject(new DocumentItem(), doc));

export const documentResonseItem = {
  content: 'dfsvsdfgv',
  documentName: 'passport',
  documentContent: 'dfsvsdfgv',
  fileName: 'dfsdf',
  id: '123',
  registrationNumber: '',
  contentId: ''
};

const docResponse = [
  {
    content: 'dfsvsdfgv',
    documentName: 'passport',
    fileName: 'dfsdf',
    id: '123'
  }
];
export const documentResonseItemList = docResponse.map(doc => bindToObject(new DocumentResponseItem(), doc));

export const uploadSubmitResponseData = {
  referenceNo: 10460
};

export const requiredDocumentData = [
  {
    required: true,
    name: {
      arabic: 'عقد العمل',
      english: 'Employment Contract'
    },
    documentContent: null,
    reuse: false,
    sequenceNumber: 2,
    contentId: null,
    documentType: null,
    started: false,
    uploaded: true,
    valid: false
  },
  {
    required: true,
    name: {
      arabic: 'بطاقة الهوية الوطنية',
      english: 'National ID'
    },
    documentContent: null,
    reuse: false,
    sequenceNumber: 2,
    contentId: null,
    documentType: null,
    started: false,
    uploaded: true,
    valid: false
  }
];

export const mandatoryCheckDocumentList: DocumentItem[] = [
  {
    documentContent: null,
    documentType: null,
    name: null,
    required: true,
    reuse: null,
    started: null,
    valid: false,
    contentId: null,
    fileName: null,
    sequenceNumber: null,
    uploaded: null,
    isUploading: null,
    size: null,
    isContentOpen: null,
    percentageLoaded: null,
    icon: null,
    businessKey: null,
    uuid: null,
    transactionId: null,
    uploadFailed: null,
    isScanning: null,
    referenceNo: null,
    canDelete: true,
    fromJsonToObject: () => {
      return undefined;
    },
    transactionReferenceIds: [],
    identifier: undefined,
    documentClassification: undefined,
    userAccessList: []
  },
  {
    documentContent: '#fdxfd',
    documentType: null,
    name: null,
    required: true,
    reuse: null,
    started: null,
    valid: true,
    contentId: null,
    fileName: null,
    sequenceNumber: null,
    uploaded: null,
    isUploading: null,
    size: null,
    isContentOpen: null,
    percentageLoaded: null,
    icon: null,
    businessKey: null,
    uuid: null,
    transactionId: null,
    uploadFailed: null,
    isScanning: null,
    referenceNo: null,
    canDelete: true,
    fromJsonToObject: () => {
      return undefined;
    },
    transactionReferenceIds: [],
    identifier: undefined,
    documentClassification: undefined,
    userAccessList: []
  }
];

export const docsForInternalUser: DocumentItem[] = [
  //6 documents -  4 dup,1 internal only ,1 external
  {
    required: true,
    name: {
      arabic: 'نموذج عمليات صاحب العمل',
      english: 'Employer processes form'
    },
    description: null,
    documentContent: null,
    reuse: false,
    sequenceNumber: 1,
    documentClassification: 'Internal',
    documentTypeId: 1001,
    parentDocumentId: null
  },
  {
    required: true,
    name: {
      arabic: 'نموذج عمليات صاحب العمل',
      english: 'Employer processes form'
    },
    description: null,
    documentContent: null,
    reuse: false,
    sequenceNumber: 1,
    documentClassification: 'Internal',
    documentTypeId: 1002,
    parentDocumentId: 1001
  },
  {
    required: true,
    name: {
      arabic: 'صورة هوية / اقامة',
      english: 'National ID or Iqama'
    },
    description: null,
    documentContent: null,
    reuse: false,
    sequenceNumber: 2,
    documentClassification: 'Internal',
    documentTypeId: 1003,
    parentDocumentId: null
  },
  {
    required: true,
    name: {
      arabic: 'صورة هوية / اقامة',
      english: 'National ID or Iqama'
    },
    description: null,
    documentContent: null,
    reuse: false,
    sequenceNumber: 2,
    documentClassification: 'Internal',
    documentTypeId: 1004,
    parentDocumentId: 1003
  },
  {
    required: true,
    name: {
      arabic: 'السجل التجاري',
      english: 'Commercial Registration'
    },
    description: null,
    documentContent: null,
    reuse: false,
    sequenceNumber: 3,
    documentClassification: 'Internal',
    documentTypeId: 1005,
    parentDocumentId: null
  }
].map(item => bindToObject(new DocumentItem(), item));

export const docsForExternalUser: DocumentItem[] = [
  ...docsForInternalUser
    .map(it => bindToObject(new DocumentItem(), it))
    .filter(item => (item.parentDocumentId ? true : false))
]; // 3 documents
export const docsScannedByInternalUser: DocumentItem[] = [
  ...docsForInternalUser.map(it => {
    //Scanned by Internal User
    const item = bindToObject(new DocumentItem(), it);
    if (!item.parentDocumentId) {
      item.contentId = 'HASCONTENT';
    }
    return item;
  })
];
export const docsUploadedByExternalUser: DocumentItem[] = [
  ...docsForInternalUser.map(it => {
    const item = bindToObject(new DocumentItem(), it);
    if (item.parentDocumentId) {
      item.contentId = 'HASCONTENT';
    }
    return item;
  })
];
