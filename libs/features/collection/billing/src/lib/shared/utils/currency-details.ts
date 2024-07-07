/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, DocumentItem } from '@gosi-ui/core';
import { CurrencyArabicShortForm } from '../enums';
import { CurrencyDetails } from '../models';

export const assembleCurrencyDetails = (amount: number, exchangeRate: number, code: string): CurrencyDetails => {
  const convertedAmount = Number(parseFloat((amount * exchangeRate).toString()).toFixed(2));
  const currencyShort: BilingualText = createBilingualObject(code, CurrencyArabicShortForm[code]);
  return new CurrencyDetails(currencyShort, exchangeRate, convertedAmount);
};

/** Method to create bilingual object */
export const createBilingualObject = (english: string, arabic: string): BilingualText => {
  return { english: english, arabic: arabic };
};
/**
 * Method to check if all the documents are valid and uploaded
 * @param documents
 */
export const isDocumentsValid = (documents: DocumentItem[]): boolean => {
  let isValid = true;
  documents.forEach(document => {
    if (
      (!document.documentContent || document.documentContent === null || document.documentContent === 'NULL') &&
      document.required &&
      document.show
    ) {
      isValid = false;
      document.uploadFailed = true;
    } else {
      document.uploadFailed = false;
    }
  });
  return isValid;
};
