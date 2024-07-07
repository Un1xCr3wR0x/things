/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Warpper class to hold mobile number details.
 *
 * @export
 * @class MobileDetails
 */

export class MobileDetails {
  primary: string = undefined;
  secondary?: string = undefined;
  isdCodePrimary: string = undefined;
  isdCodeSecondary?: string = undefined;

  constructor() {}

  /**
   * Mapping json values into model
   */
  fromJsonToObject(json: MobileDetails) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key in this) {
          this[key] = json[key];
        }
      });
    }
    return this;
  }
}
