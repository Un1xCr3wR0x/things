import {BilingualText, DocumentItem, GosiCalendar, Iqama, NIN} from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AppealOnViolation {
  appealId: number;
  violationId: number;
  submissionDate: GosiCalendar;
  transactionTraceId: number;
  status: BilingualText;
  comments: String;
  contributors: AppealContributors[]=[];
  customerSummary: CustomerInfo;
  personId: number;
  establishmentName: BilingualText = new BilingualText();
  violationType: BilingualText = new BilingualText();
  penaltyAmount: number;
  registrationNo: number;
  showSaveError?: boolean;

}


export class AppealContributors {
  contributorId: number;
  contributorName: BilingualText;
  penaltyAmount: number;
  appealReason: string;
  documents: DocumentItem[]=[];
  documentsReview?: documentsReview = new documentsReview();
  opinion: opinion = new opinion();
  opinionReview: opinionReview = new opinionReview();
  showSaveError: boolean = false;
  showMandatoryError?: boolean;
  isSaved?: boolean;
  doc: DocumentItem[]=[];
  persionIdentifier:PersonIdentifier = new PersonIdentifier();
 
 }


export class documentsReview {
  valid?: boolean;
  notes: string;
}

export class opinion {
  valid: boolean;
  notes: string;
  opinion: string;
  opinionNotes: string;
  legalOpinion: string;
  opinionGiverNotes: string;
}

export class opinionReview {
  agree: boolean;
  notes: string;
}


export class CustomerInfo {
  customerName: BilingualText = new BilingualText();
  id: NIN | Iqama;
  regNo: string;
  emailId: string;
  customerType: string;
}

class PersonIdentifier {
  personIdentifier: string;
  idType: string;
  nationality: string;
}
