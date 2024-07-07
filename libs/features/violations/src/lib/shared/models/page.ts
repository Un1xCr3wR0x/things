/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class Page {
  pageNo = 0;
  size = 10;

  fromJsonToObject(json) {
    Object.keys(new Page()).forEach(key => {
      this[key] = json[key];
    });
    return this;
  }
}
