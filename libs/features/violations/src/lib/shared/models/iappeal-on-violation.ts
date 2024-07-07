import { BilingualText } from '@gosi-ui/core';

export interface IAppealOnViolation {
  appealId: number;
  transactionRefNumber: number;
  transactionSource: BilingualText;
  type: number;
  objector: number;
  status: BilingualText;
  refNumber: number;
  decisions: Decision[];
  contributorDocuments?: {
    contributorId: number;
    documents: string[];
  }[]; 
}

export interface Decision {
  contributorId: any;
  reviewerIsAcceptedFormally: boolean;
  reviewerComments: string;
  reviewerIsAcceptedObjectively: boolean;
  reviewerObjectionComments: string;
  reviewerDecision: BilingualText;
  opinion: any;
  opinionComments: string;
  legalOpinion: BilingualText;
  legalOpinionComments: string;
  auditorDecision: boolean;
  auditorComments: any;
  finalOpinion: any;
  finalOpinionComments: string;
  finalLegalOpinion: BilingualText;
  finalLegalOpinionComments: string;
  summary: any;
  finalDecision: string;
  finalDecisionDate: any;
  finalDecisionComments: any;
  executorDecision: string;
  executorComments: string;
  reason: string;
}
