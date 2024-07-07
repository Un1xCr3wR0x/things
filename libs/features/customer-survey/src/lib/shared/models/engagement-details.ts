/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/** The wrapper class for engagement details. */
export class EngagementDetails {
  backdatingIndicator = false;
  companyWorkerNumber: string = undefined;
  contributorAbroad = false;
  engagementId: number = undefined;
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  isContractsAuthRequired = false;
  lastModifiedTimeStamp: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  proactive = false;
  status: string = undefined;
  student = false;
  workType: BilingualText = new BilingualText();
  //Added for change engagement module
  leavingReason: BilingualText = new BilingualText();
  cancellationReason: BilingualText = new BilingualText();
  purposeOfRegistration?: BilingualText = new BilingualText();
  isContributorActive?: Boolean = false;
  contractTransactionId? = 0;
  editFlow = false; //To indicate validator edit mode
  penaltyIndicator: number = undefined;
  vicIndicator = false;
  vicNoOfPaidMonths? = 0;
  vicNoOfPaidDays? = 0;
  vicNoOfUnpaidMonths? = 0;
  engagementType: string = undefined;
  establishmentLegalEntity?: BilingualText; //Added to identify change in legal entity of establishment.
  //Added for unified profile
  registrationNo?: number;
  gccEstablishment?: boolean;
  hasActiveBranchesInGroup?: boolean;
  establishmentName?: BilingualText;
  establishmentStatus?: BilingualText;
}
