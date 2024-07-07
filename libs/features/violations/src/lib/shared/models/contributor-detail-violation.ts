import {BilingualText, BorderNumber, DocumentItem, Iqama, NationalId, NIN, Passport} from "@gosi-ui/core";


export class ContributorDetailViolation {
  contributorId: number;
  contributorName: BilingualText = new BilingualText();
  violationAmount: number;
  appealReason?: string;
  identity: number;
  identifier?: number;
  documents?: DocumentItem[];
}
