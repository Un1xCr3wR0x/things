import { Name, Person } from '@gosi-ui/core';

export class ContributorsInfo {
  contributors: ContributorData[];
  // person: Person[];
}

export class ContributorData {
  approvalStatus: String;
  bankAccountDetails: any;
  contributorType: String;
  hasActiveTerminatedOrCancelled: Boolean;
  hasActiveWorkFlow: Boolean;
  hasLiveEngagement: Boolean;
  hasVICEngagement: Boolean;
  isBeneficiary: any;
  mergedSocialInsuranceNo: Number;
  mergerStatus: any;
  name: Name = new Name();
  person: Person;
  socialInsuranceNo: number;
  statusType: number;
  totalWage: number;
  vicIndicator: boolean;
  wpsWage: any;
}
