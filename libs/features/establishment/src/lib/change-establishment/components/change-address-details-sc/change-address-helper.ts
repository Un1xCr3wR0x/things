/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DocumentItem } from '@gosi-ui/core';
import { DocumentNameEnum } from '../../../shared';

export function handleAddressDocuments(
  documents: DocumentItem[],
  isGcc: boolean,
  isPrivate: boolean,
  isAddressEmpty = false
): DocumentItem[] {
  documents.forEach(document => {
    if (document.name.english === DocumentNameEnum.COMPANY_ADDRESS_PROOF) {
      //Mandatory except when Foreign Address is deleted for GCC Establishment
      document.show = !(isAddressEmpty && isGcc);
      document.required = !(isAddressEmpty && isGcc);
    } else if (document.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT) {
      //If Field Office and Non Gcc Establishment show as mandatory
      document.show = isPrivate && !isGcc;
      document.required = true;
    } else if (document.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER) {
      //If Field Office and Non Gcc Establishment show as optional
      document.show = isPrivate && !isGcc;
      document.required = false;
    } else if (document.name.english === DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT) {
      //Show if
      document.show = isGcc && isPrivate;
      document.required = true;
    } else if (document.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
      //Show in Field Office but optional if GCC
      document.show = isPrivate;
      document.required = false; //!isGcc;
    } else if (document.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
      //Show as Optional
      document.show = true;
      document.required = false;
    } else {
      document.show = false;
      document.required = false;
    }
  });
  return documents;
}
