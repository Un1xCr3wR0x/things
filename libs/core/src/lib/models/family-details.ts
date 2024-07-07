import { BilingualText } from './bilingual-text';
import { ContactDetails } from './contact-details';

export class FamilyDetails {
  id?: number;
  name: BilingualText = new BilingualText();
  contactDetail: ContactDetails = new ContactDetails();
}
