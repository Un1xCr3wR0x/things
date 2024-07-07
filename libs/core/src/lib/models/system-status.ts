/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';
import { SystemStatusEnum } from '../enums';
export class SystemStatus {
  code: SystemStatusEnum;
  message: BilingualText;
  refreshKey: string;
  status: string;
  messageKey?: string;
  messageParam?: Object;
}
