/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BankAccount, BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AuthorisedSignatory } from './authorised-signatory';
import { ContractPeriod } from './contract-period';
import { ContractWorkDetails } from './contract-work-details';
import { WageDetails } from './wage-details';
import { UpdatedPeriodDetailsEinsp } from './updatedPeroidEinsp';
import { EngagementPeriod } from './engagement-period';

export class ContractRequest {
  startDate: GosiCalendar = new GosiCalendar();
  contractPeriod: ContractPeriod = new ContractPeriod();
  contractType: BilingualText = new BilingualText();
  religion: BilingualText = new BilingualText();
  dateFormat: string = undefined;
  workDetails: ContractWorkDetails = new ContractWorkDetails();
  bankAccount: BankAccount = new BankAccount();
  authorisedSignatory: AuthorisedSignatory = new AuthorisedSignatory();
}
export interface Choice {
  action: string;
  comments: string;
}
export class  ViolationRequest {
  joiningDate: {
    gregorian: string;
    hijiri: string;
  };
  leavingDate: {
    gregorian: string;
    hijiri: string;
  };
  leavingReason: {
    arabic: string;
    english: string;
  };
  violationSubType?: {
    arabic: string;
    english: string;
  };
  violationType: {
    arabic: string;
    english: string;
  };
  engagementId: number;
  wage?: WageDetails;
  periodChangeSummary?: UpdatedPeriodDetailsEinsp[] = [];
  wageSummary?: EngagementPeriod[] = [];
}
