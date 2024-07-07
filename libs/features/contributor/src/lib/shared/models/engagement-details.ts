/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, ContactDetails, GosiCalendar } from '@gosi-ui/core';
import { ContractDetails } from './contract-details';
import { CoveragePeriod } from './coverage-period';
import { DropDownItems } from './drop-down';
import { EngagementPeriod } from './engagement-period';
import { MOLEstablishmentDetails } from './mol-establishment-details';
import { PendingContractTransaction } from './pending-contract-transaction';
import { PeriodDifference } from './period-difference';
import { TerminateContributorDetails } from './terminate-contributor-details';
import { TransactionRefDetails } from './transaction-ref-details';

/** The wrapper class for engagement details. */
export class EngagementDetails {
  backdatingIndicator = false;
  companyWorkerNumber: string = undefined;
  aggregationType?: string = undefined;
  paidStatus?: Boolean = false;
  contracts?: ContractDetails[] = [];
  contributorAbroad = false;
  engagementId: number = undefined;
  engagementPeriod: EngagementPeriod[] = [];
  actualEngagementPeriod?: EngagementPeriod;
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
  updatedPeriod?: EngagementPeriod = new EngagementPeriod(); //For verifying period for which wage is changed.
  contractWorkflow?: PendingContractTransaction[] = [];
  contractTransactionId? = 0;
  editFlow = false; //To indicate validator edit mode
  engagementDuration: PeriodDifference = new PeriodDifference();
  duration?: PeriodDifference = new PeriodDifference();
  penaltyIndicator: number = undefined;
  pendingTransaction: TransactionRefDetails[] = [];
  vicIndicator = false;
  vicNoOfPaidMonths? = 0;
  vicNoOfPaidDays? = 0;
  vicNoOfUnpaidMonths? = 0;
  ppaIndicator?: boolean;
  engagementType: string = undefined;
  establishmentLegalEntity?: BilingualText; //Added to identify change in legal entity of establishment.
  //Added for unified profile
  registrationNo?: number;
  recruitmentNumber?: number;
  gccEstablishment?: boolean;
  hasActiveBranchesInGroup?: boolean;
  establishmentName?: BilingualText;
  establishmentStatus?: BilingualText;
  skipContract: boolean = false;
  coverageDetails?: CoveragePeriod;
  allCoverage?: CoveragePeriod[] = [];
  contractId?: number;
  contractDetailsFlag? = false;
  establishmentContactDetails?: ContactDetails = new ContactDetails();
  molEstablishmentIds?: MOLEstablishmentDetails = new MOLEstablishmentDetails();
  actionList?: DropDownItems[] = [];
  overallactionList?: DropDownItems[] = [];
  selectedItem?: string;
  formattedJoiningDate?: string;
  formattedLeavingDate: string;
  socialInsuranceNo?: number;
  hasOverlappingEngagement?: boolean;
  terminationDetails?: TerminateContributorDetails;
  secondment?: boolean;
  studyLeave?: boolean;
  reactivationAllowed?: boolean = false;
  reactivated?: boolean = false;
  formSubmissionMonthDifference?: number = undefined;

  // For individual app
  EstablishmentName?: BilingualText = new BilingualText();
  EstablishmentUnifiedNumber?: number = undefined;
  hrsdEstablishmentId?: number = undefined;
  CommercialRegistrationNumber?: number = undefined;
  EstablishmentOwnerID?: number = undefined;
  GOSIRegistrationNumber?: number = undefined;
  engagementSourceType?: BilingualText;
  // For legacy
  sourceEngId: number;

  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      if (key in new EngagementDetails()) {
        if (key === 'engagementPeriod') {
          if (json[key]?.length > 0) {
            for (let i = 0; i < json[key].length; i++) {
              this.engagementPeriod.push(new EngagementPeriod().fromJsonToObject(json[key][i]));
            }
          }
        } else if (key === 'engagementDuration') {
          this[key] = new PeriodDifference().fromJsonToObject(json[key]);
        } else if (key === 'duration') {
          this[key] = new PeriodDifference().fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
