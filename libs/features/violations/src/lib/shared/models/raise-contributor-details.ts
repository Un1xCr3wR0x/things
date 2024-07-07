import { BilingualText, BorderNumber, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { RaiseEngagementDetails } from './raise-engagement-details';
import { RaiseWrongBenefits } from './raise-wrong-benefits';
export class RaiseContributorDetails {
  contributorId?: number = undefined;
  socialInsuranceNumber: number = undefined;
  recordAction: String = undefined;
  engagementDetails: RaiseEngagementDetails[] = [];
  benefitsDetails?: RaiseWrongBenefits[] = [];
  contributorName?: BilingualText;
  identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  enableEdit?: boolean;
}

export class RaiseViolationResponse {
  message: BilingualText = new BilingualText();
  referenceNo: number = undefined;
  violationId: number = undefined;
}
