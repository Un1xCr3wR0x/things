/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { AddressTypeEnum } from '../enums';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold address details.
 *
 * @export
 * @class AddressDetails
 */
export class AddressDetails {
  country: BilingualText;
  city: BilingualText;
  postalCode: string = undefined;
  postBox: string = undefined;
  buildingNo: string = undefined;
  district: string = undefined;
  cityDistrict: BilingualText;
  streetName: string = undefined;
  additionalNo: string = undefined;
  unitNo: string = undefined;
  type: string = undefined;
  detailedAddress: string = undefined;

  constructor(type?: string) {
    this.country = new BilingualText();
    this.city = new BilingualText();
    this.cityDistrict = new BilingualText();
    this.type = type || AddressTypeEnum.NATIONAL;
  }

  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      if (key in new AddressDetails() && json[key]) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
