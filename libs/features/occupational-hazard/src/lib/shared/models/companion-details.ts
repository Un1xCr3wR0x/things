/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class CompanionDetails {
  destinationLatitude: string = undefined;
  destinationLongitude: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  name: string;
  originLatitude: string = undefined;
  originLongitude: string = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  distanceTravelled: string = undefined;
  type: BilingualText = new BilingualText();
  isGreater: boolean;
  injuryIdList?: Array<number>;
}
