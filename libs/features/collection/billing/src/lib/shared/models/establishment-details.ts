/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EstablishmentAccountDetails } from './establishment-account-details';
import { GccEstablishmentDetails } from './gcc-establishment-details';

export class EstablishmentDetails {
  mainEstablishmentRegNo: number = undefined;
  name: BilingualText = new BilingualText();
  gccEstablishment: GccEstablishmentDetails = new GccEstablishmentDetails();
  gccCountry = false;
  legalEntity: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  fieldOfficeName: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  establishmentAccount: EstablishmentAccountDetails = new EstablishmentAccountDetails();
  outOfMarket = false;
  startDate: GosiCalendar = new GosiCalendar();
  proactive?: boolean;
  nationalityCode?: BilingualText = new BilingualText();
  organizationCategory?: BilingualText = new BilingualText();
  ppaEstablishment?: boolean = false;

  fromJsonToObject(json) {
    Object.keys(new EstablishmentDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
