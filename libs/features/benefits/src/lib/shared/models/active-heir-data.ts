/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  BorderNumber,
  CommonIdentity,
  GosiCalendar,
  Iqama,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { RestartHoldDetails } from './restart-hold-details';

export class ActiveHeirData {
  benefitType?: BilingualText;
  heirName: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  heirIdentity?: CommonIdentity;
  requestDate: GosiCalendar;
  firstBenefitStartDate: GosiCalendar;
  status: BilingualText;
  currentBenefitAmount: number;
  holdStopDetails?: RestartHoldDetails = new RestartHoldDetails();
  deathDate: GosiCalendar = new GosiCalendar();
}
