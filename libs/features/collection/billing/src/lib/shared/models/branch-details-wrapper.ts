/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BranchDetails } from './branch-details';

export class BranchDetailsWrapper {
  branchList: BranchDetails[] = [];

  fromJsonToObject(json) {
    Object.keys(new BranchDetailsWrapper()).forEach(key => {
      if (key === 'branchList') {
        for (let i = 0; i < json[key].length; i++) {
          this[key].push(new BranchDetails().fromJsonToObject(json[key][i]));
        }
      } else {
        this[key] = json[key];
      }
    });
    return this;
  }
}
