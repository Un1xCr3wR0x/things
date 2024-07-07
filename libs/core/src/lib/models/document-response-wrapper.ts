/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold Document details.
 *
 * @export
 * @class DocumentResponseWrapper
 */
export class DocumentResponseWrapper {
  file: DocumentFile = new DocumentFile();
}

export class DocumentFile {
  name: string;
  content: string;
  createdBy?: number;
  createdDate?: string;
  transactionTraceId?: number;
}
