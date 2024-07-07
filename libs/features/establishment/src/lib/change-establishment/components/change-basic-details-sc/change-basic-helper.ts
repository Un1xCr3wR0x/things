/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DocumentItem } from '@gosi-ui/core';
import { DocumentNameEnum } from '../../../shared';
import { ChangeBasicDetailsScComponent } from './change-basic-details-sc.component';

export function handleBasicDetailsDocuments(
  documents: DocumentItem[],
  isGcc: boolean,
  isFieldOffice: boolean,
  hasCrn: boolean,
  hasLicense: boolean,
  self: ChangeBasicDetailsScComponent
): DocumentItem[] {
  documents.forEach(doc => {
    if (doc.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT) {
      doc.show = isFieldOffice && !isGcc;
      doc.required = true;
    } else if (doc.name.english === DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT) {
      doc.show = doc.required = isGcc;
    } else if (doc.name.english === DocumentNameEnum.LICENSE_DOCUMENT) {
      doc.show = !isGcc && !hasCrn;
      doc.required = hasCrn ? false : hasLicense;
    } else if (doc.name.english === DocumentNameEnum.COMMERCIAL_REG_DOCUMENT) {
      doc.show = !isGcc && (hasCrn ? true : !hasLicense);
      doc.required = hasCrn;
    } else if (doc.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER) {
      doc.show = isFieldOffice && !isGcc;
      doc.required = false;
    } else if (doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
      doc.required = false;
      doc.show = isFieldOffice && !isGcc;
    } else if (doc.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
      doc.show = true;
      doc.required = false;
    } else {
      doc.show = doc.required = false;
    }
    if (self.isGOL && self.isUnn) {
      doc.show = false;
      doc.required = false;
    }
  });
  return documents;
}
