/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, DocumentSubmitItem, TransactionReferenceData, BilingualText } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';

/**
 * The wrapper class for engagement information.
 *
 * @export
 * @class Engagement
 */

export class Engagement {
  approvalDate: GosiCalendar = new GosiCalendar();
  companyWorkerNumber: String;
  contributorAbroad = false;
  establishmentName: BilingualText = new BilingualText();
  engagementPeriod: EngagementPeriod[] = [];
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  prisoner = false;
  proactive = false;
  scanDocuments: DocumentSubmitItem[] = [];
  student = false;
  transactionReferenceData?: TransactionReferenceData[] = [];
  workType: BilingualText = new BilingualText();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  isContributorActive = false;
  backdatingIndicator = false;
  penaltyIndicator = false;
  description: string = undefined;
  age: number;
  registrationNo : number;

  constructor() {
    this.formSubmissionDate = { gregorian: new Date(), hijiri: '1430-05-10' };
  }
}
