/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AgentDto } from './agent-details';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AuthorizerDto } from './authorizer-details';
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
  custodian: AgentDto;
  endDate: GosiCalendar;
  isReceiveBenefitPurpose: boolean;
  isRequestBenefitPurpose: boolean;
  minorList: MinorDto;
}
