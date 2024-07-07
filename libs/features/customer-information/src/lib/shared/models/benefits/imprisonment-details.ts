/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { AdjustmentDetails } from './adjustment-details';

export class ImprisonmentDetails {
  enteringDate = new GosiCalendar();
  releaseDate = new GosiCalendar();
  hasCertificate: boolean;
  prisoner: boolean;
  adjustments?: AdjustmentDetails[];
  totalAdjustmentAmount?: number;
  netPreviousAdjustmentAmount?: number;
  netAdjustmentAmount?: number;
  debit?: boolean;
}
