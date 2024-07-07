/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, DocumentItem } from '@gosi-ui/core';

export class RepaymentDetails {
  additionalPaymentDetails: string;
  amountTransferred: number;
  bankName: BilingualText;
  bankType: BilingualText;
  documents: DocumentItem[];
  scannedDocuments: DocumentItem[];
  paymentMethod: BilingualText;
  paymentReferenceNo: number;
  receiptMode: BilingualText;
  transactionDate: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
}
