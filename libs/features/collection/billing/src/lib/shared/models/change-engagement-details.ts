import { ChangeType } from './change-type';
import { PersonDetails } from './person-details';

export class ChangeEngagementDetails {
  changeType: ChangeType[];
  person: PersonDetails = new PersonDetails();
}
