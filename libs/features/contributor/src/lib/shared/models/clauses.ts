/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { ClauseItem } from '../../shared/models/clause-item';

/**
 * The wrapper class for product.
 * @export
 * @class Coverage
 */
export class Clauses {
  section: BilingualText = new BilingualText();
  clauses: ClauseItem[] = [];

  constructor() {}

  fromJsonToObject(json: Clauses) {
    Object.keys(json).forEach(key => {
      if (key in new Clauses()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
