/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class PhoneDetails {
  extensionPrimary: string = undefined;
  extensionSecondary?: string = undefined;
  primary: string = undefined;
  secondary?: string = undefined;

  /**
   * Mapping json values into model
   */
  fromJsonToObject(json: PhoneDetails) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key in new PhoneDetails()) {
          this[key] = json[key];
        }
      });
    }
    return this;
  }
}
