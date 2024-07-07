/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ApplicationTypeEnum, DocumentItem } from '@gosi-ui/core';
import { DocumentNameEnum } from '../../../shared';
import { ChangeBankDetailsScComponent } from './change-bank-details-sc.component';

/**
 * Initialise documents with necessary validations
 * @param documents
 */
export function performInitialDocumentValidations(self: ChangeBankDetailsScComponent, documents: DocumentItem[]) {
  if (self.appToken === ApplicationTypeEnum.PUBLIC) {
    documents.forEach(doc => {
      if (
        doc.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT ||
        doc.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER ||
        doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA ||
        doc.name.english === DocumentNameEnum.IBAN_PROOF_CERTIFICATE
      ) {
        doc.show = doc.required = true;
      }
      //  else {
      //   doc.show = true;
      // }
    });
  } else {
    documents.forEach(doc => {
      if (doc.name.english === DocumentNameEnum.IBAN_PROOF_CERTIFICATE) {
        doc.show = doc.required = false;
      }
      // if (doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
      //   doc.show = doc.required = false;
      // }
    });
  }
  self.bankDetailsDocuments = documents;
}

export const changeBankDocuments = (self: ChangeBankDetailsScComponent, show: boolean) => {
  if (self.isEligibleForIbanValidation) {
    self.hideDocuments = true;
    return;
  }
  self.hideDocuments = self.appToken === ApplicationTypeEnum.PUBLIC && !show && !self.isValidator;
  self.bankDetailsDocuments?.forEach(doc => {
    if (doc.name.english === DocumentNameEnum.IBAN_PROOF_CERTIFICATE) {
      doc.show = doc.required = show;
    }
  });
};
