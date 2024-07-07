/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold Document details.
 *
 * @export
 * @class DocumentResponseItem
 */
export class DocumentResponseItem {
  content: string = undefined;
  documentName: string = undefined;
  fileName: string = undefined;
  id: string = undefined;
  registrationNumber: string = undefined;
  contentId: string = undefined;
  sequenceNo: number;
  sequenceNumber: number;
  createdBy?: number = undefined;
  createdDate?: string = undefined;
  transactionTraceId?: number = undefined;
  documentAddedBy?: string = undefined;
  documentUploaderIdentifier?: string = undefined;
  allowPublicAccess?: boolean = false;
  documentClassification?: string = undefined;
}
