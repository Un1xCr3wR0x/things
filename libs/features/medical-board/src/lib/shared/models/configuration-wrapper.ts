import { BilingualText, GosiCalendar } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ConfigurationWrapper {
  totalCount: number = null;
  summaryDetails: ConfigurationList[] = [];
}
export class ConfigurationList {
  sessionTemplateId: number = undefined;
  sessionType: BilingualText = new BilingualText();
  medicalBoardType: BilingualText = new BilingualText();
  officeLocation: BilingualText = new BilingualText();
  frequency: BilingualText = new BilingualText();
  days: BilingualText[];
  status: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  startTime: string;
  sessionId?: number = undefined;
  endTime: string;
  startTimeAmOrPm: BilingualText;
  endTimeAmOrPm: BilingualText;
}
