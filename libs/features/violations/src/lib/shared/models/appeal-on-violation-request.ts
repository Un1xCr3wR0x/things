/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AppealOnViolationRequest {
  appealId: number;
  violationId: number;
  contributorId: number;
  notes: string=null;
  valid: boolean;
  legalOpinion: string=null;
  opinion: string=null;
  opinionGiverNotes: string=null;
  opinionNotes: string=null;
  opinionReviewNotes: string=null;
  agree:boolean;
}

