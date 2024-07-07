/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText, BankAccount } from '@gosi-ui/core';
import { Clauses } from './clauses';
import { ContractWorkDetails } from './contract-work-details';
import { AuthorisedSignatory } from './authorised-signatory';
import { ContractPeriod } from './contract-period';
import { WageInfo } from './wage-info';

export class ContractDetails {
  id: number = undefined;
  contractType: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  status: string = undefined;
  approvalDate: GosiCalendar = new GosiCalendar();
  approvedBy: string = undefined;
  cancelDate: GosiCalendar = new GosiCalendar();
  rejectionReason: BilingualText = new BilingualText();
  note: string = undefined;
  engagementId: number = undefined;
  workType: BilingualText = new BilingualText();
  religion: BilingualText = new BilingualText();
  dateFormat: string = undefined;
  contractPeriod: ContractPeriod = new ContractPeriod();
  contractClauses: Clauses[] = [];
  oldContract: boolean = undefined;
  submissionDate: GosiCalendar = new GosiCalendar();
  statusDate: GosiCalendar = new GosiCalendar();
  terminationReason: BilingualText = new BilingualText();
  workDetails: ContractWorkDetails = new ContractWorkDetails();
  authorisedSignatory: AuthorisedSignatory = new AuthorisedSignatory();
  bankAccount?: BankAccount; //Optional field if bank details present in contributor transient / approved contract
  wage?: WageInfo; //Optional field for wage of approved contract
}
