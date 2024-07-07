/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class SecondedDetails {
  personId: number = undefined;
  secondedId: number = undefined;
  currentEstablishment: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  contractDate: GosiCalendar = new GosiCalendar();
  salary: number = undefined;
  editFlow: boolean = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
}
