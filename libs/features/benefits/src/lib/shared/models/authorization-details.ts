/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AgentDto } from './agent-details';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AuthorizerDto } from './authorizer-details';
import { CustodianDto } from './custodian-details';
import { MinorDto } from './minor-details';

export class AuthorizationDetailsDto {
  authorizationList: AuthorizationList[];
}

export class AuthorizationList {
  agent: AgentDto;
  authorizationNumber: number;
  authorizationSource: BilingualText;
  authorizationType: BilingualText;
  authorizerList: AuthorizerDto[];
  authorizationId?: number;
  custodian: AgentDto;
  endDate: GosiCalendar;
  isActive: boolean;
  isReceiveBenefitPurpose: boolean;
  isRequestBenefitPurpose: boolean;
  isBeneficiarysAuthorisedPerson: boolean;
  minorList: MinorDto;
  status?: BilingualText;
}
