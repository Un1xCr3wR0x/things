import { ContributorContribution } from './contributor-contribution';
import { PersonDetails } from './person-details';

export class ItemizedContributionDetails {
  person: PersonDetails = new PersonDetails();
  contributorContribution: ContributorContribution = new ContributorContribution();
  calculationRate: number = undefined;
  contributionUnit: number = undefined;
}
