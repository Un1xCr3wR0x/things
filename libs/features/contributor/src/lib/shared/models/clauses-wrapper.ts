/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Clauses } from '../../shared/models';

/**
 * The wrapper class for product.
 * @export
 * @class Coverage
 */
export class ClausesWrapper {
  contractClause: Clauses[];
  transportationAllowance: string;
  fromJsonToObject(json: ClausesWrapper) {
    Object.keys(json).forEach(key => {
      if (key in new ClausesWrapper()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
