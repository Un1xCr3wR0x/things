import { BilingualText, GosiCalendar, UuidGeneratorService } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class MiscellaneousRequest {
  adjustmentDetails: AdjustmentDetail[] = [];
  adjustmentLevel: string;
  adjustmentReason: BilingualText;
  adjustmentType: string;
  reason: string;
  description: String;
  comments: string;
  periodStartDate: GosiCalendar;
  periodEndDate: GosiCalendar;
  uuid: String;
  totalAdjustment: number;
}
export class AdjustmentDetail {
  amount: number;
  billProductType: string;
  identifier: number;
  fromJsonToObject(json) {
    if (json) {
      Object.keys(json).forEach(key => {
        if (key === 'identifier') this[key] = Number(json[key]);
        else this[key] = json[key];
      });

      return this;
    }
  }
}
