/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';

/**
 * Wrapper class to hold Document details.
 *
 * @export
 * @class DocumentItem
 */
export class DocumentIndividualItem {
  createdBy: number;
  createdDate: string;
  documentName: string;
  documentTypeId: number;
  id: string;
  name: BilingualText = new BilingualText();
  sequenceNo: string;
  uploadedDate: CustomDate;

  fileName?: string = undefined;
  documentContent?: string = undefined;
  started?: boolean = false;
  valid?: boolean = false;
  contentId?: string = undefined;
  uploadFailed?: boolean = false;
  sequenceNumber?: number = undefined;

  constructor() {
    this.createdBy = null;
    this.createdDate = null;
    this.documentName = null;
    this.documentTypeId = null;
    this.id = null;
    this.name = null;
    this.sequenceNo = null;
    this.uploadedDate = null;
  }

  /**
   * Method to bind the document api response into Document item
   * @param json
   */
  fromJsonToObject(json: DocumentIndividualItem) {
    Object.keys(this).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}

export class CustomDate {
  entryFormat: string;
  gregorian: Date;
  hijiri: string;
}
