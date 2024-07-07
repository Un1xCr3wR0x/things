import { PersonDetails } from './person-details';

export class ViolatedContributorsDetails {
  person: PersonDetails = new PersonDetails();
  contributorId: number = undefined;
  difference: number = undefined;
  newViolationAmount: number = undefined;
  oldViolationAmount: number = undefined;
}
