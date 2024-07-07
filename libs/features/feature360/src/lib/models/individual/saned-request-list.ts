import { GosiEligibilityReasonAsList } from './gosi-eligibility-reason-as-list';
import { NesEligibilityReasonAsList } from './nes-eligibility-reason-as-list';

export class SanedRequestList {
  createdby: string = undefined;
  creationtimestamp: Date = new Date();
  lastmodifiedby: string = undefined;
  lastmodifiedtimestamp: Date = new Date();
  moduleid: number = undefined;
  mode: string = undefined;
  newninumber: number = undefined;
  personid: number = undefined;
  contributorid: number = undefined;
  benefitrequestid: number = undefined;
  cycledate: number = undefined;
  processstatus: string = undefined;
  processdate: string = undefined;
  comments: string = undefined;
  sanedrequeststatus: string = undefined;
  gosieligibilityreason: string = undefined;
  sanedrequestid: string = undefined;
  nesrequestdate: number = undefined;
  iban: string = undefined;
  neseligibilitystatus: number = undefined;
  neseligibilityreason: string = undefined;
  gosieligibilitystatus: number = undefined;

  neseligibilityreasonaslist: NesEligibilityReasonAsList[] = [];
  gosieligibilityreasonaslist: GosiEligibilityReasonAsList[] = [];
}
