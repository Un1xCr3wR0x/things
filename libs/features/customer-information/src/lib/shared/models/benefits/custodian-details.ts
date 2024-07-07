import { AgentDto } from './agent-details';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { AuthorizerDto } from './authorizer-details';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class CustodianDto {
  dateOfBirth: GosiCalendar;
  fullName: string;
  id: string;
  name: BilingualText;
  nationality: BilingualText;
  sex: BilingualText;
}
