import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { RaiseContributorDetails } from './raise-contributor-details';

export class RaiseViolationContributor {
  contributorDetails: RaiseContributorDetails[] = [];
  discoveredAfterInspection: boolean;
  discoveryDate: GosiCalendar = new GosiCalendar();
  inspectionType: BilingualText = new BilingualText();
  referenceNo: number = undefined;
  violationDescription: String = undefined;
  violationType: BilingualText = new BilingualText();
  visitId: String = undefined;
}
