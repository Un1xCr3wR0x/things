/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DocumentItem } from './document';

export class DocumentList {
  docCount: number;
  addedByList: AddedByList[];
  documentList: DocumentItem[];
}
export class AddedByList {
  userId: string;
  userName: string;
}
