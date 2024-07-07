/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Agent } from './agent';
import { AuthorizerList } from './authorizer-list';

export class AttorneyDetails {
  attorneyNumber: number = undefined;
  agent: Agent;
  authorizerList: AuthorizerList[] = [];
  issueDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  attorneyStatus: BilingualText = new BilingualText();
  attorneyType: string;
  attorneyText: string;
  responseMessage: string;
  responseCode: boolean;
  authorizationSource: number;
  requestBenefitPurpose?: boolean;
  receiveBenefitPurpose?: boolean;
  countryOfIssue?: BilingualText = new BilingualText();
  ibanBankAccountNo?: string;
  referenceNumber?: string;
}
