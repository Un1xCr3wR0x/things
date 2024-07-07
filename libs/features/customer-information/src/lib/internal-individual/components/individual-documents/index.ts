/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DocumentFilterDcComponent } from './document-filter-dc/document-filter-dc.component';
import { DocumentViewScComponent } from './document-view-sc/document-view-sc.component';
import { SystemMultiSelectDcComponent } from './system-multi-select-dc/system-multi-select-dc.component';
import { UploadDocumentScComponent } from './upload-document-sc/upload-document-sc.component';

export const INDIVIDUAL_DOCUMENTS = [DocumentViewScComponent, UploadDocumentScComponent, DocumentFilterDcComponent, SystemMultiSelectDcComponent];

export * from './document-view-sc/document-view-sc.component';
export * from './upload-document-sc/upload-document-sc.component';
export * from './document-filter-dc/document-filter-dc.component';
export * from './system-multi-select-dc/system-multi-select-dc.component';
