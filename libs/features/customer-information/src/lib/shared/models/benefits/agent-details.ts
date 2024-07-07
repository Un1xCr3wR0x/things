import { BilingualText, BorderNumber, Iqama, Name, NationalId, NIN, Passport } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AgentDto {
  fullName: string;
  id: string;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  isValid: boolean;
  name: Name;
  nationality: BilingualText;
  sex: BilingualText;
}
