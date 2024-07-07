/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

/**
 * Wrapper class to hold Document details.
 *
 * @export
 * @class DocumentItem
 */
export class DocumentItem {
  documentContent: string = undefined;
  documentType: string = undefined;
  documentAddedBy?: string = undefined;
  name: BilingualText = new BilingualText();
  required = false;
  reuse = false;
  started = false;
  valid = false;
  contentId: string = undefined;
  id?: string = undefined;
  fileName: string = undefined;
  sequenceNumber: number = undefined;
  uploaded = false;
  isUploading = false;
  size: string = undefined;
  isContentOpen = false;
  percentageLoaded: number = undefined;
  icon: string = undefined;
  businessKey: number = undefined;
  transactionId: string = undefined;
  transactionIds?: string[] = [];
  uploadFailed = false;
  isScanning = false;
  show? = true;
  referenceNo: number = undefined;
  transactionReferenceIds: number[] = [];
  canDelete? = true;
  uuid: string = undefined;
  identifier: string = undefined;
  documentClassification: string = undefined;
  userAccessList: string[] = [];
  documentTypeId?: number = undefined;
  parentDocumentId?: number = undefined;
  createdBy?: number = undefined;
  createdDate?: string = undefined;
  transactionTraceId?: number = undefined;
  showBusinessKey? = false;
  description?: string = undefined;
  docAddedByName?: string = undefined;
  uploadedDate?: GosiCalendar = new GosiCalendar();
  displayContentId?: string = undefined;
  isIndividualProfile?: boolean = false;
  allowPublicAccess?: boolean = false;
  documentUploaderIdentifier?: string = undefined;

  constructor() {
    this.documentContent = null;
    this.documentType = null;
    this.fileName = null;
    this.name = new BilingualText();
    this.required = false;
    this.reuse = false;
    this.started = false;
    this.valid = false;
    this.contentId = null;
    this.uploaded = false;
    this.sequenceNumber = 0;
    this.isUploading = false;
    this.size = null;
    this.isContentOpen = false;
    this.percentageLoaded = 0;
    this.icon = null;
    this.businessKey = null;
    this.transactionId = null;
    this.uploadFailed = false;
    this.isScanning = false;
    this.show = true;
    this.canDelete = true;
    this.uuid = null;
    this.identifier = null;
    this.createdBy = null;
    this.createdDate = null;
    this.transactionTraceId = null;
    this.isIndividualProfile = false;
  }

  /**
   * Method to bind the document api response into Document item
   * @param json
   */
  fromJsonToObject(json: DocumentItem) {
    Object.keys(this).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
