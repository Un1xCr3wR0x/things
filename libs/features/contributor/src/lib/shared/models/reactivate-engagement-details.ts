import { BilingualText } from "@gosi-ui/core";
import { EngagementDetails } from "./engagement-details";




 export class ReactivateEngagementDetails{
  reactivateReason?: BilingualText = new BilingualText();
  crmid?: number = undefined;
  engagements?: EngagementDetails;
 }
