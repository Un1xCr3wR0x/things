import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class RejectedUnitService {
  disputedUnits: number = undefined;
  rejectionReason: BilingualText = new BilingualText();
  serviceId: number = undefined;
}
