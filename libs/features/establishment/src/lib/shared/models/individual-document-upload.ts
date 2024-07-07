/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class IndividualDocumentUploadRequest {
  documentTraceList: DocumentRequestArray[] = [];
}
export class DocumentRequestArray {
  description: string = undefined;
  uuid: string = undefined;
}
