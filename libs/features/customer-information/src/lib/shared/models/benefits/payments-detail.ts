/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class PaymentsDetail {
  amount: number;
  dateFrom: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
  dateTo: {
    entryFormat: string;
    gregorian: Date;
    hijiri?: string;
  };
  payementType: BilingualText;
}
