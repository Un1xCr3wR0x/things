/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { DependentDetails } from './dependent-details';
import { HeirDebitDetails } from './heir-debit';

export class HeirDetailsRequest {
  eventDate: GosiCalendar; //Missing or Death Date
  heirDetails?: DependentDetails[];
  reason: BilingualText;
  // referenceNo: number;
  requestDate?: GosiCalendar;
  heirDebitDetails?: HeirDebitDetails[];
  anyHeirAddedOrModified?: boolean; // variable to check if any heir is added or modified : for only annual notif updated scenerio
  isPpaOhDeath?: boolean;
}
