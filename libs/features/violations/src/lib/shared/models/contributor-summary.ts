import { BilingualText, BorderNumber, GosiCalendar, Iqama, Name, NationalId, NIN, Passport } from '@gosi-ui/core';
import { Engagements } from './engagement-info';
export class ContributorSummary {
  contributorId?: number;
  contributorName: BilingualText = new BilingualText();
  socialInsuranceNo: number;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  engagements: Engagements[] = [];
}
