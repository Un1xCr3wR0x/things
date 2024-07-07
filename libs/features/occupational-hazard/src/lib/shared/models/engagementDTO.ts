import { GosiCalendar, BilingualText, ContactDetails } from '@gosi-ui/core';
import { PendingTransaction } from './pendingTransaction';
import { EngagementPeriod } from './engagement-period';
import { MolEstablishmentIdDto, TransactionRefInfo } from '.';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


/**
 * Wrapper class to hold Engagement details.
 *
 * @export
 * @class Engagement
 */
export class EngagementDTO {
  approvalDate : GosiCalendar;
  approvalStatus: string;
  backdatingIndicator: boolean;
  cancellationReason : BilingualText;
  companyWorkerNumber: string;
  contractEndDate : GosiCalendar;
  contractStartDate : GosiCalendar;
  contractWorkflow : PendingTransaction = new PendingTransaction();  
  engagementId : number;
  engagementPeriod : EngagementPeriod[];
  engagementType : string;
  establishmentContactDetails : ContactDetails = new ContactDetails();
  establishmentLegalEntity : BilingualText = new BilingualText();
  establishmentName : BilingualText = new BilingualText();
  establishmentStatus : BilingualText = new BilingualText();
  formSubmissionDate : GosiCalendar = new GosiCalendar();
  gccEstablishment: boolean;
  hasActiveBranchesInGroup : boolean;
  isContractsAuthRequired: boolean;
  joiningDate : GosiCalendar = new GosiCalendar();
  lastModifiedTimeStamp : GosiCalendar = new GosiCalendar();
  leavingDate : GosiCalendar = new GosiCalendar();
  leavingReason : BilingualText = new BilingualText();
  molEstablishmentId : number;
  molEstablishmentIds : MolEstablishmentIdDto = new MolEstablishmentIdDto();
  molOfficeId : number
  molunId: number;
  ownerNin : number;
  penaltyIndicator : boolean;
  pendingTransaction : TransactionRefInfo = new TransactionRefInfo();
  prisoner : boolean;
  proactive : boolean;
  purposeOfRegistration : BilingualText = new BilingualText();
  recruitmentNumber : number;
  registrationNo: number;
  socialInsuranceNo: number;
  status : string;
  student : boolean;
  vicIndicator : boolean;
  workType : BilingualText = new BilingualText();
  workingDays : number;
  workingHours : number;
  workingHoursStandard : string;
}
