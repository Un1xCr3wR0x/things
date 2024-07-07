import { DocumentItem } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const CreditBalanceDetailsMockData = {
  totalCreditBalance: '4552',
  retainedBalance: '14544',
  transferableBalance: '1555',
  totalDebitBalance: '555',
  recipientDetail: [
    {
      amount: 100,
      registrationNo: 110000103,
      name: { arabic: '', english: '' },
      status: { arabic: '', english: '' }
    }
  ]
};
export const FeildOfficeData = [
  {
    value: { arabic: 'مكتب منطقة الرياض', english: 'Riyadh R Office' },
    code: 1,
    sequence: 1
  },
  {
    value: { arabic: 'مكتب منطقة عسير', english: 'Asser R Office' },
    code: 30,
    sequence: 2
  },
  { value: { arabic: 'مكتب مكة المكرمة', english: 'Makkah Office ' }, code: 31, sequence: 3 }
];
export const creditDocList: DocumentItem[] = [
  {
    documentContent: 'jhfjhfjhfjhfjf',
    identifier: undefined,
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
    fileName: 'test',
    referenceNo: 1234,
    transactionReferenceIds: [1, 2, 3, 4],
    uuid: 'gdvsidgis9sd8789s7d987ds90',
    fromJsonToObject: () => undefined,
    documentClassification: undefined,
    userAccessList: []
  },
  {
    documentContent: 'jhkjhkh',
    identifier: undefined,
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
    fileName: 'test',
    referenceNo: 1234,
    transactionReferenceIds: [1, 2, 3, 4],
    uuid: 'gdvsidgis9sd8789s7d987ds90',
    fromJsonToObject: () => undefined,
    documentClassification: undefined,
    userAccessList: []
  }
];
