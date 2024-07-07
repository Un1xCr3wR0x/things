import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class VicContributionDetails {
  contributionMonths = 0;
  totalContributionMonths = 0;
  numberOfUnPaidMonths = 0;
  refundableCreditBalance = 0;
  contributionDays? = 0;
  totalContributionDays? = 0;
  numberOfUnPaidDays? = 0;
  lastBillPaidDate: GosiCalendar = new GosiCalendar();
  contributionDetails: CoveragePeriodWrapper = new CoveragePeriodWrapper();
}
export class CoveragePeriodWrapper {
  periods: CoveragePeriod[] = [];
  currentPeriod: CoveragePeriod = new CoveragePeriod();
}
export class CoveragePeriod {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  coverages: Coverage[] = [];
}
export class Coverage {
  coverage = 0;
  coverageType: BilingualText = new BilingualText();
  contributorPercentage = 0;
  contributorShare = 0;
  establishmentPercentage = 0;
  establishmentShare = 0;

  fromJsonToObject(json: Coverage) {
    Object.keys(json).forEach(key => {
      if (key in new Coverage()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
