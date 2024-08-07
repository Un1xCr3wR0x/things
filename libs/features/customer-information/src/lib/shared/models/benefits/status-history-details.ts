/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class StatusHistoryDetails {
  heirStatus: BilingualText;
  status: BilingualText;
  fromDate: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
  toDate: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
}
