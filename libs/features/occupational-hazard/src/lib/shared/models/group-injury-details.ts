/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, DocumentSubmitItem, GosiCalendar, MobileDetails, TransactionReferenceData } from "@gosi-ui/core";
import { Injury } from "./injury-details";
import { Person } from "./person";
import { ValidationComments } from "./validation-comment";
import { InjuredContributorsDetails } from "./injured-contributors-details";


export class GroupInjury{
  accidentType: BilingualText = new BilingualText();
  auditStatus: string = undefined;
  allowancePayee: number;
  contributorId: number;
  socialInsuranceNo: number;
  rejectionAllowedIndicator?: boolean;
  autoValidationComments?: ValidationComments[] = [];
  city: BilingualText = new BilingualText();
  cityDistrict: BilingualText = new BilingualText();
  closingDate: GosiCalendar = new GosiCalendar();
  engagementStartDate: GosiCalendar = new GosiCalendar();
  comments: string = undefined;
  country: BilingualText = new BilingualText();
  deathDate: GosiCalendar = new GosiCalendar();
  treatmentCompleted: boolean;
  detailedPlace: string = undefined;
  emergencyContactNo: MobileDetails = new MobileDetails();
  employeeInformedDate: GosiCalendar = new GosiCalendar();
  employerInformedDate: GosiCalendar = new GosiCalendar();
  engagementId: number = undefined;
  establishmentName?: BilingualText;
  finalDiagnosis: string = undefined;
  foregoExpenses?: Boolean;
  governmentSector: BilingualText = new BilingualText();
  hasRejectionInProgress?: Boolean;
  hasActiveEngagement?: Boolean;
  hasOpenComplication?: Boolean;
  hasRejectedComplication?: Boolean;
  hasPendingChangeRequest?: Boolean;
  injuryDetailsModifiedIndicator?: boolean;
  injuryLeadsToDeathIndicator : boolean;
  injuryDate: GosiCalendar = new GosiCalendar();
  injuryHour: string = undefined;
  injuryId?: number = undefined; 
  injuryMinute: string = undefined;
  injuryNo: number = undefined;
  injuryReason: BilingualText = new BilingualText();
  injuryTimeAmPm: number;
  injuryStatus: BilingualText;
  injuryTime: string = undefined;
  injuryToDeathIndicator = false;
  injuryType?: BilingualText;
  latitude: string = undefined;
  listOfTransactionReferenceData?: TransactionReferenceData[];
  lineOfTreatment: BilingualText = new BilingualText();
  modifyInjuryIndicator? = false;
  longitude: string = undefined;
  occupation: BilingualText = new BilingualText();
  place: BilingualText = new BilingualText();
  reopenAllowedIndicator?: Boolean;
  reasonForDelay: BilingualText = new BilingualText();
  rejectInitiatedDate: GosiCalendar = new GosiCalendar();
  reopenInitiatedDate: GosiCalendar = new GosiCalendar();
  rejectionReason: BilingualText = new BilingualText();
  reopenReason: BilingualText = new BilingualText();
  requiredDocuments: BilingualText[] =[];
  scanDocuments: DocumentSubmitItem[];
  status: BilingualText = new BilingualText();
  totalInjuryCount?: number = undefined;
  tpaCode?: string;
  workDisabilityDate: GosiCalendar = new GosiCalendar();
  workFlowStatus?: number = undefined;
  navigationIndicator?: number = undefined;
  modifiedInjuryDetails?: Injury;
  reasonActive?: Boolean;
  person: Person;
  isExpanded : boolean;
  groupInjuryId: string;
  isEdited?: Boolean;
  isDeleted?: Boolean;
  bulkInjuryRequestItemId?: number;
  groupInjuryContributorDetails : InjuredContributorsDetails[] = [];
  detailsDescription : string;
  isInjuryReasonNull?: Boolean;
}
