import { CommonIdentity, Name, BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ControlPerson {
  name?: Name = new Name();
  commonId?: CommonIdentity = new CommonIdentity();
  role?: BilingualText;
  sex?: BilingualText = new BilingualText();
  isParty?: boolean = false;
  partyId?: String;
  partyName?: String;
}
