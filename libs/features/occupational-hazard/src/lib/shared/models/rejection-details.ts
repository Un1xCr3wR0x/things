import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class RejectionDetails {
  comments: string = undefined;
  uuid?: string = undefined;
  rejectionReason: BilingualText = new BilingualText();
  parentInjuryRejectionReason: BilingualText = new BilingualText();
  returnReason: BilingualText = new BilingualText();
  rejectionIndicator = true;
  foregoExpenses?: boolean;
  parentInjForegoExpenses?: boolean;
}
/**
 * Method to bind data to the object
 * @param object
 * @param data
 */
export const setResponses = function (object, data) {
  if (data && object) {
    Object.keys(object).forEach(key => {
      if (key in data) {
        object[key] = data[key];
      }
    });
  }
  return { ...object };
};
