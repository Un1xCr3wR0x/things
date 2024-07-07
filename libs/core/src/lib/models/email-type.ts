/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Warpper class to hold primary and secondary email.
 *
 * @export
 * @class EmailType
 */
export class EmailType {
  primary: string = undefined;
  secondary?: string = undefined;

  /**
   * Mapping json values into model
   */
  fromJsonToObject(json) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key in new EmailType()) {
          this[key] = json[key];
        }
      });
    }
    return this;
  }
}
