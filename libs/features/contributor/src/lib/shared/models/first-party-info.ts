/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, ContactDetails, MOLEstablishmentDetails } from '@gosi-ui/core';

export class FirstPartyInfo {
  name: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  contactDetails: ContactDetails = new ContactDetails();
  molEstablishmentIds: MOLEstablishmentDetails = new MOLEstablishmentDetails();
}
