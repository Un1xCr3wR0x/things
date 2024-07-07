import { RoleIdEnum } from '../enums';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 *
 * @export
 * @class RoleFeature
 */
export class RoleFeatures {
  roleFeatures: RoleFeature[] = [];
}

export class RoleFeature {
  role: string;
  userType: string;
  roleNameEnglish: string;
  roleNameArabic: string;
  features: string[] = []; // all users mapped with this features can see this
  gccFeatures?: string[] = []; // features can be viewed if only gcc establishment is selected
  nonGccFeatures?: string[] = []; // features can be viewed if only non gcc establishment is selected
}
export class DefaultRoute {
  roles: RoleIdEnum[] = [];
  url: string;
  isNegate: boolean;
}
export class DomainUrl {
  url: string = null;
  allowedFeatures: string[] = [];
  isEstablishmentRequired = true;
  isVicRequired = false;
  fromJsonToObject(json) {
    Object.keys(new DomainUrl()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
export class DomainRoute {
  type: string = null;
  allowedFeatures: string[] = [];
  isEstablishmentRequired = true;
  isVicRequired = false;
  fromJsonToObject(json) {
    Object.keys(new DomainRoute()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    //console.log("inside the domainRoute => Object.Keyes() of this: " + Object.keys(this) + "\nand its values are: "+ Object.values(this));
    return this;
  }
}
