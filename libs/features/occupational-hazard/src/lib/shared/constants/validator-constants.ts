import { AppConstants } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to return gcc country details.
 * @export
 * @class GCCDetails
 */
export class ValidatorConstants {
  public static get ISD_PREFIX_MAPPING() {
    return {
      sa: '+966',
      kw: '+965',
      bh: '+973',
      om: '+968',
      qa: '+974',
      ae: '+971'
    };
  }

  public static get MAXLENGTH_COMMENTS(): number {
    return AppConstants.MAXLENGTH_COMMENTS;
  }
}
