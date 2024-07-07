import { BilingualText, GosiCalendar } from "@gosi-ui/core";
import { EngagementDetails } from "./engagement-details";




 export class ReactivateEligibilityDetails{
  coverages: []=[];
  engagementId: number = undefined;
  joiningDate:GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  status: string[] = [];
 }
