import { EngagementBean } from './engagement-bean';
import { EngagementOccupationBean } from './engagement-occupation-bean';
import { LastContributionDetails } from './last-contribution-details';
import { WageDetailsList } from './wage-details-list';

export class VICInfo {
  id: number = undefined;

  vicwagedetailslist: WageDetailsList[] = [];
  viclastcontributiondetails: LastContributionDetails[] = [];
  vicengagementbean: EngagementBean[] = [];
  vicengagementoccupationbean: EngagementOccupationBean[] = [];

  hasactivewagerequest: string = undefined;
  requestsubmissiondatestr: Date = new Date();
  totalviccontribution: number = undefined;
}
