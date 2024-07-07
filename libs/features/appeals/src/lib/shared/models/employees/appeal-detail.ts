export class AppealDetail {
  appealId: number;
  auditorComments: string;
  auditorDecision: string;
  finalDecision: string;
  finalDecisionComments: string;
  finalDecisionDate: {
    calendarType: string;
    firstDayOfWeek: number;
    lenient: boolean;
    minimalDaysInFirstWeek: number;
    time: string;
    timeInMillis: number;
    timeZone: {
      displayName: string;
      dstsavings: number;
      id: string;
      rawOffset: number;
    };
    weekDateSupported: boolean;
    weekYear: number;
    weeksInWeekYear: number;
  };
  finalLegalOpinion: string;
  finalLegalOpinionComments: string;
  finalOpinion: number;
  finalOpinionComments: string;
  legalOpinion: number;
  legalOpinionComments: string;
  objector: number;
  opinion: string;
  opinionComments: string;
  reason: string;
  refNumber: number;
  reviewerComments: string;
  reviewerDecision: string;
  reviewerIsAcceptedFormally: string;
  reviewerIsAcceptedObjectively: string;
  reviewerObjectionComments: string;
  status: {
    arabic: string;
    english: string;
  };
  summary: string;
  transactionRefNumber: number;
  transactionSource: {
    arabic: string;
    english: string;
  };
  type: number;

  constructor(data?: any) {
    if (data) {
      this.appealId = data.appealId;
      this.auditorComments = data.auditorComments;
      this.auditorDecision = data.auditorDecision;
      this.finalDecision = data.finalDecision;
      this.finalDecisionComments = data.finalDecisionComments;
      this.finalDecisionDate = data.finalDecisionDate;
      this.finalLegalOpinion = data.finalLegalOpinion;
      this.finalLegalOpinionComments = data.finalLegalOpinionComments;
      this.finalOpinion = data.finalOpinion;
      this.finalOpinionComments = data.finalOpinionComments;
      this.legalOpinion = data.legalOpinion;
      this.legalOpinionComments = data.legalOpinionComments;
      this.objector = data.objector;
      this.opinion = data.opinion;
      this.opinionComments = data.opinionComments;
      this.reason = data.reason;
      this.refNumber = data.refNumber;
      this.reviewerComments = data.reviewerComments;
      this.reviewerDecision = data.reviewerDecision;
      this.reviewerIsAcceptedFormally = data.reviewerIsAcceptedFormally;
      this.reviewerIsAcceptedObjectively = data.reviewerIsAcceptedObjectively;
      this.reviewerObjectionComments = data.reviewerObjectionComments;
      this.status = data.status;
      this.summary = data.summary;
      this.transactionRefNumber = data.transactionRefNumber;
      this.transactionSource = data.transactionSource;
      this.type = data.type;
    }
  }

}
