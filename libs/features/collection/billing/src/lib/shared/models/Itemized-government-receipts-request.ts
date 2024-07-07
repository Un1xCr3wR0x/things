/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ItemizedGovernmentReceiptsRequest {
  filename: string;
  paymentDtoList: UploadReceiptsList[];
}

export class UploadReceiptsList {
  establishmentName: string;
  transactionDate: string;
  amount: string;
  referenceNo: string;
  paymentOrderNumber: string;
}
