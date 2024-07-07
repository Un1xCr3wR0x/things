import { BilingualText } from './bilingual-text';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Model class to hold values from map
 *
 * @export
 * @class GoogleMap
 */
export class GoogleMapDetails {
  city: BilingualText;
  cityDistrict: BilingualText;
  latitude: string;
  longitude: string;
  constructor() {
    this.city = new BilingualText();
    this.cityDistrict = new BilingualText();
  }
}
