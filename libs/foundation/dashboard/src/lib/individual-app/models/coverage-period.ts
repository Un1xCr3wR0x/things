import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class CoveragePeriod {
  startDate: GosiCalendar = new GosiCalendar();
  coverages: Coverage[] = [];
  monthlyContributoryWage: number;
  endDate: GosiCalendar = new GosiCalendar();
}
export class Coverage {
  coverage = 0;
  contributorPercentage = 0;
  establishmentShare = 0;
  coverageType: BilingualText = new BilingualText();
  contributorShare = 0;
  establishmentPercentage = 0;
  fromJsonToObject(json: Coverage) {
    Object.keys(json).forEach(key => {
      if (key in new Coverage()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
