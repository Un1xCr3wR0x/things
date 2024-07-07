/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DocumentItem } from '@gosi-ui/core';
import { DocumentNameEnum } from '../../../shared';

export function handleContactDocuments(documents: DocumentItem[], isGcc: boolean, isPrivate: boolean): DocumentItem[] {
  documents.forEach(document => {
    if (document.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT) {
      //Non Gcc Establishment show as mandatory
      document.show = !isGcc;
      document.required = true;
    } else if (document.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER) {
      //Non Gcc Establishment show as optional
      document.show = !isGcc;
      document.required = false;
    } else if (document.name.english === DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT) {
      //If GCC
      document.show = isGcc;
      document.required = true;
    } else if (document.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
      //optional if GCC
      document.show = true;
      document.required = false; //!isGcc;
    } else if (document.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
      //Show as Optional
      document.show = true;
      document.required = false;
    } else {
      document.show = document.required = false;
    }
  });

  return isPrivate ? documents : [];
}
