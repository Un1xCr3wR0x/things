interface PersonIdentity {
  idType: string;
  iqamaNo?: number;
  id: number;
}
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PatchRequest {
  type: string = undefined;
  comments?: string = undefined;
  personIdentity: PersonIdentity;
  navigationInd?: number = undefined;

  constructor() {
    this.personIdentity = null;
    this.navigationInd = 0;
  }
  //Method to bind value from json to object
  fromJsonToObject(json) {
    Object.keys(this).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
