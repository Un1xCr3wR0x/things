/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * The model class to hold the person name elements.
 *
 * @export
 * @class ArabicName
 */
export class ArabicName {
  firstName: string = undefined;
  secondName: string = undefined;
  thirdName: string = undefined;
  familyName: string = undefined;

  constructor() {}
  /**
   * mapping values into model
   */
  fromJsonToObject(json: ArabicName) {
    Object.keys(json).forEach(key => {
      if (key in new ArabicName()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
