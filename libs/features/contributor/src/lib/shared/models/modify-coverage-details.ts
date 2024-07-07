import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ModifyCoverageDetails {
  endDate: GosiCalendar = new GosiCalendar();
  id: number;
  lastUpdatedDate: GosiCalendar = new GosiCalendar();
  newCoverage: BilingualText[] = [];
  oldCoverage: BilingualText[] = [];
  reasonForChange: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  modifiedCoverage: BilingualText = new BilingualText();
}
