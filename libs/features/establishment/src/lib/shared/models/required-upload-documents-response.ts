import { DocumentItem, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class RequiredUploadDocumentsResponse {
  fieldActivityNo: string;
  contributors: ContributorDetailsList[] = [];
  dateOfSubmission: GosiCalendar;
  inspectionDate: GosiCalendar;
  inspectedBy: string;
  inspectorName: string;
}

export class ContributorDocumentList {
  documentList: DocumentItem[];
}

export class ContributorDetailsList {
  partyId: number;
  nationalId: number;
  contrName: string;
}
