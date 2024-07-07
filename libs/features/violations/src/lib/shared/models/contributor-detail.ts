import {BilingualText, DocumentItem} from "@gosi-ui/core";


export class ContributorDetail {
  contributorId: number;
  contributorName: BilingualText = new BilingualText();
  violationAmount: number;
  appealReason?: string;
  idType?: string;
  idNumber?: number;
  identifier?: number;
  documents?: DocumentItem[];
  docReview?: string;
  reason?: string;
  contributorDocuments?: string[];
}
