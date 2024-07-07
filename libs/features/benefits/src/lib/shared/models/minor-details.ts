import { AgentDto } from './agent-details';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AuthorizerDto } from './authorizer-details';
import { CustodianDto } from './custodian-details';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class MinorDto {
  ageInHijiri: number;
  dateOfBirth: GosiCalendar;
  fullName: string;
  id: string;
  isStillMinor: boolean;
  minorType: number;
  nationality: BilingualText;
  relation: BilingualText;
  sex: BilingualText;
}
