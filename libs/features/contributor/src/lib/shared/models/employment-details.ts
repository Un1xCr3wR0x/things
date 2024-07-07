/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText, DocumentSubmitItem } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';

/**
 * The wrapper class for personal information.
 *
 * @export
 * @class EmploymentDetails
 */

export class EmploymentDetails {
  joiningDate: GosiCalendar = new GosiCalendar();
  companyWorkerNumber: string = undefined;
  //contributorAbroad : for add contributor
  contributorAbroad = false;
  workType: BilingualText = new BilingualText();
  engagementPeriod: EngagementPeriod[] = [];
  student = false;
  prisoner = false;
  scanDocuments: DocumentSubmitItem[] = [];
  penaltyIndicator = false;
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  isContributorActive = false;
  backdatingIndicator = false;
}
