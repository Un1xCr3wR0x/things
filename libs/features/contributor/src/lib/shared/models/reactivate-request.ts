import { BilingualText } from '@gosi-ui/core';

export class ReactivateEngagementRequest {
  editFlow?: boolean = undefined;
  comments?: string = undefined;
  reactivateReason?: BilingualText = new BilingualText();
  crmid?: number = undefined;
  penaltyIndicator?: boolean = undefined;
}
