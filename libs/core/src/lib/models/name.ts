/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ArabicName } from './arabic-name';
import { EnglishName } from './english-name';

/**
 * Warpper class to hold Arabic and English names of a person.
 *
 * @export
 * @class Name
 */
export class Name {
  arabic: ArabicName = new ArabicName();
  english: EnglishName = new EnglishName();
  constructor() {}

  /**
   * mapping values into model
   */
  fromJsonToObject(json: Name) {
    Object.keys(json).forEach(key => {
      if (key in new Name()) {
        if (key === 'arabic') {
          this.arabic = new ArabicName().fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
