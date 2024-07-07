/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class AddMemberExistResponse {
  boolean
  english: string = undefined;
  arabic: string = undefined;
  message: BilingualText;
  identificationNo: undefined;
}
